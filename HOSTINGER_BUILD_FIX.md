# 🔧 Hostinger Build Error Fix

## Problem
The build failed with: `tsc: command not found`

This happens because TypeScript wasn't installed as a dependency in the backend.

---

## ✅ QUICK FIX

### Option 1: Install TypeScript Globally (Recommended)

In the hPanel Terminal (for your Node.js app):

```bash
cd /home/u574646726/ARF-website/backend
npm install -g typescript
npm run build
```

---

### Option 2: Use Local TypeScript

The backend already has TypeScript in devDependencies. Use npx:

```bash
cd /home/u574646726/ARF-website/backend
npx tsc && cp -r src/db/*.sql dist/db/
```

---

### Option 3: Build Locally and Upload

**On your Mac** (easiest solution):

```bash
cd ~/path/to/ARF-website/backend
npm install
npm run build
```

Then upload the `backend/dist/` folder to server via:
- FTP/SFTP to `/home/u574646726/ARF-website/backend/dist/`
- Or File Manager in hPanel

---

## 🎯 RECOMMENDED APPROACH (Easiest)

**Build backend locally and upload the compiled files:**

### Step 1: Build on Your Mac (2 min)

```bash
cd backend
npm install
npm run build
```

This creates `backend/dist/` folder with:
- `server.js` (compiled)
- `db/*.sql` files

### Step 2: Upload to Server (3 min)

**Via SSH:**
```bash
# From your Mac terminal
cd backend
scp -P 65002 -r dist/ u574646726@82.25.106.110:~/ARF-website/backend/
```

**Or via hPanel File Manager:**
1. Go to File Manager
2. Navigate to `/home/u574646726/ARF-website/backend/`
3. Upload the entire `dist` folder

### Step 3: Verify Upload (1 min)

**In SSH:**
```bash
cd ~/ARF-website/backend
ls -la dist/
# Should see: server.js and db/ folder
```

### Step 4: Install Production Dependencies Only (2 min)

**In hPanel Terminal:**
```bash
cd /home/u574646726/ARF-website/backend
npm install --production
```

This installs only runtime dependencies (no TypeScript, tsx, etc.)

### Step 5: Start the App (1 min)

In hPanel → Node.js App → Click **Start**

---

## 📋 Complete Steps Summary

### On Your Mac:
```bash
cd ~/Documents/My\ Projects/RuchiRich/backend
npm install
npm run build
```

### Upload dist folder to server (choose one method):

**Method A - SCP:**
```bash
scp -P 65002 -r dist/ u574646726@82.25.106.110:~/ARF-website/backend/
```

**Method B - File Manager:**
- hPanel → File Manager
- Navigate to: `/home/u574646726/ARF-website/backend/`
- Upload `dist` folder

### On Hostinger (in hPanel Terminal):
```bash
cd /home/u574646726/ARF-website/backend
npm install --production
```

### Start App:
- hPanel → Node.js → Your App → Start

---

## 🧪 Verify It Works

Test the API:
```bash
curl https://amruthruchi.com/api/health
```

Should return:
```json
{
  "message": "ARF Backend API",
  "version": "1.0.0",
  "database": "MySQL"
}
```

---

## 💡 Why This Approach?

**Pros:**
- ✅ No need to install TypeScript on server
- ✅ Faster deployment
- ✅ Smaller server footprint (production deps only)
- ✅ No build errors on shared hosting

**This is the standard production deployment pattern!**

---

## 🔄 Alternative: Fix Build on Server

If you prefer building on the server:

### 1. Install TypeScript in Backend

```bash
cd /home/u574646726/ARF-website/backend
npm install typescript --save-dev
npm run build
```

### 2. Or Install Globally

```bash
npm install -g typescript
cd /home/u574646726/ARF-website/backend
npm run build
```

---

## ⚠️ IMPORTANT NOTE

The error you saw was from Hostinger trying to auto-build the **root project** (frontend), but you should be building the **backend** separately.

**Correct paths:**
- Frontend build: Already done locally → `dist/` folder → Upload to `public_html`
- Backend build: Build locally → `backend/dist/` → Upload to server → Start Node.js app

---

## 🎯 NEXT STEPS

1. **Build backend locally** (on your Mac)
2. **Upload `backend/dist/` folder** to server
3. **Install production deps** on server: `npm install --production`
4. **Create `.env` file** on server (from `backend/.env.production`)
5. **Start Node.js app** in hPanel
6. **Test**: `https://amruthruchi.com/api/health`

---

## 📞 Quick Command Reference

### Build locally:
```bash
cd backend
npm install
npm run build
```

### Upload via SCP:
```bash
scp -P 65002 -r dist/ u574646726@82.25.106.110:~/ARF-website/backend/
```

### On server:
```bash
cd ~/ARF-website/backend
npm install --production
```

### Create .env:
```bash
cd ~/ARF-website/backend
nano .env
# Paste content from backend/.env.production
# Save: Ctrl+X, Y, Enter
```

---

**Use the "Build Locally and Upload" approach - it's the easiest and most reliable!** 🚀
