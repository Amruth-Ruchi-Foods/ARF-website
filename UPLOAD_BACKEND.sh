#!/bin/bash

# Upload Backend to Hostinger
# This script uploads the compiled backend to your server

echo "======================================"
echo "  Uploading Backend to Hostinger"
echo "======================================"
echo ""

# Configuration
SERVER_USER="u574646726"
SERVER_HOST="82.25.106.110"
SERVER_PORT="65002"
SERVER_PATH="~/ARF-website/backend/"

echo "Target: $SERVER_USER@$SERVER_HOST:$SERVER_PORT"
echo "Path: $SERVER_PATH"
echo ""

# Upload dist folder
echo "📦 Uploading compiled backend (dist folder)..."
scp -P $SERVER_PORT -r backend/dist/ $SERVER_USER@$SERVER_HOST:$SERVER_PATH

if [ $? -eq 0 ]; then
    echo "✅ Backend dist folder uploaded successfully!"
    echo ""
    echo "📦 Uploading package.json..."
    scp -P $SERVER_PORT backend/package.json $SERVER_USER@$SERVER_HOST:$SERVER_PATH
    
    if [ $? -eq 0 ]; then
        echo "✅ package.json uploaded successfully!"
        echo ""
        echo "======================================"
        echo "  Upload Complete! ✅"
        echo "======================================"
        echo ""
        echo "Next steps:"
        echo "1. SSH into server:"
        echo "   ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST"
        echo ""
        echo "2. Create .env file:"
        echo "   cd ~/ARF-website/backend"
        echo "   nano .env"
        echo "   (Copy content from backend/.env.production)"
        echo ""
        echo "3. Install production dependencies:"
        echo "   npm install --production"
        echo ""
        echo "4. Start app in hPanel → Node.js → Start"
        echo ""
        echo "5. Test: https://amruthruchi.com/api/health"
        echo ""
    else
        echo "❌ Failed to upload package.json"
        exit 1
    fi
else
    echo "❌ Failed to upload backend dist folder"
    exit 1
fi
