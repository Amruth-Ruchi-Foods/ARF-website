#!/bin/bash

# Hostinger Upload Script
# Run this from your Mac terminal

HOST="82.25.106.110"
PORT="65002"
USER="u574646726"
REMOTE_HOME="/home/u574646726"

echo "==========================================="
echo "HOSTINGER DEPLOYMENT UPLOAD SCRIPT"
echo "==========================================="
echo ""
echo "You'll be prompted for password multiple times"
echo "Password: vKg\$8r*8Ry&"
echo ""

# Step 1: Upload Frontend to public_html
echo "Step 1: Uploading Frontend to public_html..."
echo "-------------------------------------------"
scp -P $PORT -r dist/* $USER@$HOST:~/domains/amruthruchi.com/public_html/
if [ $? -eq 0 ]; then
    echo "✓ Frontend uploaded successfully"
else
    echo "✗ Frontend upload failed"
    exit 1
fi

echo ""

# Step 2: Upload .htaccess
echo "Step 2: Uploading .htaccess..."
echo "-------------------------------------------"
scp -P $PORT .htaccess $USER@$HOST:~/domains/amruthruchi.com/public_html/
if [ $? -eq 0 ]; then
    echo "✓ .htaccess uploaded successfully"
else
    echo "✗ .htaccess upload failed"
fi

echo ""

# Step 3: Create backend directory structure
echo "Step 3: Creating backend directory..."
echo "-------------------------------------------"
ssh -p $PORT $USER@$HOST "mkdir -p $REMOTE_HOME/ARF-website/backend"
if [ $? -eq 0 ]; then
    echo "✓ Backend directory created"
else
    echo "✗ Backend directory creation failed"
fi

echo ""

# Step 4: Upload backend dist folder
echo "Step 4: Uploading backend dist folder..."
echo "-------------------------------------------"
scp -P $PORT -r backend/dist $USER@$HOST:$REMOTE_HOME/ARF-website/backend/
if [ $? -eq 0 ]; then
    echo "✓ Backend dist uploaded successfully"
else
    echo "✗ Backend dist upload failed"
    exit 1
fi

echo ""

# Step 5: Upload backend package files
echo "Step 5: Uploading package.json and package-lock.json..."
echo "-------------------------------------------"
scp -P $PORT backend/package.json backend/package-lock.json $USER@$HOST:$REMOTE_HOME/ARF-website/backend/
if [ $? -eq 0 ]; then
    echo "✓ Package files uploaded successfully"
else
    echo "✗ Package files upload failed"
    exit 1
fi

echo ""

# Step 6: Create .env file
echo "Step 6: Creating .env file on server..."
echo "-------------------------------------------"
ssh -p $PORT $USER@$HOST "cat > $REMOTE_HOME/ARF-website/backend/.env << 'EOF'
NODE_ENV=production
PORT=3001
DATABASE_HOST=localhost
DATABASE_USER=u574646726_arf
DATABASE_PASSWORD=vKg\$8r*8Ry&
DATABASE_NAME=u574646726_amruthruchi
JWT_SECRET=A7fOzIH08XAM+niBLT1WfDMjzB0NpIC9lqrMrr7iAbJlhhuxjx5wDkriKoqfS6uoFL+wUg13bio70ErW41Tbaw==
RAZORPAY_KEY_ID=rzp_test_SwkfwVgUJdcGr6
RAZORPAY_KEY_SECRET=iGd0WMKuR0R0v4hRiIB3Fx4U
FRONTEND_URL=https://amruthruchi.com
EOF"

if [ $? -eq 0 ]; then
    echo "✓ .env file created successfully"
else
    echo "✗ .env file creation failed"
fi

echo ""
echo "==========================================="
echo "UPLOAD COMPLETE!"
echo "==========================================="
echo ""
echo "Next Steps:"
echo "1. Go to hPanel: https://hpanel.hostinger.com/"
echo "2. Find 'Setup Node.js App' in Advanced section"
echo "3. Configure:"
echo "   - Application root: /home/u574646726/ARF-website/backend"
echo "   - Startup file: dist/server.js"
echo "   - Node version: 18.x or 20.x"
echo "4. Start the application"
echo "5. Test: https://amruthruchi.com/api/health"
echo ""
