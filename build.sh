#!/bin/bash
set -e  # Exit immediately if a command exits with non-zero status

echo "Starting build process..."

# Build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build

echo "Creating static directories..."
# Create the static directory if it doesn't exist
mkdir -p ../backend/staticfiles/

echo "Copying frontend build to static directory..."
# Copy the built frontend to the static directory
cp -r build/* ../backend/staticfiles/

# Move to the backend directory
echo "Setting up backend..."
cd ../backend

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Build completed successfully!"