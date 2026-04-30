# 🚀 Deployment Guide - Render

This guide walks you through deploying the Expense Tracker on **Render**.

## Why Render?
- ✅ Best for full-stack Node.js apps with SQLite
- ✅ Persistent storage for database
- ✅ Easy GitHub integration
- ✅ Free tier available (frontend has no sleep, backend sleeps after 15 min)

---

## 📋 Prerequisites

1. **GitHub account** with your repository (you already have this ✓)
2. **Render account** - Sign up at [render.com](https://render.com) (free)
3. **Prepare environment files** (see below)

---

## 🔧 Part 1: Prepare Your Project

### Backend Configuration

**File: `backend/.env`** (Create this - DO NOT commit sensitive data)
```
NODE_ENV=production
PORT=3001
```

**File: `backend/.env.example`** (Commit this for reference)
```
NODE_ENV=production
PORT=3001
```

**File: `backend/.gitignore`** (Ensure this exists)
```
node_modules/
.env
.env.local
*.log
dist/
```

### Frontend Configuration

**File: `frontend/.env.production`** (Create this - DO NOT commit)
```
VITE_API_URL=https://your-backend-service-name.onrender.com
```

**File: `frontend/.env.example`** (Commit this for reference)
```
VITE_API_URL=https://your-backend-service-name.onrender.com
```

**File: `frontend/.gitignore`** (Ensure this exists)
```
node_modules/
.env
.env.local
dist/
*.log
```

### Root Configuration

**File: `render.yaml`** (in root folder)
```yaml
services:
  - type: web
    name: expense-tracker-backend
    env: node
    plan: free
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
  - type: web
    name: expense-tracker-frontend
    env: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: frontend/dist
```

---

## 📱 Part 2: Push to GitHub

```bash
git add .
git commit -m "Deployment: Add Render configuration and env files"
git push origin main
```

---

## 🌐 Part 3: Deploy on Render

### **Step 1: Create Backend Service**

1. Go to [render.com/dashboard](https://render.com/dashboard)
2. Click **"New +"** → **"Web Service"**
3. Select **"Connect a repository"** (select your GitHub repo)
4. Fill in details:
   - **Name**: `expense-tracker-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install && npm run build` (if you have build script)
   - **Start Command**: `cd backend && npm start`
   - **Plan**: `Free`

5. Click **"Create Web Service"**
6. Wait for deployment (3-5 minutes)
7. **Copy the URL** (e.g., `https://expense-tracker-backend.onrender.com`)

### **Step 2: Update Frontend with Backend URL**

1. Go back to VS Code
2. Create `frontend/.env.production`:
```
VITE_API_URL=https://expense-tracker-backend.onrender.com
```

3. Update `frontend/src/api/expenses.js` (if using env variable):
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://expense-tracker-backend.onrender.com';
```

4. Commit and push:
```bash
git add frontend/.env.production frontend/src/api/expenses.js
git commit -m "Deployment: Configure frontend API URL for production"
git push origin main
```

### **Step 3: Create Frontend Service**

1. Back on [render.com/dashboard](https://render.com/dashboard)
2. Click **"New +"** → **"Static Site"** (NOT Web Service)
3. Select your repository
4. Fill in details:
   - **Name**: `expense-tracker-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Plan**: `Free`

5. Click **"Create Static Site"**
6. Wait for deployment (3-5 minutes)
7. **Your app is live!** 🎉

---

## ✅ Post-Deployment Checklist

- [ ] Backend URL copied (`https://expense-tracker-backend.onrender.com`)
- [ ] Frontend `.env.production` updated with backend URL
- [ ] Both services deployed successfully on Render
- [ ] Frontend service shows green "Live" status
- [ ] Backend service shows green "Live" status
- [ ] Test adding an expense on the live site
- [ ] Test filtering by date
- [ ] Check browser console for CORS errors

---

## 🔗 Database Persistence

SQLite database will be stored in the backend service's ephemeral storage. **This means data will be lost if the service restarts.**

### Option A: Use SQLite Cloud (Recommended for production)
1. Sign up at [sqlitecloud.io](https://sqlitecloud.io)
2. Update backend to use SQLite Cloud connection
3. Data persists across restarts

### Option B: Accept ephemeral storage (Free option)
- Database lives as long as service runs
- Data persists between requests
- Lost if service restarts (rare on production plan)

---

## 🔧 Environment Variables on Render

To add secret variables:
1. Service dashboard → **Environment**
2. Click **"Add Environment Variable"**
3. Key: `NODE_ENV`, Value: `production`
4. Save and redeploy

---

## 🛠️ Troubleshooting

### **Frontend shows blank page**
- Check browser console (F12)
- Verify CORS is enabled in backend
- Check that `VITE_API_URL` points to correct backend URL

### **Backend service keeps restarting**
- Check build logs for errors
- Verify Node version compatibility
- Check that `npm start` works locally

### **CORS errors in console**
- Add frontend URL to CORS in `backend/src/app.js`:
```javascript
cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://your-frontend-url.onrender.com'
  ]
})
```

### **Database errors**
- Check that better-sqlite3 is in `package.json` dependencies
- Verify database path is writable

---

## 📊 Monitoring

On Render dashboard:
- **Logs**: View real-time application logs
- **Metrics**: CPU, RAM, requests/min
- **Events**: Deployment history
- **Health**: Service status and uptime

---

## 💡 Next Steps

After successful deployment:
1. Share the live URL with others: `https://expense-tracker-frontend.onrender.com`
2. Add features based on usage
3. Consider upgrading to paid plan if you need persistent data
4. Set up monitoring alerts

---

**Happy Tracking! 🎯**
