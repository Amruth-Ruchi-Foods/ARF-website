# 🚀 DEPLOY NOW - Step-by-Step Checklist

**Time Required**: 15-20 minutes

---

## ✅ COMPLETED ALREADY
- [x] Database created: `u574646726_amruthruchi`
- [x] Database schema imported (8 tables)
- [x] Code pushed to GitHub
- [x] SSH connected successfully
- [x] Repository cloned to server at `~/ARF-website/`

---

## 📋 BACKEND DEPLOYMENT (5-10 minutes)

### Step 1: Create .env File on Server (2 min)

**In your SSH terminal** (you're already connected):

```bash
cd ~/ARF-website/backend
nano .env
```

**Copy-paste this EXACT content**:

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

**Save**: Press `Ctrl+X`, then `Y`, then `Enter`

---

### Step 2: Setup Node.js App in hPanel (3 min)

1. Open browser → https://hpanel.hostinger.com/
2. Login with your credentials
3. Find **Advanced** section or search for "Node.js"
4. Click **Setup Node.js Application** or **Create Application**

**Fill in these details**:
- **Application Mode**: `Production`
- **Application Root**: `/home/u574646726/ARF-website/backend`
- **Application Startup File**: `dist/server.js`
- **Node.js Version**: `18.x` or `20.x` (choose latest available)
- **Application URL**: Choose your domain (amruthruchi.com)
- **Port**: `3001` (or leave default if auto-assigned)

5. Click **Create** or **Setup**

---

### Step 3: Install Dependencies (3 min)

**Option A - Via hPanel Terminal (Recommended)**:
1. In the Node.js app interface, find **Terminal** or **Console** button
2. Click to open terminal
3. Run these commands:
```bash
cd /home/u574646726/ARF-website/backend
npm install
npm run build
```

**Option B - If no terminal button**:
1. Click **Restart** on the Node.js app
2. Hostinger may auto-run `npm install` 
3. Check logs to verify

---

### Step 4: Start Backend (1 min)

1. In hPanel → Node.js → Your Application
2. Click **Start** button
3. Wait 10-20 seconds
4. Status should show **Running** ✅

---

### Step 5: Verify Backend (1 min)

**Test the API**:

Open browser or use curl:
```
https://amruthruchi.com/api/health
```

**Expected Response**:
```json
{
  "message": "ARF Backend API",
  "version": "1.0.0",
  "database": "MySQL",
  "endpoints": {
    "health": "/health",
    "auth": "/api/auth",
    "cart": "/api/cart/:userId",
    "favorites": "/api/favorites/:userId",
    "orders": "/api/orders",
    "payment": "/api/payment"
  }
}
```

If you see this, **BACKEND IS LIVE!** 🎉

---

## 📋 FRONTEND DEPLOYMENT (5-10 minutes)

### Step 1: Build Frontend Locally (2 min)

**On your Mac**:

```bash
cd ~/path/to/ARF-website
npm run build
```

This creates a `dist` folder.

---

### Step 2: Upload to Hostinger (3 min)

**Option A - File Manager (Easier)**:
1. Go to hPanel → **File Manager**
2. Navigate to `public_html` folder
3. Delete any default files (index.html, etc.)
4. Click **Upload**
5. Upload ALL files from `dist` folder
6. Also upload the entire `public` folder

**Option B - FTP (Faster for large files)**:
1. hPanel → **FTP Accounts** → Get credentials
2. Use FileZilla or Cyberduck
3. Connect to FTP
4. Upload `dist` contents to `public_html`
5. Upload `public` folder to `public_html/public`

**Final structure**:
```
public_html/
├── index.html
├── assets/
│   └── (all JS/CSS files)
└── public/
    └── images/
```

---

### Step 3: Configure .htaccess (2 min)

**In File Manager**, navigate to `public_html` and create `.htaccess`:

1. Click **New File** → Name it `.htaccess`
2. Right-click → **Edit**
3. Paste this content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Force HTTPS
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  
  # API Proxy to Backend
  RewriteCond %{REQUEST_URI} ^/api/
  RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
  
  # React Router - must be last
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# GZIP Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

4. Save the file

---

### Step 4: Enable SSL Certificate (2 min)

1. hPanel → **SSL** section
2. Find your domain
3. Click **Install SSL** (free Let's Encrypt)
4. Wait 2-5 minutes for activation

---

### Step 5: Test Frontend (1 min)

Open browser:
```
https://amruthruchi.com
```

**Check**:
- ✅ Homepage loads
- ✅ Navigation works
- ✅ Product pages load
- ✅ Images display
- ✅ No console errors

---

## 🧪 FULL SYSTEM TEST (3 min)

### Test Complete Flow:

1. **Browse Products**: Click products, view details
2. **Add to Cart**: Add 2-3 items
3. **Checkout**: Go to cart → Checkout
4. **Payment**: Use Razorpay test card:
   - Card: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date
   - OTP: `123456` (in test mode)
5. **Verify**: Order should complete successfully

---

## 📊 MONITORING

### Check Backend Status:
```bash
# In hPanel Node.js interface
- View "Status" → Should be "Running"
- Click "Logs" → Check for errors
```

### Check Frontend:
```
https://amruthruchi.com
```

### Check API Health:
```
https://amruthruchi.com/api/health
```

---

## ❌ TROUBLESHOOTING

### Backend Not Starting:
1. Check logs in hPanel → Node.js → Logs
2. Verify `.env` file exists and has correct format
3. Try "Restart" button
4. Check port isn't blocked

### API Returns 404:
1. Verify `.htaccess` has proxy rules
2. Check backend is running (hPanel status)
3. Test: `http://localhost:3001/api/health` from SSH

### Frontend Shows Blank Page:
1. Check browser console for errors
2. Verify all files uploaded correctly
3. Check `.htaccess` exists in `public_html`
4. Clear browser cache

### Payment Fails:
1. Check backend logs
2. Verify Razorpay keys in backend `.env`
3. Test API: `POST https://amruthruchi.com/api/payment/create-order`

### Database Connection Error:
1. Verify DB credentials in `.env`
2. Check database exists in hPanel → MySQL
3. Ensure user `u574646726_arf` has privileges

---

## 🎉 SUCCESS CHECKLIST

- [ ] Backend Status: Running in hPanel
- [ ] API Health: Returns 200 OK
- [ ] Frontend: Loads at https://amruthruchi.com
- [ ] SSL: Shows padlock icon in browser
- [ ] Products: Display correctly with images
- [ ] Cart: Can add/remove items
- [ ] Checkout: Payment modal opens
- [ ] Payment: Test transaction completes
- [ ] Order: Stored in database

---

## 📞 NEED HELP?

**If stuck on any step**:
1. Check the specific troubleshooting section above
2. Review logs in hPanel
3. Check HOSTINGER_DEPLOYMENT.md for detailed explanations
4. Contact Hostinger support if server-related issue

---

## 🔄 FUTURE UPDATES

**To update backend**:
```bash
# SSH into server
cd ~/ARF-website
git pull origin main
cd backend
npm install
npm run build
# Restart in hPanel → Node.js → Restart
```

**To update frontend**:
```bash
# On your Mac
npm run build
# Upload dist folder to public_html via File Manager/FTP
```

---

**ESTIMATED TOTAL TIME: 15-20 minutes**

Follow each step in order. Don't skip steps!

Good luck! 🚀
