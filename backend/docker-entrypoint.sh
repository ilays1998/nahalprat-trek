#!/usr/bin/env bash
set -euo pipefail

echo "Running migrations..."
flask db upgrade || true

echo "Starting gunicorn..."
exec gunicorn wsgi:app --bind 0.0.0.0:${PORT:-8000}


