#!/bin/bash

# Navigate to the backend directory
cd backend

# Install TypeScript globally
sudo npm install -g typescript

# Install required peer dependencies for backend
sudo npm install --save-dev typescript@latest

# Fix high-severity vulnerabilities
sudo npm audit fix

# Navigate to the frontend directory
cd ../frontend

# Install required peer dependencies for frontend
sudo npm install --save-dev typescript@latest

# Add missing Babel plugin
sudo npm install --save-dev @babel/plugin-proposal-private-property-in-object

# Fix high-severity vulnerabilities
sudo npm audit fix

# Navigate back to the root directory
cd ..

# Rebuild the Docker containers
docker-compose down
docker-compose up --build
