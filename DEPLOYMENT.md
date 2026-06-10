# 🚀 Deployment Guide - Amruth Ruchi Foods

## Architecture Overview

```
amruthruchi.com
│
├─ Nginx (Reverse Proxy)
│  ├─ https://amruthruchi.com → React Frontend
│  └─ https://amruthruchi.com/api → Express Backend
│
├─ React Frontend (Static Files)
│
├─ Express Backend API (Node.js)
│
├─ MySQL Database
│
└─ Razorpay Payment Gateway
```

## Pre-Deployment Checklist

### 1. Database Migration (Local Setup First)

**Install MySQL locally:**
```bash
# macOS
brew install mysql
brew services start mysql

# Ubuntu/Debian
sudo apt install mysql-server
sudo systemctl start mysql
```

**Create database and user:**
```bash
mysql -u root -p

CREATE DATABASE amruthruchi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'arf_user'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON amruthruchi.* TO 'arf_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Run migrations:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run build
npm run migrate
```

### 2. Environment Variables Setup

**Backend `.env`:**
```env
# Server
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://amruthruchi.com

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=arf_user
DB_PASSWORD=your_strong_password
DB_NAME=amruthruchi

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your_generated_jwt_secret_here

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_SECRET=your_razorpay_secret

# Admin
ADMIN_EMAIL=admin@amruthruchi.com
ADMIN_PASSWORD=your_admin_password
```

**Frontend `.env`:**
```env
VITE_API_URL=https://amruthruchi.com/api
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

### 3. Build Applications

**Build Backend:**
```bash
cd backend
npm install --production
npm run build
```

This creates `dist/` folder with compiled JavaScript.

**Build Frontend:**
```bash
cd ..  # back to root
npm install
npm run build
```

This creates `dist/` folder with production-ready static files.

### 4. Test Locally

**Start backend:**
```bash
cd backend
npm start
```

**Test frontend build:**
```bash
npm run preview
```

---

## VPS Deployment

### Step 1: Buy VPS & Setup Domain

**Recommended VPS Providers:**
- DigitalOcean (Droplet - $6/month)
- Linode ($5/month)
- AWS Lightsail ($3.50/month)
- Vultr ($6/month)

**Specifications:**
- 1 GB RAM minimum
- 25 GB SSD
- Ubuntu 22.04 LTS

**Domain Setup:**
1. Buy domain from Namecheap, GoDaddy, etc.
2. Point A record to your VPS IP:
   ```
   Type: A
   Host: @
   Value: YOUR_VPS_IP
   TTL: Auto
   ```

### Step 2: Initial Server Setup

**Connect to VPS:**
```bash
ssh root@YOUR_VPS_IP
```

**Create non-root user:**
```bash
adduser arf
usermod -aG sudo arf
su - arf
```

**Update system:**
```bash
sudo apt update && sudo apt upgrade -y
```

### Step 3: Install Required Software

**Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should show v20.x
```

**Install MySQL:**
```bash
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

Follow prompts to set root password and secure MySQL.

**Install Nginx:**
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

**Install PM2:**
```bash
sudo npm install -g pm2
```

**Install Git:**
```bash
sudo apt install git -y
```

### Step 4: Setup Application

**Clone repository:**
```bash
cd /home/arf
git clone YOUR_REPO_URL amruthruchi
cd amruthruchi
```

**Setup backend:**
```bash
cd backend
npm install --production
cp .env.example .env
nano .env  # Edit with production values
npm run build
```

**Setup MySQL database:**
```bash
mysql -u root -p

CREATE DATABASE amruthruchi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'arf_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON amruthruchi.* TO 'arf_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Run migrations:**
```bash
npm run migrate
```

**Start backend with PM2:**
```bash
pm2 start dist/server.js --name amruthruchi-api
pm2 save
pm2 startup  # Follow the instructions
```

**Build frontend:**
```bash
cd ..  # back to root
npm install
npm run build
```

### Step 5: Configure Nginx

**Create Nginx config:**
```bash
sudo nano /etc/nginx/sites-available/amruthruchi
```

**Add this configuration:**
```nginx
server {
    listen 80;
    server_name amruthruchi.com www.amruthruchi.com;
    
    # Frontend (React)
    location / {
        root /home/arf/amruthruchi/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/amruthruchi /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### Step 6: Setup SSL (HTTPS)

**Install Certbot:**
```bash
sudo apt install certbot python3-certbot-nginx -y
```

**Get SSL certificate:**
```bash
sudo certbot --nginx -d amruthruchi.com -d www.amruthruchi.com
```

Follow prompts and select redirect HTTP to HTTPS.

**Auto-renewal test:**
```bash
sudo certbot renew --dry-run
```

### Step 7: Setup Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
sudo ufw status
```

### Step 8: Verify Deployment

Visit:
- `https://amruthruchi.com` - Should show frontend
- `https://amruthruchi.com/api/health` - Should show `{"status":"ok"}`

---

## Post-Deployment

### Monitor Application

**View logs:**
```bash
pm2 logs amruthruchi-api
pm2 monit
```

**Nginx logs:**
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Database Backup

**Create backup script:**
```bash
nano ~/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u arf_user -p'your_password' amruthruchi > ~/backups/db_$DATE.sql
# Keep only last 7 days
find ~/backups -type f -mtime +7 -delete
```

**Make executable and schedule:**
```bash
chmod +x ~/backup-db.sh
mkdir ~/backups
crontab -e
# Add: 0 2 * * * /home/arf/backup-db.sh
```

### Update Application

```bash
cd /home/arf/amruthruchi
git pull origin main
npm install
npm run build

cd backend
npm install --production
npm run build
pm2 restart amruthruchi-api
```

---

## Razorpay Integration

### Setup

1. Go to [razorpay.com](https://razorpay.com) and create account
2. Complete KYC verification
3. Get API keys from Dashboard → Settings → API Keys
4. Test with test keys first: `rzp_test_xxxxx`
5. Switch to live keys after testing: `rzp_live_xxxxx`

### Test Payment

```bash
curl -X POST https://amruthruchi.com/api/payment/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount":500,"receipt":"test_order"}'
```

---

## Troubleshooting

**Backend not starting:**
```bash
pm2 logs amruthruchi-api
# Check database connection in logs
mysql -u arf_user -p amruthruchi -e "SELECT 1;"
```

**Nginx errors:**
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

**Database connection issues:**
```bash
# Check MySQL is running
sudo systemctl status mysql
# Check user permissions
mysql -u arf_user -p -e "SHOW GRANTS;"
```

**Permission issues:**
```bash
sudo chown -R arf:arf /home/arf/amruthruchi
chmod -R 755 /home/arf/amruthruchi/dist
```

---

## Maintenance

### Update Node.js
```bash
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
```

### Update PM2
```bash
sudo npm install -g pm2@latest
pm2 update
```

### Monitor Disk Space
```bash
df -h
# Clean old logs if needed
pm2 flush
```

---

## Security Best Practices

1. **Never commit `.env` files**
2. **Use strong passwords** for database and admin accounts
3. **Keep software updated** regularly
4. **Enable fail2ban** to prevent brute force attacks
5. **Backup database** daily
6. **Monitor logs** for suspicious activity
7. **Use HTTPS** everywhere (enforced by Certbot)
8. **Limit database** access to localhost only

---

## Cost Estimate

- VPS: $6/month (DigitalOcean)
- Domain: $12/year (Namecheap)
- SSL: Free (Let's Encrypt)
- Razorpay: 2% + ₹0 per transaction

**Total: ~$84/year**
