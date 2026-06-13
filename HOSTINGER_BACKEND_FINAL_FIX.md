# Hostinger Backend - Final Fix

## The Problem
The backend keeps showing 503/403 errors and the app never starts. This means Hostinger's deployment platform isn't correctly starting the Node.js application.

## Root Cause
Hostinger's "GitHub deployments" feature for Node.js might not be properly configured or might have limitations.

## Solution: Use Hostinger's Node.js App Feature Instead

### Step 1: Stop Using GitHub Auto-Deploy

1. In Hostinger, go to the `api.amruthruchi.com` deployment
2. **Disconnect** or **Delete** the GitHub deployment
3. We'll manually set up Node.js instead

### Step 2: Set Up Node.js Application Manually

1. Go to **Hostinger hPanel**
2. Find **Advanced** → **Node.js** (or **Setup Node.js App**)
3. Click **Create Application**
4. Configure:
   - **Application mode**: Production
   - **Application root**: Create a folder `/home/u574646726/api-backend`
   - **Application URL**: `api.amruthruchi.com`
   - **Node.js version**: 20.x
   - **Package manager**: npm
   - **Entry point**: `dist/server.js`

### Step 3: Upload Backend Files via FTP/File Manager

1. Build locally:
   ```bash
   cd backend
   npm run build
   ```

2. Upload these to `/home/u574646726/api-backend`:
   ```
   /dist/                 (entire folder)
   /node_modules/         (or run npm install on server)
   package.json
   package-lock.json
   .env                   (copy from .env.production)
   ```

3. Or zip and upload:
   ```bash
   cd backend
   zip -r backend-deploy.zip dist/ package.json package-lock.json
   ```
   Then upload via File Manager and extract

### Step 4: Set Environment Variables in Node.js App Panel

In the Node.js app settings, add these environment variables:
```
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://amruthruchi.com

DB_HOST=localhost
DB_PORT=3306
DB_USER=u574646726_arf
DB_PASSWORD=vKg$8r*8Ry&
DB_NAME=u574646726_amruthruchi

JWT_SECRET=A7fOzIH08XAM+niBLT1WfDMjzB0NpIC9lqrMrr7iAbJlhhuxjx5wDkriKoqfS6uoFL+wUg13bio70ErW41Tbaw==

RAZORPAY_KEY_ID=rzp_test_SwkfwVgUJdcGr6
RAZORPAY_KEY_SECRET=iGd0WMKuR0R0v4hRiIB3Fx4U

ADMIN_EMAIL=admin@amruthruchi.com
ADMIN_PASSWORD=vKg$8r*8Ry&
```

### Step 5: Install Dependencies and Start

1. In the Node.js app panel, click **Run npm install**
2. After installation completes, click **Start Application**
3. The app should now be running

### Step 6: Verify

1. Visit: https://api.amruthruchi.com/
2. Should see: `{"message": "ARF Backend API", ...}`
3. Visit: https://api.amruthruchi.com/health
4. Should see: `{"status": "degraded", ...}` (degraded because no database yet)

### Step 7: Create Database

Follow `CREATE_DATABASE_NOW.md` to create the MySQL database.

## Why This Works

- Hostinger's GitHub deployment feature for Node.js is unstable/misconfigured
- Using the direct Node.js App setup gives you more control
- You can see actual runtime logs
- You can restart the app manually
- Environment variables are properly injected

## Alternative: Try Changing Entry Point in Current Setup

Before switching, try one more thing in the current GitHub deployment:

**In Settings → Build and output settings:**
- Entry file: Leave BLANK (empty)
- Let npm start handle it

Then redeploy and see if it works.

## Current Files Ready

All files are ready in your local `backend/` directory:
- ✅ Built correctly
- ✅ Dependencies resolved
- ✅ Code tested locally
- ✅ Environment variables documented

The issue is purely with Hostinger's deployment configuration, not your code.
