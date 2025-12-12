#!/usr/bin/env bash
set -euo pipefail

# Optional: download model from MODEL_S3_URI if set (CI/prod pattern)
if [ -n "${MODEL_S3_URI:-}" ]; then
  echo "[entrypoint] Downloading model from $MODEL_S3_URI to $MODEL_DIR"
  # NOTE: in production prefer IAM role / secure method. Here we assume signed URL or awscli available.
  if command -v aws >/dev/null 2>&1; then
    aws s3 cp "$MODEL_S3_URI" "$MODEL_DIR/if_model.joblib"
  else
    # try curl (signed URL)
    curl -sSfL "$MODEL_S3_URI" -o "$MODEL_DIR/if_model.joblib" || echo "[entrypoint] failed to download model with curl"
  fi
fi

exec "$@"
