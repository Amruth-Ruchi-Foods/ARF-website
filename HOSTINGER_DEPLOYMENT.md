# Deploying ARF Website to Hostinger Business Plan

## Overview
This guide covers deploying your React frontend and Node.js backend to Hostinger Business hosting.

## Prerequisites
- ✅ Hostinger Business Plan (supports Node.js apps)
- ✅ Domain configured in Hostinger
- ✅ SSH access enabled
- ✅ Node.js version 18+ available on server

---

## Part 1: Frontend Deployment

### Step 1: Build the Frontend

On your local machine:
```bash
npm run build
```

This creates a `dist` folder with your production-ready website.

### Step 2: Upload to Hostinger

**Option A: Using File Manager (Easier)**
1. Log in to Hostinger hPanel
2. Go to **File Manager**
3. Navigate to `public_html` (or your domain folder)
4. Delete default files (index.html, etc.)
5. Upload all files from `dist` folder
6. Upload `public` folder contents as well

**Option B: Using FTP (Recommended)**
1. Get FTP credentials from hPanel → Files → FTP Accounts
2. Use FileZilla or any FTP client
3. Connect to your server
4. Upload `dist` folder contents to `public_html`
5. Upload `public` folder to `public_html/public`

**File Structure on Server:**
```
public_html/
├── index.html
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
└── public/
    ├── images/
    ├── sitemap.xml
    └── verified/
```

### Step 3: Configure .htaccess for React Router

Create `.htaccess` in `public_html`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Enable GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## Part 2: Backend Deployment (Node.js App)

### Step 1: Access SSH

1. Enable SSH in Hostinger hPanel → Advanced → SSH Access
2. Get SSH credentials
3. Connect via terminal:
```bash
ssh u123456789@your-server-ip
```

### Step 2: Set Up Node.js Application

```bash
# Navigate to home directory
cd ~

# Create backend directory
mkdir backend
cd backend

# Clone or upload your backend files
# Option A: Using Git
git clone https://github.com/Amruth-Ruchi-Foods/ARF-website.git temp
mv temp/backend/* .
rm -rf temp

# Option B: Upload via FTP to ~/backend/
```

### Step 3: Install Dependencies

```bash
# Install Node.js modules
npm install

# Build TypeScript
npm run build
```

### Step 4: Configure Environment Variables

Create `.env` file in `~/backend/`:
```bash
nano .env
```

Add your production config:
```env
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# Database (Hostinger MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USER=u123456789_arf
DB_PASSWORD=your_db_password
DB_NAME=u123456789_amruthruchi

# JWT
JWT_SECRET=your_production_jwt_secret_here

# Razorpay (use live credentials in production)
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXX
RAZORPAY_KEY_SECRET=live_secret_XXXXXXXXX

# Admin
ADMIN_EMAIL=admin@amruthruchi.com
ADMIN_PASSWORD=your_secure_admin_password
```

Save: `Ctrl+X`, then `Y`, then `Enter`

### Step 5: Set Up MySQL Database

1. **Create Database in hPanel:**
   - Go to **Databases** → **MySQL Databases**
   - Create database: `u123456789_amruthruchi`
   - Create user: `u123456789_arf`
   - Assign user to database with all privileges

2. **Import Schema:**
```bash
# Upload schema.sql via phpMyAdmin or command line
mysql -u u123456789_arf -p u123456789_amruthruchi < ~/backend/src/db/schema.sql
```

Or use **phpMyAdmin** in hPanel:
- Select your database
- Click Import
- Upload `backend/src/db/schema.sql`

### Step 6: Install PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start your backend
cd ~/backend
pm2 start dist/server.js --name arf-backend

# Save PM2 process list
pm2 save

# Set PM2 to start on system reboot
pm2 startup
```

### Step 7: Configure PM2 Ecosystem (Optional but Recommended)

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'arf-backend',
    script: './dist/server.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
```

Start with ecosystem:
```bash
pm2 start ecosystem.config.js
```

### Step 8: Configure Reverse Proxy

Create or edit `.htaccess` in your domain root to proxy API requests:

```apache
# In public_html/.htaccess

# API requests → Node.js backend
RewriteEngine On
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]

# Remaining rules for React Router (from Part 1)
```

**Alternative: Use Subdomain for API**

Create subdomain `api.yourdomain.com`:
1. In hPanel → Domains → Subdomains
2. Create `api` subdomain
3. Point to Node.js app (Hostinger should detect it)

---

## Part 3: Frontend Environment Configuration

Update your frontend to use production API URL.

### Option A: Rebuild with Production URL

On your local machine:

**Update `.env`:**
```env
VITE_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXX
VITE_API_URL=https://yourdomain.com/api
# OR if using subdomain:
# VITE_API_URL=https://api.yourdomain.com
```

**Rebuild and reupload:**
```bash
npm run build
# Upload dist folder contents to public_html again
```

### Option B: Use Environment Detection

The app can auto-detect production:
```typescript
// Already implemented in src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

---

## Part 4: Testing & Verification

### Test Frontend
1. Visit `https://yourdomain.com`
2. Check all pages load correctly
3. Test navigation and routing

### Test Backend API
```bash
# From SSH or browser
curl https://yourdomain.com/api/health
# Should return: {"status":"ok","database":"connected"}
```

### Test Payment Flow
1. Add products to cart
2. Go to checkout
3. Use Razorpay test card: `4111 1111 1111 1111`
4. Verify payment completes successfully

### Check PM2 Status
```bash
pm2 status
pm2 logs arf-backend
```

---

## Part 5: Domain & SSL Configuration

### Enable SSL (Free)
1. In hPanel → SSL → Manage
2. Install free SSL certificate (Let's Encrypt)
3. Force HTTPS redirect

Add to `.htaccess`:
```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Configure Custom Domain
1. Point domain to Hostinger nameservers
2. Add domain in hPanel
3. Upload files to domain's folder

---

## Part 6: Maintenance Commands

### Update Backend Code
```bash
cd ~/backend
git pull origin main  # If using Git
npm install
npm run build
pm2 restart arf-backend
```

### Update Frontend
```bash
# On local machine
npm run build

# Upload dist folder to public_html via FTP
```

### View Logs
```bash
pm2 logs arf-backend
pm2 logs arf-backend --lines 100
```

### Monitor Backend
```bash
pm2 status
pm2 monit
```

### Restart Backend
```bash
pm2 restart arf-backend
```

### Stop Backend
```bash
pm2 stop arf-backend
```

---

## Troubleshooting

### Backend Not Starting
```bash
# Check logs
pm2 logs arf-backend

# Check if port is in use
netstat -tuln | grep 3001

# Restart
pm2 restart arf-backend
```

### Database Connection Failed
- Verify MySQL credentials in `.env`
- Check if database exists
- Ensure user has privileges

### Frontend Shows 404 on Refresh
- Check `.htaccess` exists and is correct
- Ensure mod_rewrite is enabled (usually is on Hostinger)

### API Requests Failing
- Check if backend is running: `pm2 status`
- Verify CORS settings in `backend/src/server.ts`
- Check proxy configuration in `.htaccess`

### SSL Certificate Issues
- Wait 24-48 hours after domain setup
- Force reinstall SSL in hPanel
- Clear browser cache

---

## Performance Optimization

### Enable Caching
Already in `.htaccess` above - browser caching for static assets

### Enable GZIP
Already in `.htaccess` above - compresses text files

### Use CDN (Optional)
- Cloudflare (free plan)
- Point domain to Cloudflare nameservers
- Cloudflare → Speed → Auto Minify

### Optimize Images
- Already using lazy loading
- Consider WebP format (already implemented)
- Use Hostinger's Image Optimizer if available

---

## Security Checklist

- ✅ SSL certificate installed and forced
- ✅ Environment variables secured (.env not in public_html)
- ✅ Database user has limited privileges
- ✅ JWT secret is strong and unique
- ✅ Razorpay webhook signature verification enabled
- ✅ CORS configured for your domain only
- ✅ Admin password is strong
- ✅ Regular backups enabled in Hostinger

---

## Backup Strategy

### Automatic Backups (Hostinger)
- Enable in hPanel → Backups
- Daily backups included with Business plan

### Manual Database Backup
```bash
# Via SSH
mysqldump -u u123456789_arf -p u123456789_amruthruchi > backup.sql

# Or use phpMyAdmin → Export
```

### Code Backup
- Already on GitHub ✅
- Keep `.env` backed up securely (NOT in Git)

---

## Support Resources

- **Hostinger Support**: https://www.hostinger.com/help
- **PM2 Documentation**: https://pm2.keymetrics.io/docs
- **Node.js on Hostinger**: Hostinger Knowledge Base
- **Project Issues**: GitHub repository

---

## Quick Reference Commands

```bash
# SSH into server
ssh u123456789@your-server-ip

# Navigate to backend
cd ~/backend

# Check backend status
pm2 status

# View logs
pm2 logs arf-backend

# Restart backend
pm2 restart arf-backend

# Update code (if using Git)
git pull && npm install && npm run build && pm2 restart arf-backend

# Database access
mysql -u u123456789_arf -p u123456789_amruthruchi
```

---

**Your ARF website is now live on Hostinger!** 🎉

For any issues, check the Troubleshooting section or contact Hostinger support.
