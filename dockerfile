FROM python:3.9

WORKDIR /app

# Install Node.js and npm
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python requirements first
COPY server/requirements.txt /app/server/
RUN pip install -r server/requirements.txt

# Copy frontend package files and install dependencies
COPY frontend/package*.json /app/frontend/
WORKDIR /app/frontend
RUN npm install

# Copy the rest of the application
WORKDIR /app
COPY . /app/

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# Create static directory and copy frontend build
RUN mkdir -p /app/server/staticfiles/ && \
    cp -r /app/frontend/build/* /app/server/staticfiles/

# Setup backend
WORKDIR /app/server
RUN python manage.py collectstatic --noinput || echo "Collectstatic failed, continuing anyway"

# Set the working directory to the server folder
WORKDIR /app/server

# Expose the port
EXPOSE 8000

# Run migrations and start the application
CMD python manage.py migrate && gunicorn your_project.wsgi:application