# 🔧 Fix Hostinger Backend Deployment

## Current Issue
Your backend deployment to `api.amruthruchi.com` is **building successfully** but **failing to deploy**.

**Status**: ✅ Build passed → ❌ Deployment failed

---

## Root Cause
Hostinger can't find or start your Node.js application because:
1. Root directory might be set incorrectly
2. Missing Procfile or start configuration
3. Missing environment variables

---

## ✅ Quick Fix (3 Steps)

### Step 1: Update Hostinger Deployment Settings

Go to: **Hostinger hPanel → Deployments → api.amruthruchi.com → Settings**

Update these settings:

```
Application Mode: Production
Application Root: /home/u574646726/ARF-website/backend
Application Startup File: dist/server.js
Node.js Version: 22.x
Build Command: npm install && npm run build
Start Command: npm start
Port: 3001
```

**Important**: Make sure **Root directory** is set to `./backend` (not just `.`)

---

### Step 2: Add Environment Variables

In Hostinger deployment settings, add these environment variables:

```env
NODE_ENV=production
PORT=3001
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

---

### Step 3: Redeploy

Click **Redeploy** button in Hostinger.

The deployment should now succeed! ✅

---

## ✅ What I Fixed in the Code

I've already pushed these fixes to your GitHub repository:

1. ✅ **Added Procfile**: Tells Hostinger how to start your app
2. ✅ **Improved package.json**: Added postinstall script and better start command
3. ✅ **Environment handling**: Ensured NODE_ENV is set properly

---

## 🧪 Test After Deployment

Once deployment succeeds, test these endpoints:

### 1. Health Check
```bash
curl https://api.amruthruchi.com/health
```

Should return:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-06-13T..."
}
```

### 2. API Root
```bash
curl https://api.amruthruchi.com/
```

Should return API documentation with all endpoints.

### 3. Test from Frontend
Visit https://amruthruchi.com and try:
- Adding products to cart
- Logging in/signing up
- Making a test purchase

---

## 🚨 Alternative: Manual SSH Deployment

If the automated deployment continues to fail, deploy manually via SSH:

### 1. SSH into server
```bash
ssh -p 65002 u574646726@82.25.106.110
```

### 2. Navigate to backend
```bash
cd ~/ARF-website/backend
```

### 3. Pull latest code
```bash
git pull origin main
```

### 4. Install and build
```bash
npm install
npm run build
```

### 5. Start with PM2
```bash
pm2 restart arf-backend || pm2 start dist/server.js --name arf-backend
pm2 save
```

### 6. Verify
```bash
pm2 status
pm2 logs arf-backend --lines 20
```

---

## 📊 Deployment Checklist

- [ ] Hostinger deployment settings updated
- [ ] Environment variables added
- [ ] Redeployed from Hostinger panel
- [ ] Health endpoint returns 200 OK
- [ ] Database connection working
- [ ] Frontend can communicate with backend
- [ ] Payment flow works end-to-end

---

## 🔍 Troubleshooting

### Build succeeds but deployment fails
- Check if Root Directory is set to `./backend`
- Verify Application Startup File is `dist/server.js`
- Ensure environment variables are added

### "Cannot find module" errors
```bash
# SSH into server and reinstall
cd ~/ARF-website/backend
rm -rf node_modules
npm install
npm run build
```

### Database connection fails
- Verify DB credentials in environment variables
- Check if MySQL database exists
- Test connection: `mysql -u u574646726_arf -p u574646726_amruthruchi`

### Port already in use
```bash
# Find and kill process on port 3001
lsof -ti:3001 | xargs kill -9
# Or use PM2
pm2 delete arf-backend
pm2 start dist/server.js --name arf-backend
```

---

## 📝 Summary

**I've fixed the code** by adding:
- Procfile for Hostinger
- Improved start script
- Better environment handling

**You need to**:
1. Update deployment settings in Hostinger panel
2. Add environment variables
3. Click Redeploy

Your backend should deploy successfully! 🚀
