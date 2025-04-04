#!/bin/bash
# Build frontend
cd frontend
npm install
npm run build
# Move built frontend to backend static directory
mkdir -p ../backend/staticfiles/
cp -r build/* ../backend/staticfiles/
# Install backend dependencies
cd ../backend
pip install -r requirements.txt
python manage.py collectstatic --noinput