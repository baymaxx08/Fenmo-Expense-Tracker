# 🚀 Manual Render Deployment Guide

This guide walks you through manual deployment on Render, which is more reliable than using render.yaml.

## Problem Solved ✅
The error "Cannot find package 'express'" happens when `npm install` doesn't run properly in the monorepo. This manual approach guarantees it works.

---

## 📱 Deploy Backend (Manual - Recommended)

### Step 1: Create Web Service on Render

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New"** → **"Web Service"**
3. Click **"Connect a repository"** (select `Fenmo-Expense-Tracker`)
4. Fill in these fields:

   | Field | Value |
   |-------|-------|
   | **Name** | `expense-tracker-backend` |
   | **Environment** | `Node` |
   | **Region** | `Oregon` (or nearest) |
   | **Branch** | `master` |
   | **Build Command** | `npm --prefix backend install` |
   | **Start Command** | `npm --prefix backend start` |
   | **Plan** | `Free` |

5. Click **"Create Web Service"**
6. Wait for deployment (3-5 minutes)
7. Once deployed, you'll see **green "Live"** status
8. **COPY the URL** from the top (e.g., `https://expense-tracker-backend.onrender.com`)

### Step 2: Add Environment Variables to Backend

1. On the backend service page, scroll down to **"Environment"**
2. Click **"Add Environment Variable"** and add:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `FRONTEND_URL` | (leave empty for now, we'll set it after frontend deployment) |

3. Click **"Save Changes"**
4. Service will automatically redeploy (wait for green "Live" again)

---

## 🎨 Deploy Frontend (Manual - Recommended)

### Step 1: Create Static Site on Render

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New"** → **"Static Site"**
3. Click **"Connect a repository"** (select `Fenmo-Expense-Tracker`)
4. Fill in these fields:

   | Field | Value |
   |-------|-------|
   | **Name** | `expense-tracker-frontend` |
   | **Environment** | `Static Site` |
   | **Region** | `Oregon` (same as backend) |
   | **Branch** | `master` |
   | **Build Command** | `npm --prefix frontend install && npm --prefix frontend run build` |
   | **Publish Directory** | `frontend/dist` |
   | **Plan** | `Free` |

5. Click **"Create Static Site"**
6. Wait for deployment (3-5 minutes)
7. Once deployed, you'll see **green "Live"** status
8. **COPY the URL** from the top (e.g., `https://expense-tracker-frontend.onrender.com`)

### Step 2: Add Environment Variables to Frontend

1. On the frontend service page, scroll down to **"Environment"**
2. Click **"Add Environment Variable"** and add:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | Paste your backend URL from earlier (e.g., `https://expense-tracker-backend.onrender.com`) |

3. Click **"Save Changes"**
4. Service will automatically redeploy (wait for green "Live" again)

### Step 3: Update Backend FRONTEND_URL (Optional)

1. Go back to backend service
2. Click **"Environment"**
3. Edit `FRONTEND_URL` and set it to your frontend URL
4. Click **"Save Changes"**

---

## ✅ Test Your Deployment

1. Open your **Frontend URL** in browser
2. Try adding an expense
3. Verify it shows in the table
4. Test date filtering
5. Check browser console (F12) for errors
6. If all works → **You're Done!** 🎉

---

## 🔍 Troubleshooting

### **Backend deployment failed with "Cannot find package" error**

This means `npm install` didn't run. **Solution:**

1. Go to backend service on Render
2. Click **"Logs"** tab
3. Look for build errors
4. Try these fixes:
   - Rebuild: Click **"Manual Deploy"** → **"Deploy latest commit"**
   - Check that backend/package.json exists
   - Verify better-sqlite3 can install on Linux

### **Frontend shows blank page**

1. Open browser console (F12)
2. Look for red errors
3. If CORS error: Backend URL is wrong in `VITE_API_URL`
4. If "Cannot GET": Frontend build failed

### **Changes not showing after Git push**

1. Click **"Manual Deploy"** on the service
2. Select **"Deploy latest commit"**
3. Wait for redeploy

### **Database errors after deployment**

SQLite uses a file on the server's filesystem. This means:
- ✅ Data persists while service is running
- ❌ Data is lost if service restarts
- ❌ Data is lost if free tier goes to sleep

**Solution for production:**
- Consider upgrading to paid plan ($7/month) for persistent storage
- Or use SQLite Cloud (separate service)

---

## 📊 Your Live URLs

After deployment, you'll have:

- **Backend API**: `https://expense-tracker-backend.onrender.com`
- **Frontend App**: `https://expense-tracker-frontend.onrender.com`

---

## 🎓 How Render Works

- **Free Web Services**: Go to sleep after 15 min inactivity (wake on request)
- **Free Static Sites**: Always active, no sleep
- **Builds**: Happen automatically when you push to GitHub
- **Logs**: Available on service dashboard
- **Redeploy**: Click "Manual Deploy" to force rebuild

---

## Next Steps

1. ✅ Deployment complete
2. Share your frontend URL with others
3. Monitor logs if issues occur
4. Consider upgrading plan if you need persistent data

**Questions?** Check render.com/docs for additional help.
