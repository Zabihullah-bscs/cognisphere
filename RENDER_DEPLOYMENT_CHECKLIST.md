# 🚀 Render Deployment Checklist

## ✅ **Pre-Deployment Checklist**

- [ ] Repository is clean (no Railway files)
- [ ] All changes are committed and pushed to GitHub
- [ ] You have your Zoho Mail App Password ready
- [ ] You know your GitHub Pages URL

## 🔧 **Step 1: Create Render Account**

- [ ] Go to [render.com](https://render.com)
- [ ] Sign up with GitHub account
- [ ] Verify email address

## 🏗️ **Step 2: Create Web Service**

- [ ] Click **"New +"** → **"Web Service"**
- [ ] Connect your GitHub repository
- [ ] Select the `cognisphere` repository

## ⚙️ **Step 3: Configure Settings**

**Basic Settings:**
- [ ] **Name**: `cognisphere-backend`
- [ ] **Environment**: `Node`
- [ ] **Region**: Choose closest to your users
- [ ] **Plan**: `Free`

**Build & Deploy:**
- [ ] **Build Command**: `npm install`
- [ ] **Start Command**: `npm start`

## 🔐 **Step 4: Add Environment Variables**

Click **"Environment"** tab and add:

```
NODE_ENV=production
PORT=10000
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=admin@cogni-sphere.com
SMTP_PASS=6EubGLUDuCZy
ADMIN_EMAIL=admin@cogni-sphere.com
ALLOWED_ORIGINS=https://zabihullah-bscs.github.io
```

**Important:** Replace `zabihullah-bscs.github.io` with your actual GitHub Pages URL.

## 🚀 **Step 5: Deploy**

- [ ] Click **"Create Web Service"**
- [ ] Wait for deployment (2-5 minutes)
- [ ] Check build logs for errors
- [ ] Note your Render URL (e.g., `https://cognisphere-backend.onrender.com`)

## 🧪 **Step 6: Test Backend**

Test your backend endpoints:

```bash
# Health check
curl https://your-app-name.onrender.com/api/health

# Test booking (replace with your URL)
curl -X POST https://your-app-name.onrender.com/api/booking/create \
  -H "Content-Type: application/json" \
  -d '{
    "meetingType": "consultation",
    "date": "2025-08-20",
    "time": "14:00",
    "visitorName": "Test User",
    "visitorEmail": "test@example.com"
  }'
```

## 🔄 **Step 7: Update Frontend**

Once you have your Render URL:

```bash
# Update frontend API URLs
node update-render-url.js https://your-app-name.onrender.com

# Commit and push changes
git add .
git commit -m "Update API URLs to use Render backend"
git push
```

## 🌐 **Step 8: Deploy Frontend**

- [ ] Go to your GitHub repository
- [ ] Click **Settings** → **Pages**
- [ ] Select **Source**: Deploy from a branch
- [ ] Select **Branch**: main
- [ ] Click **Save**
- [ ] Wait for GitHub Pages to deploy

## ✅ **Step 9: Final Testing**

- [ ] Visit your GitHub Pages URL
- [ ] Navigate to Contact page
- [ ] Try scheduling a meeting
- [ ] Verify emails are sent
- [ ] Check admin email for notifications

## 🔧 **Troubleshooting**

### **If deployment fails:**
- [ ] Check Render build logs
- [ ] Verify environment variables are set correctly
- [ ] Ensure all dependencies are in `package.json`

### **If emails don't work:**
- [ ] Verify Zoho Mail credentials
- [ ] Check `SMTP_PASS` is correct
- [ ] Test email configuration

### **If frontend can't connect:**
- [ ] Verify `ALLOWED_ORIGINS` includes your GitHub Pages URL
- [ ] Check that frontend API URLs are updated correctly
- [ ] Test backend health endpoint

## 📞 **Support**

If you encounter issues:
1. Check Render logs in the dashboard
2. Verify all environment variables
3. Test individual components
4. Check CORS configuration

---

**🎉 Your Cognisphere website will be live on Render!** 