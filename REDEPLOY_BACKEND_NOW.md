# 🔄 Redeploy Backend - Debug Startup Changes

**Changes Made**: Added console.log debug statements to track server startup
**Time Required**: 3-5 minutes

---

## ✅ What Was Changed

Added debug logging to `backend/src/server.ts`:
1. `console.log("SERVER FILE LOADED")` - at the very top
2. `console.log("ABOUT TO START EXPRESS")` - before app.listen

These logs will help diagnose startup issues on Hostinger.

---

## 🚀 Quick Redeploy Steps

### Option 1: Via Hostinger hPanel (Recommended - 3 min)

1. **Login to hPanel**
   - Go to: https://hpanel.hostinger.com/
   - Login with your credentials

2. **Pull Latest Code**
   - Find **Advanced** → **Node.js** section
   - Open your application
   - Click **Terminal** or **Console** button
   - Run these commands:
   ```bash
   cd /home/u574646726/ARF-website
   git pull origin main
   cd backend
   npm run build
   ```

3. **Restart Backend**
   - In hPanel → Node.js Application interface
   - Click **Restart** button
   - Wait 10-20 seconds
   - Status should show **Running** ✅

4. **Check Logs**
   - Click **Logs** button in Node.js interface
   - Look for these lines:
   ```
   SERVER FILE LOADED
   📦 MySQL pool created
   ABOUT TO START EXPRESS
   🚀 Backend server running on http://0.0.0.0:3001
   ```

---

### Option 2: Via SSH Terminal (Alternative - 5 min)

If you already have SSH access:

```bash
# Connect via SSH
ssh u574646726@104.21.76.120 -p 65002

# Navigate to project
cd ~/ARF-website

# Pull latest code
git pull origin main

# Rebuild backend
cd backend
npm install
npm run build

# Exit SSH
exit
```

Then go to hPanel and restart the Node.js application.

---

## 🔍 What to Look For in Logs

### Successful Startup:
```
SERVER FILE LOADED
📦 MySQL pool created
✅ MySQL connection successful
ABOUT TO START EXPRESS
🚀 Backend server running on http://0.0.0.0:3001
📦 Environment: production
🗄️  Database: MySQL
```

### If "SERVER FILE LOADED" is missing:
- Server file didn't load at all
- Check Node.js application startup file path
- Should be: `dist/server.js`

### If "ABOUT TO START EXPRESS" is missing:
- Server loaded but crashed before starting
- Check for errors between these two log lines
- Likely database connection or import issue

### If both logs appear but server doesn't start:
- Express failed to bind to port
- Check if port 3001 is available
- Check for errors after "ABOUT TO START EXPRESS"

---

## 🧪 Test After Redeployment

1. **Check API Health**:
   ```
   https://amruthruchi.com/api/health
   ```
   Should return JSON with backend info

2. **Check Root Endpoint**:
   ```
   https://amruthruchi.com/
   ```
   Should return backend API info (if backend is at root)

3. **Test from Frontend**:
   - Open https://amruthruchi.com
   - Try adding a product to cart
   - Check browser console for API errors

---

## 📊 Quick Status Check

Run this command in hPanel Terminal to see if backend process is running:

```bash
pm2 list
# or
ps aux | grep node
```

---

## ❌ Common Issues After Redeploy

### Issue 1: Logs still don't show
**Solution**: 
- Verify build completed: `ls -la ~/ARF-website/backend/dist/`
- Check `server.js` exists in dist folder
- Restart again

### Issue 2: Build fails
**Solution**:
```bash
cd ~/ARF-website/backend
rm -rf node_modules
npm install
npm run build
```

### Issue 3: Still no logs after restart
**Solution**:
- Check Application Startup File in hPanel Node.js settings
- Should be: `dist/server.js` (not `src/server.ts`)
- Update if needed and restart

---

## 🎯 Expected Timeline

- Pull code: 30 seconds
- Build: 1-2 minutes
- Restart: 10-20 seconds
- Verify logs: 30 seconds

**Total: 3-5 minutes**

---

## 📞 Next Steps

After redeployment:
1. Check logs for both debug statements
2. Report what you see in the logs
3. Based on logs, we can diagnose the exact issue
4. If backend starts successfully, test API endpoints

---

**Git Status**: 
- ✅ Changes committed
- ✅ Pushed to GitHub (main branch)
- ⏳ Ready to pull on server

Now follow Option 1 above to redeploy! 🚀
