#!/bin/sh
set -e

echo "Starting deployment process..."

# Build the portfolio
echo "Building portfolio..."
npm run build:export

# Check if build was successful
if [ ! -d "out" ]; then
  echo "Error: Build failed - out directory not found"
  exit 1
fi

# Deploy to FTP server
echo "Deploying to FTP server..."
node scripts/ftp-deploy.js

echo "Deployment complete!"

