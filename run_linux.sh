#!/bin/bash

if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

echo "🚀 Building the Docker image..."
make build-prod .

echo "🔄 Starting the container..."
make run &

echo "⏳ Waiting for the app to start..."
RETRIES=10
while ! curl -s "http://localhost:$VITE_PORT" > /dev/null; do
  ((RETRIES--))
  if [ "$RETRIES" -le 0 ]; then
    echo "❌ App failed to start."
    exit 1
  fi
  sleep 3
done

echo "🌍 Opening UI in browser..."
xdg-open "http://localhost:$VITE_PORT" 2>/dev/null || open "http://localhost:$VITE_PORT" 2>/dev/null || start "http://localhost:$VITE_PORT"

echo "✅ App is running at http://localhost:$VITE_PORT"
