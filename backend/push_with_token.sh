#!/bin/bash

# GitHub Push Script with Token
# Usage: ./push_with_token.sh YOUR_GITHUB_TOKEN

if [ -z "$1" ]; then
    echo "Usage: ./push_with_token.sh YOUR_GITHUB_TOKEN"
    echo ""
    echo "Get your token from: https://github.com/settings/tokens"
    echo "Create a new token with 'repo' scope"
    exit 1
fi

TOKEN=$1

# Update remote URL with token
git remote set-url origin https://${TOKEN}@github.com/Amruth-Ruchi-Foods/ARF-backend.git

# Push
git push -u origin main

echo ""
echo "Push complete!"
