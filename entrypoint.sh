#!/usr/bin/env bash
set -e

# Сборка фронтенда (с ретраями на сетевые сбои)
if [ -d "frontend" ]; then
  echo "Building frontend..."
  cd frontend

  # Устойчивость npm
  npm set fund=false audit=false progress=false \
    fetch-retries=5 fetch-retry-mintimeout=10000 fetch-retry-maxtimeout=60000

  retry() {
    local n=0
    local max=3
    local delay=5
    until "$@"; do
      exit_code=$?
      n=$((n+1))
      if [ $n -ge $max ]; then
        return $exit_code
      fi
      echo "Command failed with code $exit_code. Retrying in ${delay}s... ($n/$max)"
      sleep $delay
    done
    return 0
  }

  if [ -f package-lock.json ]; then
    retry npm ci --no-audit --no-fund
  else
    retry npm install --no-audit --no-fund
  fi
  npm run build
  cd -
else
  echo "No frontend directory found, skipping frontend build."
fi

# Django миграции и collectstatic
echo "Applying migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Django on 0.0.0.0:8000"
python manage.py runserver 0.0.0.0:8000
