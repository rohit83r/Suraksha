# worker.py
import os
import json
import time
from collections import deque
from datetime import datetime, timezone

import redis
import pandas as pd

from features import compute_window_features
from scorer import ModelScorer

REDIS_URL = os.environ.get("REDIS_URL", "redis://redis:6379")
WINDOW_SIZE = int(os.environ.get("WINDOW_SIZE", "20"))
ANOMALY_THRESHOLD = float(os.environ.get("ANOMALY_THRESHOLD", "-0.2"))
MODEL_PATH = os.environ.get("MODEL_PATH", "/models/if_model.joblib")
MAX_PING_GAP_SECONDS = int(os.environ.get("MAX_PING_GAP_SECONDS", str(60 * 10)))  # 10 min default

r = redis.Redis.from_url(REDIS_URL, decode_responses=True)
p = r.pubsub(ignore_subscribe_messages=True)
p.subscribe("locations")
print("[worker] Subscribed to 'locations' ->", REDIS_URL)

scorer = ModelScorer(MODEL_PATH)

# in-memory per-tourist sliding window; for scale move to Redis
state = {}

def iso_to_utc(dt_str):
    # robust parse: pandas handles many formats and sets tz if present
    try:
        ts = pd.to_datetime(dt_str)
        if ts.tzinfo is None:
            ts = ts.tz_localize('UTC')
        return ts
    except Exception:
        return pd.to_datetime(datetime.utcnow()).tz_localize('UTC')

def publish_alert(alert: dict):
    try:
        r.publish("alerts", json.dumps(alert))
        print("[worker] published alert:", alert.get('type'), alert.get('touristId'))
    except Exception as e:
        print("[worker] failed to publish alert:", e)

for msg in p.listen():
    try:
        data = json.loads(msg["data"])
        tourist = data.get("touristId")
        if not tourist:
            continue

        if tourist not in state:
            state[tourist] = deque(maxlen=WINDOW_SIZE)
        state[tourist].append(data)
        window = list(state[tourist])

        # compute last ping gap
        try:
            last_ts = window[-1].get("ts")
            last_ts_pd = pd.to_datetime(last_ts)
            if last_ts_pd.tzinfo is None:
                last_ts_pd = last_ts_pd.tz_localize('UTC')
            gap = (pd.Timestamp.utcnow().tz_localize('UTC') - last_ts_pd).total_seconds()
        except Exception:
            gap = 0

        # Rule: if no ping for long -> GPS_LOSS / MISSING
        if gap > MAX_PING_GAP_SECONDS:
            alert = {
                "touristId": tourist,
                "lat": window[-1].get("lat"),
                "lng": window[-1].get("lng"),
                "type": "GPS_LOSS",
                "message": f"No ping for {gap/60:.1f} minutes",
                "ts": datetime.utcnow().isoformat()
            }
            publish_alert(alert)
            continue

        feat_vec, meta = compute_window_features(window)
        if feat_vec is None:
            continue

        # Score from model (if available)
        score, pred = scorer.score(feat_vec)
        is_anom = False
        if pred is not None:
            is_anom = (pred == -1) or (score is not None and score < ANOMALY_THRESHOLD)

        # Ensemble rule: require anomaly OR extreme gps accuracy
        last_accuracy = float(window[-1].get("accuracy") or 0.0)
        if is_anom or last_accuracy > 50:
            alert = {
                "touristId": tourist,
                "lat": window[-1].get("lat"),
                "lng": window[-1].get("lng"),
                "type": "ANOMALY" if is_anom else "GPS_LOSS",
                "score": score,
                "message": f"Anomaly detected (score={score})" if is_anom else f"Low accuracy {last_accuracy}m",
                "meta": meta,
                "ts": datetime.utcnow().isoformat()
            }
            publish_alert(alert)

    except Exception as e:
        print("[worker] error:", e)
        time.sleep(0.1)
