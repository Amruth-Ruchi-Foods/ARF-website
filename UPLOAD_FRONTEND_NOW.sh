#!/bin/bash

# Quick Frontend Upload to Hostinger
# Password: vKg$8r*8Ry&

HOST="82.25.106.110"
PORT="65002"
USER="u574646726"
REMOTE_PATH="~/domains/amruthruchi.com/public_html"

echo "=========================================="
echo "UPLOADING FRONTEND TO HOSTINGER"
echo "=========================================="
echo ""
echo "Password when prompted: vKg\$8r*8Ry&"
echo ""

# Upload all files from dist to public_html
echo "Uploading dist/* to public_html..."
scp -P $PORT -r dist/* $USER@$HOST:$REMOTE_PATH/

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Frontend uploaded."
    echo ""
    echo "Next steps:"
    echo "1. Visit: https://amruthruchi.com"
    echo "2. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)"
    echo "3. Try placing an order"
    echo ""
else
    echo ""
    echo "❌ Upload failed. Check your SSH connection."
    echo ""
fi
