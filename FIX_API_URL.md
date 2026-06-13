# Fix API URL - Quick Steps

## Problem
The frontend is calling `https://amruthruchi.com/api/orders` instead of `https://api.amruthruchi.com/api/orders`

## Solution
The `.env` file has been updated locally with the correct API URL. Now you need to rebuild and redeploy.

## Steps to Fix:

### Option 1: Using Netlify/Hostinger Environment Variables (Recommended)

1. **Go to your Hostinger deployment settings** for the frontend (amruthruchi.com)
2. **Find Environment Variables section**
3. **Add/Update this variable:**
   - Key: `VITE_API_URL`
   - Value: `https://api.amruthruchi.com`
4. **Redeploy the frontend**

### Option 2: Rebuild and Upload Manually

The `dist` folder has already been rebuilt with the correct API URL:

```bash
# The build is already complete in ./dist folder
# Upload the contents of dist/ to your Hostinger public_html folder
```

### Option 3: Using Netlify

If you're using Netlify for the frontend:

1. Go to Netlify dashboard
2. Select your site (amruthruchi.com)
3. Go to Site Settings → Environment Variables
4. Add: `VITE_API_URL` = `https://api.amruthruchi.com`
5. Trigger a redeploy

## Verify the Fix

After redeploying, check the browser console. The API calls should now go to:
- ✅ `https://api.amruthruchi.com/api/orders`
- ❌ NOT `https://amruthruchi.com/api/orders`

## Current Status

- ✅ Backend deployed at: `https://api.amruthruchi.com`
- ✅ Backend CORS updated to allow amruthruchi.com
- ✅ Local .env updated with correct API URL
- ✅ Frontend rebuilt with correct API URL
- ⏳ Waiting for frontend redeploy

## Test After Deploy

Try placing an order. The API call should succeed.
