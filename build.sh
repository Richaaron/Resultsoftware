#!/bin/bash
set -e

echo "Installing backend dependencies..."
cd backend && npm ci && cd ..

echo "Installing frontend dependencies..."
cd frontend-react && npm ci && cd ..

echo "Building frontend..."
cd frontend-react && npm run build && cd ..

echo "Build complete!"
