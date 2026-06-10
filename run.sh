#!/usr/bin/env bash
# Start Quant Tool Backend API
set -euo pipefail

cd "$(dirname "$0")"
echo "Starting Quant Tool Backend API on http://0.0.0.0:5111 ..."
exec python -m uvicorn app:app --reload --host 0.0.0.0 --port 5111
