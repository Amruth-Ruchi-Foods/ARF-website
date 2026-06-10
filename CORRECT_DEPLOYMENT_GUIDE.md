# 🎯 CORRECT HOSTINGER DEPLOYMENT

## The Issue
You uploaded the entire project source code, but Hostinger needs:
- **Frontend**: Pre-built static files only
- **Backend**: Compiled Node.js code only

---

## ✅ CORRECT DEPLOYMENT STRUCTURE

### On Hostinger Server:

```
/home/u574646726/
├── public_html/                    ← FRONTEND (static files)
│   ├── index.html
│   ├── assets/
│   ├── images/
│   └── .htaccess
│
└── ARF-website/                    ← BACKEND (Node.js app)
    └── backend/
        ├── dist/                   ← Compiled JavaScript
        ├── node_modules/
        ├── package.json
        └── .env
```

---

## 🚀 STEP-BY-STEP FIX

### STEP 1: Clean Up Server (2 min)

**SSH into server:**
```bash
ssh -p 65002 u574646726@82.25.106.110
```

**Remove the incorrectly uploaded source code:**
```bash
cd ~/ARF-website
rm -rf backend/src
rm -rf src
rm -rf node_modules
rm package.json
rm package-lock.json
ls
```

You should only see the `backend/` folder remaining.

---

### STEP 2: Upload Backend ONLY (3 min)

**From your Mac terminal, navigate to project:**
```bash
cd ~/Documents/My\ Projects/RuchiRich
```

**Upload only the compiled backend:**
```bash
# Upload compiled code
scp -P 65002 -r backend/dist u574646726@82.25.106.110:~/ARF-website/backend/

# Upload package.json
scp -P 65002 backend/package.json u574646726@82.25.106.110:~/ARF-website/backend/

# Upload package-lock.json
scp -P 65002 backend/package-lock.json u574646726@82.25.106.110:~/ARF-website/backend/
```

**Verify upload:**
```bash
ssh -p 65002 u574646726@82.25.106.110
cd ~/ARF-website/backend
ls
# Should see: dist/, package.json, package-lock.json
ls dist/
# Should see: server.js, db/, routes/, etc.
```

---

### STEP 3: Install Backend Dependencies (2 min)

**In SSH:**
```bash
cd ~/ARF-website/backend
npm install --production
```

This installs only production dependencies (no TypeScript needed).

---

### STEP 4: Create .env File (2 min)

**In SSH:**
```bash
cd ~/ARF-website/backend
nano .env
```

**Paste this:**
```env
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

**Save:** Ctrl+X → Y → Enter

---

### STEP 5: Setup Node.js App in hPanel (3 min)

**Open browser:** https://hpanel.hostinger.com

**Navigate to:** Advanced → Node.js

**Click:** Create Application

**Fill in:**
- **Application Mode:** Production
- **Application Root:** `/home/u574646726/ARF-website/backend`
- **Application Startup File:** `dist/server.js`
- **Node.js Version:** 18.x or 20.x
- **Application URL:** amruthruchi.com
- **Port:** 3001

**Click:** Create

---

### STEP 6: Start Backend (1 min)

**In hPanel → Node.js:**
- Click: **Start** button
- Wait: 10-20 seconds
- Verify: Status shows "Running"

**Test API:**
```
https://amruthruchi.com/api/health
```

Should return JSON with "status": "ok"

✅ **BACKEND IS NOW LIVE!**

---

### STEP 7: Deploy Frontend (5 min)

The frontend is **already built** on your Mac in the `dist/` folder.

**Option A: Upload via File Manager (Easier)**

1. Go to: hPanel → File Manager
2. Navigate to: `public_html`
3. Delete any existing files
4. Upload ALL files from local `dist/` folder
5. Upload the `.htaccess` file from project root

**Option B: Upload via SCP**

```bash
# From your Mac
cd ~/Documents/My\ Projects/RuchiRich

# Upload frontend
scp -P 65002 -r dist/* u574646726@82.25.106.110:~/public_html/

# Upload public folder
scp -P 65002 -r public/* u574646726@82.25.106.110:~/public_html/public/

# Upload .htaccess
scp -P 65002 .htaccess u574646726@82.25.106.110:~/public_html/
```

---

### STEP 8: Test Complete System (3 min)

**Test Frontend:**
```
https://amruthruchi.com
```

**Test Backend:**
```
https://amruthruchi.com/api/health
```

**Test Purchase Flow:**
1. Browse products
2. Add to cart
3. Checkout
4. Pay with test card: 4111 1111 1111 1111

✅ **EVERYTHING IS LIVE!**

---

## 📋 QUICK COMMAND SUMMARY

### Clean server:
```bash
ssh -p 65002 u574646726@82.25.106.110
cd ~/ARF-website && rm -rf backend/src src node_modules package.json package-lock.json
```

### Upload backend:
```bash
cd ~/Documents/My\ Projects/RuchiRich
scp -P 65002 -r backend/dist u574646726@82.25.106.110:~/ARF-website/backend/
scp -P 65002 backend/package.json u574646726@82.25.106.110:~/ARF-website/backend/
scp -P 65002 backend/package-lock.json u574646726@82.25.106.110:~/ARF-website/backend/
```

### Setup backend:
```bash
ssh -p 65002 u574646726@82.25.106.110
cd ~/ARF-website/backend
npm install --production
nano .env  # paste config, save
```

### Upload frontend:
```bash
scp -P 65002 -r dist/* u574646726@82.25.106.110:~/public_html/
scp -P 65002 .htaccess u574646726@82.25.106.110:~/public_html/
```

---

## 🎯 KEY POINTS

1. ❌ **Don't upload source code** (src/, TypeScript files)
2. ✅ **Upload compiled backend** (dist/ folder only)
3. ✅ **Upload built frontend** (dist/ folder to public_html)
4. ✅ **Keep frontend and backend separate**

---

## ⏱️ Total Time: 20 minutes

- Clean up: 2 min
- Upload backend: 3 min
- Install deps: 2 min
- Create .env: 2 min
- Setup Node.js: 3 min
- Start backend: 1 min
- Upload frontend: 5 min
- Test: 3 min

---

**Follow these steps and your website will be live!** 🚀
