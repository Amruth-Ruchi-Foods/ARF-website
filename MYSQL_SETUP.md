# MySQL Setup Guide for macOS

## Issue: Access Denied for Root User

This happens when MySQL root password is not set or you don't remember it.

## Solution: Reset MySQL Root Password

### Option 1: Fresh MySQL Installation (Recommended)

If you just installed MySQL, try connecting without a password:

```bash
mysql -u root
```

If this works, set a password:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
FLUSH PRIVILEGES;
EXIT;
```

Then test:
```bash
mysql -u root -p
# Enter: your_new_password
```

---

### Option 2: Reset Root Password (If Forgotten)

**Step 1: Stop MySQL**
```bash
brew services stop mysql
```

**Step 2: Start MySQL in safe mode (skip password check)**
```bash
sudo mysqld_safe --skip-grant-tables &
```

**Step 3: Connect without password**
```bash
mysql -u root
```

**Step 4: Reset the password**
```sql
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
FLUSH PRIVILEGES;
EXIT;
```

**Step 5: Kill the safe mode process**
```bash
sudo pkill mysqld
```

**Step 6: Restart MySQL normally**
```bash
brew services start mysql
```

**Step 7: Test the new password**
```bash
mysql -u root -p
# Enter: your_new_password
```

---

### Option 3: Use a Different User

Instead of fixing root, create a new admin user:

**Step 1: Connect without password (if possible)**
```bash
mysql -u root
```

**Step 2: Create new user**
```sql
CREATE USER 'arf_admin'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON *.* TO 'arf_admin'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT;
```

**Step 3: Use the new user**
```bash
mysql -u arf_admin -p
```

---

## Setup Database for ARF Project

Once you can connect to MySQL, run these commands:

```bash
mysql -u root -p
# Or: mysql -u arf_admin -p
```

```sql
-- Create database
CREATE DATABASE amruthruchi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create application user (for security, don't use root in .env)
CREATE USER 'arf_user'@'localhost' IDENTIFIED BY 'arf_secure_password_123';

-- Grant permissions
GRANT ALL PRIVILEGES ON amruthruchi.* TO 'arf_user'@'localhost';
FLUSH PRIVILEGES;

-- Verify
SHOW DATABASES;
SELECT user, host FROM mysql.user WHERE user='arf_user';

EXIT;
```

---

## Update Backend .env File

Edit `backend/.env`:

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=arf_user
DB_PASSWORD=arf_secure_password_123
DB_NAME=amruthruchi

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your_generated_jwt_secret

# Razorpay (use test keys for development)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_SECRET=your_test_secret

# Admin
ADMIN_EMAIL=admin@amruthruchi.com
ADMIN_PASSWORD=admin123
```

---

## Run Database Migration

```bash
cd backend
npm install
npm run build
node dist/db/migrate.js
```

You should see:
```
✅ Database migration completed successfully
```

---

## Verify Database Setup

```bash
mysql -u arf_user -p
# Enter: arf_secure_password_123
```

```sql
USE amruthruchi;
SHOW TABLES;
```

You should see:
```
+------------------------+
| Tables_in_amruthruchi  |
+------------------------+
| carts                  |
| contact_messages       |
| favorites              |
| newsletter_subscribers |
| order_items            |
| orders                 |
| payments               |
| products               |
| users                  |
+------------------------+
```

---

## Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
✅ MySQL connection successful
🚀 Backend server running on http://localhost:3001
📦 Environment: development
🗄️  Database: MySQL
```

---

## Test API

**Health Check:**
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-..."
}
```

**Register a User:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "test123"
  }'
```

---

## Troubleshooting

### "Connection refused" or "Can't connect to MySQL"

**Check if MySQL is running:**
```bash
brew services list | grep mysql
```

If not running:
```bash
brew services start mysql
```

### "Unknown database 'amruthruchi'"

Run the database creation commands again:
```bash
mysql -u root -p -e "CREATE DATABASE amruthruchi;"
```

### "Access denied for user 'arf_user'"

Recreate the user:
```bash
mysql -u root -p
```

```sql
DROP USER IF EXISTS 'arf_user'@'localhost';
CREATE USER 'arf_user'@'localhost' IDENTIFIED BY 'arf_secure_password_123';
GRANT ALL PRIVILEGES ON amruthruchi.* TO 'arf_user'@'localhost';
FLUSH PRIVILEGES;
```

### Port 3306 already in use

Check what's using the port:
```bash
lsof -i :3306
```

Kill the process or change MySQL port.

---

## Quick Commands Reference

```bash
# Start MySQL
brew services start mysql

# Stop MySQL
brew services stop mysql

# Restart MySQL
brew services restart mysql

# Connect as root
mysql -u root -p

# Connect as arf_user
mysql -u arf_user -p

# Show databases
mysql -u root -p -e "SHOW DATABASES;"

# Backup database
mysqldump -u arf_user -p amruthruchi > backup.sql

# Restore database
mysql -u arf_user -p amruthruchi < backup.sql
```
