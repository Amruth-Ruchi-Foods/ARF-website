# Fix Frontend API URL on Netlify

## The Issue
Frontend is calling the wrong API URL:
- ❌ Currently: `https://amruthruchi.com/api/orders`
- ✅ Should be: `https://api.amruthruchi.com/api/orders`

## Quick Fix (5 minutes)

### Step 1: Add Environment Variable in Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site (amruthruchi.com)
3. Click **Site Settings** (or Site configuration)
4. In the left sidebar, click **Environment variables**
5. Click **Add a variable** or **Add environment variable**
6. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://api.amruthruchi.com`
7. Click **Save**

### Step 2: Trigger Redeploy

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for deployment to complete (usually 1-2 minutes)

### Step 3: Verify

1. Visit https://amruthruchi.com
2. Try placing an order
3. Check browser console (F12) - API calls should now go to `https://api.amruthruchi.com`

## Why This Works

- Netlify will inject the `VITE_API_URL` environment variable during build
- Vite will replace `import.meta.env.VITE_API_URL` with the actual value
- The frontend will now call the correct API subdomain

## Current Status

- ✅ Backend API is live at: https://api.amruthruchi.com
- ✅ Backend CORS configured to accept requests from amruthruchi.com
- ⏳ Waiting for: Frontend environment variable update and redeploy
