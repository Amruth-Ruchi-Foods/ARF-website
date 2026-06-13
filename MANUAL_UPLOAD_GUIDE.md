# Manual Frontend Upload to Hostinger

## The Issue is FIXED - Just Need to Upload

The frontend has been rebuilt with the correct API URL:
- ✅ Built with `VITE_API_URL=https://api.amruthruchi.com`
- ✅ All files are in the `dist/` folder
- ⏳ Need to upload to Hostinger

---

## Option 1: Using Hostinger File Manager (Easiest)

### Step 1: Access File Manager
1. Go to https://hpanel.hostinger.com/
2. Login to your account
3. Find your website (amruthruchi.com)
4. Click **File Manager**

### Step 2: Navigate to public_html
1. In File Manager, go to: `domains/amruthruchi.com/public_html/`
2. You should see: `index.html`, `assets/`, `vite.svg`, etc.

### Step 3: Delete Old Files
1. Select all files in `public_html/` folder
2. Delete them (or move to a backup folder)

### Step 4: Upload New Files
1. Click **Upload** button in File Manager
2. Navigate to your local `dist/` folder on your Mac
3. Select ALL files from inside `dist/` folder:
   - `index.html`
   - `assets/` folder
   - `vite.svg`
   - `sitemap.xml`
   - Any other files
4. Upload them to `public_html/`

### Step 5: Verify Structure
After upload, `public_html/` should contain:
```
public_html/
├── index.html
├── assets/
│   ├── index-*.css
│   └── index-*.js
├── vite.svg
├── sitemap.xml
└── images/ (if exists)
```

### Step 6: Test
1. Visit https://amruthruchi.com
2. Hard refresh: **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows)
3. Open browser console (F12)
4. Try placing an order
5. Check console - API calls should now go to `https://api.amruthruchi.com`

---

## Option 2: Using FTP Client (FileZilla)

### Step 1: Download FileZilla
- Download from: https://filezilla-project.org/

### Step 2: Get FTP Credentials from Hostinger
1. Go to hPanel → File Manager
2. Look for FTP credentials or create FTP account
3. Note: Host, Username, Password, Port

### Step 3: Connect and Upload
1. Open FileZilla
2. Connect using credentials
3. Navigate to `domains/amruthruchi.com/public_html/`
4. Drag and drop files from local `dist/` folder

---

## Option 3: Zip and Upload

### Step 1: Create Zip
```bash
cd dist
zip -r frontend.zip .
```

### Step 2: Upload via File Manager
1. Go to Hostinger File Manager
2. Navigate to `public_html/`
3. Upload `frontend.zip`
4. Right-click → Extract
5. Delete zip file after extraction

---

## What This Will Fix

After upload, the frontend will:
- ✅ Call `https://api.amruthruchi.com/api/orders` (correct)
- ❌ No longer call `https://amruthruchi.com/api/orders` (wrong)
- ✅ Orders will work (assuming backend is running)

---

## Current Files Ready

All corrected files are in your local `dist/` folder:
- Location: `/Users/mohammadaman/Documents/My Projects/RuchiRich/dist/`
- Files are ready to upload
- No further changes needed

**Use Option 1 (File Manager) - it's the quickest!**
