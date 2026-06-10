# Hostinger MySQL Database Setup Guide

## Problem
The original `schema.sql` tries to create a database, but Hostinger users don't have permission to create databases directly.

## Solution
Use `schema-hostinger.sql` which only creates tables in an existing database.

---

## Step-by-Step Setup

### Step 1: Create Database in Hostinger hPanel

1. **Log in to Hostinger hPanel**
2. **Navigate to**: Databases → MySQL Databases
3. **Click**: "Create New Database"
4. **Database Name**: Enter `amruthruchi` 
   - Hostinger will prefix it: `u574646726_amruthruchi`
5. **Click**: "Create"

### Step 2: Create Database User

1. **In the same page**, scroll to "MySQL Users"
2. **Click**: "Create New User"
3. **Username**: Enter `arf`
   - Hostinger will prefix it: `u574646726_arf`
4. **Password**: Generate a strong password (save it!)
5. **Click**: "Create"

### Step 3: Assign User to Database

1. **Scroll to**: "Add User To Database"
2. **Select User**: `u574646726_arf`
3. **Select Database**: `u574646726_amruthruchi`
4. **Click**: "Add"
5. **Privileges**: Check **ALL PRIVILEGES**
6. **Click**: "Make Changes"

### Step 4: Import Schema using phpMyAdmin

1. **In hPanel**, go to: Databases → phpMyAdmin
2. **Click on your database**: `u574646726_amruthruchi` (left sidebar)
3. **Click**: "Import" tab at the top
4. **Choose File**: Select `backend/src/db/schema-hostinger.sql`
5. **Scroll down**, click: "Go" or "Import"
6. **Wait** for success message ✅

### Step 5: Verify Tables Created

In phpMyAdmin, you should see these tables:
- ✅ users
- ✅ carts
- ✅ favorites
- ✅ orders
- ✅ subscribers
- ✅ contacts
- ✅ product_feedback
- ✅ instagram_posts

### Step 6: Update Backend Environment Variables

Edit `backend/.env`:

```env
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# Database - Use Hostinger credentials
DB_HOST=localhost
DB_PORT=3306
DB_USER=u574646726_arf
DB_PASSWORD=your_generated_password_here
DB_NAME=u574646726_amruthruchi

# JWT
JWT_SECRET=your_production_jwt_secret_here

# Razorpay (use live credentials in production)
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXX
RAZORPAY_KEY_SECRET=live_secret_XXXXXXXXX

# Admin
ADMIN_EMAIL=admin@amruthruchi.com
ADMIN_PASSWORD=change_this_password
```

---

## Alternative: Import via SQL Query

If you prefer to paste SQL directly:

1. **Open phpMyAdmin**
2. **Select your database**: `u574646726_amruthruchi`
3. **Click**: "SQL" tab
4. **Copy the contents** of `schema-hostinger.sql`
5. **Paste into the SQL editor**
6. **Remove the first line**: `USE \`u574646726_amruthruchi\`;`
   - Or change it to your actual database name
7. **Click**: "Go"

---

## Testing Database Connection

### Method 1: Via SSH (if available)

```bash
# SSH into Hostinger
ssh u574646726@your-server-ip

# Test MySQL connection
mysql -u u574646726_arf -p u574646726_amruthruchi

# You'll be prompted for password
# If successful, you'll see: mysql>

# List tables
SHOW TABLES;

# Exit
exit;
```

### Method 2: Via Backend Health Check

After starting your backend:
```bash
# Visit this URL in browser
https://yourdomain.com/api/health

# Should return:
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-..."
}
```

---

## Common Issues & Solutions

### Issue 1: "Access Denied for user"
**Cause**: User doesn't have privileges on the database

**Solution**:
1. Go to hPanel → MySQL Databases
2. Find "Add User To Database" section
3. Select your user and database
4. Grant ALL PRIVILEGES

### Issue 2: "Database doesn't exist"
**Cause**: Database name mismatch

**Solution**:
- Check exact database name in hPanel (includes prefix)
- Update `DB_NAME` in `.env` to match exactly

### Issue 3: "Too many connections"
**Cause**: Connection pool not properly configured

**Solution**:
```typescript
// In backend/src/db/connection.ts
const pool = mysql.createPool({
  // ... other config
  connectionLimit: 5,  // Lower limit for shared hosting
  queueLimit: 0
});
```

### Issue 4: "Can't connect to MySQL server"
**Cause**: Wrong host or port

**Solution**:
- Hostinger MySQL host is usually: `localhost`
- Port: `3306`
- Double-check in hPanel → Database details

---

## Database Maintenance

### Backup Database

**Method 1: Via phpMyAdmin**
1. Select database
2. Click "Export"
3. Choose "Quick" export method
4. Click "Go"
5. Save the `.sql` file

**Method 2: Via SSH** (if available)
```bash
mysqldump -u u574646726_arf -p u574646726_amruthruchi > backup.sql
```

### Restore Database

**Via phpMyAdmin**
1. Select database
2. Click "Import"
3. Choose your backup `.sql` file
4. Click "Go"

### Clear All Data (Keep Structure)

```sql
-- In phpMyAdmin SQL tab
TRUNCATE TABLE carts;
TRUNCATE TABLE favorites;
TRUNCATE TABLE orders;
TRUNCATE TABLE subscribers;
TRUNCATE TABLE contacts;
TRUNCATE TABLE product_feedback;
TRUNCATE TABLE instagram_posts;
-- Keep users table to preserve admin account
```

---

## Security Best Practices

1. ✅ **Strong Database Password**
   - Use Hostinger's password generator
   - Minimum 16 characters
   - Mix of letters, numbers, symbols

2. ✅ **Change Default Admin Password**
   ```sql
   -- In phpMyAdmin SQL tab
   UPDATE users 
   SET password_hash = 'new_bcrypt_hash_here' 
   WHERE email = 'admin@amruthruchi.com';
   ```

3. ✅ **Limit Database User Privileges**
   - Only grant necessary privileges
   - Avoid GRANT ALL in production (if possible)

4. ✅ **Regular Backups**
   - Enable automatic backups in hPanel
   - Manual backup before major changes

5. ✅ **Monitor Database Size**
   - Hostinger plans have storage limits
   - Check usage in hPanel regularly

---

## Database Schema Updates

If you need to modify tables later:

```sql
-- Add a column
ALTER TABLE orders 
ADD COLUMN tracking_number VARCHAR(100);

-- Modify a column
ALTER TABLE users 
MODIFY COLUMN phone VARCHAR(15);

-- Add an index
CREATE INDEX idx_tracking ON orders(tracking_number);
```

---

## Quick Reference

| Item | Value |
|------|-------|
| Database Name | `u574646726_amruthruchi` |
| Database User | `u574646726_arf` |
| Host | `localhost` |
| Port | `3306` |
| Schema File | `backend/src/db/schema-hostinger.sql` |
| phpMyAdmin | Access via hPanel → Databases |

---

## Need Help?

1. **Hostinger Support**: 24/7 live chat in hPanel
2. **phpMyAdmin Docs**: https://www.phpmyadmin.net/docs/
3. **MySQL Docs**: https://dev.mysql.com/doc/

---

**Your database is now ready!** 🎉

Next step: Start your backend server and test the connection.
