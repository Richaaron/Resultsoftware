#!/bin/bash
set -e

echo "Installing backend dependencies..."
cd backend && npm ci && cd ..

echo "Installing frontend dependencies..."
cd frontend-react && npm ci && cd ..

echo "Building frontend..."
cd frontend-react && npm run build 2>&1 || (echo "Build failed!" && exit 1) && cd ..

if [ ! -d "frontend-react/dist" ]; then
  echo "Error: frontend-react/dist directory does not exist after build!"
  exit 1
fi

echo "Build complete! dist directory created successfully."
