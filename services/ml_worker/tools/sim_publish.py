# sim_publish.py
# Simple simulator that publishes normal + anomalous traces to Redis "locations" channel
import redis
import json
import time
import uuid
from random import uniform, choice

r = redis.Redis.from_url("redis://localhost:6379", decode_responses=True)

def publish_normal(tourist_id, center_lat=12.9716, center_lng=77.5946, n=60, freq=1.0):
    lat, lng = center_lat, center_lng
    for i in range(n):
        payload = {
            "id": str(uuid.uuid4()),
            "touristId": tourist_id,
            "lat": lat + uniform(-0.0003, 0.0003),
            "lng": lng + uniform(-0.0003, 0.0003),
            "speed": round(uniform(0.2, 1.5), 2),
            "accuracy": round(uniform(5, 12), 2),
            "ts": __import__("datetime").datetime.utcnow().isoformat()
        }
        r.publish("locations", json.dumps(payload))
        time.sleep(freq)

def publish_jump(tourist_id):
    # simulate teleportation / suspicious jump
    payload = {
        "id": str(uuid.uuid4()),
        "touristId": tourist_id,
        "lat": 28.7041,  # far away
        "lng": 77.1025,
        "speed": 0.0,
        "accuracy": 50.0,
        "ts": __import__("datetime").datetime.utcnow().isoformat()
    }
    r.publish("locations", json.dumps(payload))

if __name__ == "__main__":
    tid = "tourist-test-1"
    print("Publishing normal trace...")
    publish_normal(tid, n=30, freq=0.5)
    time.sleep(1)
    print("Publishing anomalous jump...")
    publish_jump(tid)
    print("Done.")
