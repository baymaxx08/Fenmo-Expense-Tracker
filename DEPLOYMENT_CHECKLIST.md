# 🚀 Deployment Checklist - Render

## Before You Deploy ✅

### Local Testing
- [ ] `npm start` in backend folder works (http://localhost:3001)
- [ ] `npm run dev` in frontend folder works (http://localhost:5173)
- [ ] Can add expenses and see them display
- [ ] Date filter works correctly
- [ ] Category filter works correctly

### Repository
- [ ] All changes committed: `git status` shows clean
- [ ] Pushed to GitHub: `git push origin main`
- [ ] DEPLOYMENT.md file created
- [ ] render.yaml file created
- [ ] .env.example files created (DO NOT commit .env)

---

## Render Deployment (5 minutes) 🌐

### 1️⃣ Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub
- Skip if already have account

### 2️⃣ Deploy Backend
1. Dashboard → "New" → "Web Service"
2. Connect your GitHub repository
3. Fill in:
   - **Name**: `expense-tracker-backend`
   - **Environment**: `Node`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: `Free`
4. Click "Create Web Service"
5. ⏳ Wait 3-5 minutes for deployment
6. 📋 **Copy the Backend URL** (e.g., `https://expense-tracker-backend.onrender.com`)

### 3️⃣ Deploy Frontend
1. Dashboard → "New" → "Static Site"
2. Connect your GitHub repository
3. Fill in:
   - **Name**: `expense-tracker-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Plan**: `Free`
4. Add Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Paste the Backend URL from step 2
5. Click "Create Static Site"
6. ⏳ Wait 3-5 minutes for deployment
7. 🎉 Frontend URL shown (e.g., `https://expense-tracker-frontend.onrender.com`)

---

## Testing the Live App ✅

- [ ] Visit frontend URL in browser
- [ ] Can add a new expense
- [ ] Expense appears in the table
- [ ] Can filter by category
- [ ] Can filter by date
- [ ] Total and breakdown show correctly
- [ ] No errors in browser console (F12)

---

## Production URLs

**Backend API**: `https://expense-tracker-backend.onrender.com`  
**Frontend**: `https://expense-tracker-frontend.onrender.com`

---

## Important Notes ⚠️

- **Free tier sleeps**: Backend goes to sleep after 15 min of inactivity (wakes on request)
- **Data persistence**: SQLite data persists while service runs but is lost on restart
- **First request slow**: First request after sleep takes 10-30 seconds (cold start)
- **No credit card needed** for free tier

---

## Troubleshooting 🔧

**Issue**: "Expense could not be added"
- Check browser console (F12)
- Check backend logs on Render dashboard
- Verify VITE_API_URL environment variable is set correctly

**Issue**: Frontend shows blank page
- Check browser console for errors
- Verify CORS headers (should see no CORS errors)
- Try refreshing browser

**Issue**: Backend deployment failed
- Check "Logs" tab on backend service
- Verify all dependencies in package.json
- Try redeploying manually

---

## Next Steps

1. ✅ Deployment complete - app is LIVE!
2. Share your frontend URL with others
3. Optional: Upgrade to paid plan for persistent data
4. Optional: Add more features based on usage

---

**Questions?** Check DEPLOYMENT.md for detailed instructions.
