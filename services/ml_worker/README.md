# ML Worker (Suraksha)

Minimal ML worker that subscribes to Redis `locations`, computes windowed features,
scores using an optional IsolationForest model (`/models/if_model.joblib`) and
publishes alerts to Redis `alerts`.

## Quickstart (dev)

1. Create a local models folder if you want to mount a model:
   ```bash
   mkdir -p services/ml-worker/models
   # optionally place a trained model at services/ml-worker/models/if_model.joblib

2. Start Redis (if not already running). Example:

   ```bash
   docker run -d --name sur_redis -p 6379:6379 redis:7
   ```

3. Build & run worker (from `services/ml-worker`):

   ```bash
   docker build -t suraksha-ml-worker .
   docker run --env REDIS_URL=redis://host.docker.internal:6379 -v $(pwd)/models:/models:ro suraksha-ml-worker
   ```

4. Or use compose (from repo root) if you added `docker-compose.override.yml`:

   ```bash
   docker compose up -d redis
   docker compose -f services/ml-worker/docker-compose.override.yml up --build ml-worker
   ```

5. Simulate pings:

   ```bash
   python services/ml-worker/tools/sim_publish.py
   ```

## Integration notes

* Server should publish pings to Redis channel `locations` with payload:

  ```
  { id, touristId, tripId?, deviceId?, lat, lng, speed?, bearing?, accuracy?, status?, ts }
  ```
* Worker publishes alerts to Redis `alerts` channel:

  ```
  { touristId, lat, lng, type, score?, message?, meta?, ts }
  ```
* The `server` (Node/Express) subscribes to `alerts`, persists via Prisma `Alert` model and emits to clients via Socket.io.

## Model training

* The worker expects an sklearn `IsolationForest` saved with `joblib` at `/models/if_model.joblib`.
* Train offline using historical aggregated-window features (same features as `features.py`) and place the artifact in `models/` for dev or upload to S3 for prod.

```

