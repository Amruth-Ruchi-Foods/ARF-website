# Create MySQL Database on Hostinger

## Step 1: Create Database

1. Go to **Hostinger hPanel**: https://hpanel.hostinger.com/
2. In the left sidebar, click **Databases** → **MySQL Databases**
3. Click **Create New Database**
4. Fill in:
   - **Database name**: `amruthruchi` (it will become `u574646726_amruthruchi`)
   - **Username**: `arf` (it will become `u574646726_arf`)
   - **Password**: `vKg$8r*8Ry&` (use the same as your hosting password)
5. Click **Create**

## Step 2: Access phpMyAdmin

1. Find the database you just created: `u574646726_amruthruchi`
2. Click **Manage** or **phpMyAdmin**
3. Login with the credentials

## Step 3: Import Database Schema

1. In phpMyAdmin, select the `u574646726_amruthruchi` database
2. Click **SQL** tab at the top
3. Copy and paste the contents from `backend/src/db/schema-hostinger.sql`
4. Click **Go** to execute

This will create all the tables:
- `users`
- `cart_items`
- `favorites`
- `orders`
- `order_items`

## Step 4: Verify Tables

After import, you should see these tables in the left sidebar:
- ✅ users
- ✅ cart_items
- ✅ favorites  
- ✅ orders
- ✅ order_items

## Current Status

**Backend should now start without database** (with the latest code).
Once the database is created, everything will work fully:
- ✅ API will respond
- ✅ Orders will save
- ✅ Cart will persist
- ✅ User accounts will work

## After Database is Created

The backend is already configured with the correct credentials:
- DB_HOST: localhost
- DB_USER: u574646726_arf
- DB_PASSWORD: vKg$8r*8Ry&
- DB_NAME: u574646726_amruthruchi

Just restart the backend deployment after creating the database, and it will connect automatically.
