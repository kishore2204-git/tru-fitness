#!/usr/bin/env bash
set -o errexit

echo "==> Installing dependencies..."
pip install -r requirements.txt

echo "==> Collecting static files..."
python manage.py collectstatic --no-input

echo "==> Running migrations..."
python manage.py migrate

echo "==> Seeding demo data (skips if already exists)..."
python manage.py seed_demo_data

echo "==> Build complete!"
