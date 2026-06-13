# GitHub Push Instructions for Backend

## Problem
The push failed because you're logged in as `mohamdimranin-cloud` but trying to push to `Amruth-Ruchi-Foods/ARF-backend`.

## Solution 1: Use Personal Access Token (Recommended)

### Step 1: Create a Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "ARF Backend Deploy"
4. Select scopes:
   - ✅ repo (all)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)

### Step 2: Push with Token
Run this command (replace YOUR_TOKEN with the actual token):

```bash
cd backend
git remote set-url origin https://YOUR_TOKEN@github.com/Amruth-Ruchi-Foods/ARF-backend.git
git push -u origin main
```

## Solution 2: Add Collaborator Access

1. Go to: https://github.com/Amruth-Ruchi-Foods/ARF-backend
2. Go to Settings → Collaborators
3. Add `mohamdimranin-cloud` as a collaborator
4. Accept the invitation
5. Then retry: `git push -u origin main`

## Solution 3: Use SSH Key (Most Secure)

### Check if you have SSH key:
```bash
ls -la ~/.ssh/id_*.pub
```

### If no key exists, create one:
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### Copy public key:
```bash
cat ~/.ssh/id_ed25519.pub
```

### Add to GitHub:
1. Go to: https://github.com/settings/keys
2. Click "New SSH key"
3. Paste the public key
4. Save

### Update remote URL:
```bash
cd backend
git remote set-url origin git@github.com:Amruth-Ruchi-Foods/ARF-backend.git
git push -u origin main
```

---

## After Successful Push

Once the backend is pushed to GitHub, you can use Hostinger's GitHub deployment feature if you want, but remember:
- It will try to build from source (which failed before)
- The manual upload method we just used is more reliable

**For now, focus on starting the Node.js app in Hostinger's control panel!**
