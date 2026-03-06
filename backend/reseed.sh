#!/usr/bin/env bash
# Sets up venv, installs deps, seeds the database, and starts the server.
# Usage: cd backend && bash reseed.sh

set -e
cd "$(dirname "$0")"

# Activate or create venv
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

echo "Installing requirements..."
venv/Scripts/pip.exe install -q -r requirements.txt

echo "Dropping tables and seeding database..."
venv/Scripts/python.exe seed.py

echo "Starting server..."
venv/Scripts/uvicorn.exe main:app --host 127.0.0.1 --port 8000 --reload
