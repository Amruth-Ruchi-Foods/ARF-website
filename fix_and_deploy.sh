#!/bin/bash

# Fix Hostinger Deployment - Upload Only Compiled Code
# This script cleans up the server and uploads only what's needed

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║     FIX HOSTINGER DEPLOYMENT - COMPILED CODE ONLY         ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

SERVER_USER="u574646726"
SERVER_HOST="82.25.106.110"
SERVER_PORT="65002"

echo "This script will:"
echo "1. Clean up source code from server"
echo "2. Upload only compiled backend (backend/dist/)"
echo "3. Upload only built frontend (dist/ to public_html)"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  STEP 1: Cleaning up server (removing source code)"
echo "════════════════════════════════════════════════════════════"
echo ""

ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST << 'ENDSSH'
cd ~/ARF-website 2>/dev/null || { echo "ARF-website directory not found"; exit 0; }
echo "Removing source code files..."
rm -rf backend/src
rm -rf src
rm -rf node_modules
rm -f package.json package-lock.json
echo "✅ Cleanup complete"
ls -la
ENDSSH

if [ $? -ne 0 ]; then
    echo "❌ SSH connection failed"
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  STEP 2: Uploading compiled backend"
echo "════════════════════════════════════════════════════════════"
echo ""

echo "📦 Uploading backend/dist/ folder..."
scp -P $SERVER_PORT -r backend/dist $SERVER_USER@$SERVER_HOST:~/ARF-website/backend/

if [ $? -eq 0 ]; then
    echo "✅ Backend dist uploaded"
else
    echo "❌ Failed to upload backend dist"
    exit 1
fi

echo "📦 Uploading backend package files..."
scp -P $SERVER_PORT backend/package.json $SERVER_USER@$SERVER_HOST:~/ARF-website/backend/
scp -P $SERVER_PORT backend/package-lock.json $SERVER_USER@$SERVER_HOST:~/ARF-website/backend/

if [ $? -eq 0 ]; then
    echo "✅ Backend package files uploaded"
else
    echo "❌ Failed to upload package files"
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  STEP 3: Uploading built frontend to public_html"
echo "════════════════════════════════════════════════════════════"
echo ""

echo "📦 Uploading dist/ contents to public_html..."
scp -P $SERVER_PORT -r dist/* $SERVER_USER@$SERVER_HOST:~/public_html/

if [ $? -eq 0 ]; then
    echo "✅ Frontend uploaded"
else
    echo "❌ Failed to upload frontend"
    exit 1
fi

echo "📦 Uploading .htaccess..."
scp -P $SERVER_PORT .htaccess $SERVER_USER@$SERVER_HOST:~/public_html/

if [ $? -eq 0 ]; then
    echo "✅ .htaccess uploaded"
else
    echo "⚠️  .htaccess upload failed (you can upload manually)"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  UPLOAD COMPLETE! ✅"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo ""
echo "1. Install backend dependencies:"
echo "   ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST"
echo "   cd ~/ARF-website/backend"
echo "   npm install --production"
echo ""
echo "2. Create .env file:"
echo "   nano .env"
echo "   (Copy from backend/.env.production)"
echo ""
echo "3. Setup Node.js app in hPanel:"
echo "   - Go to: https://hpanel.hostinger.com"
echo "   - Advanced → Node.js → Create Application"
echo "   - Application Root: /home/u574646726/ARF-website/backend"
echo "   - Startup File: dist/server.js"
echo "   - Click Start"
echo ""
echo "4. Test:"
echo "   Frontend: https://amruthruchi.com"
echo "   Backend: https://amruthruchi.com/api/health"
echo ""
echo "See CORRECT_DEPLOYMENT_GUIDE.md for detailed instructions."
echo ""
