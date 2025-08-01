# 🚀 Deployment Guide for Cognisphere Website

This guide will help you deploy your Cognisphere website with both frontend (GitHub Pages) and backend (Node.js hosting).

## 📋 Prerequisites

- GitHub account
- Node.js hosting account (Railway, Render, or Heroku)
- Zoho Mail account configured
- Domain name (optional but recommended)

## 🌐 Step 1: Deploy Frontend to GitHub Pages

### 1.1 Push Code to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

### 1.2 Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Choose **main** branch
6. Click **Save**

Your frontend will be available at: `https://yourusername.github.io/your-repo-name`

## 🔧 Step 2: Deploy Backend to Railway (Recommended)

### 2.1 Sign Up for Railway

1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Click **New Project**

### 2.2 Deploy from GitHub

1. Select **Deploy from GitHub repo**
2. Choose your Cognisphere repository
3. Railway will automatically detect it's a Node.js project

### 2.3 Configure Environment Variables

In Railway dashboard, go to **Variables** tab and add:

```env
NODE_ENV=production
PORT=3000
ADMIN_EMAIL=admin@cogni-sphere.com
ADMIN_TOKEN=your-secure-admin-token-here
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=admin@cogni-sphere.com
SMTP_PASS=6EubGLUDuCZy
MEETING_BASE_URL=https://meet.google.com
DB_PATH=./data/cognisphere.db
JWT_SECRET=your-secure-jwt-secret-key
SESSION_SECRET=your-secure-session-secret-key
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ALLOWED_ORIGINS=https://yourusername.github.io,https://cogni-sphere.com
```

### 2.4 Deploy

1. Railway will automatically deploy your app
2. Get your backend URL (e.g., `https://cognisphere-backend.railway.app`)

## 🔗 Step 3: Connect Frontend to Backend

### 3.1 Update API URLs

You need to update the API URLs in your frontend files to point to your backend:

**In `about-us/contact-us.html`:**
```javascript
// Find this line (around line 580):
const response = await fetch('/api/booking/create', {

// Change it to:
const response = await fetch('https://your-backend-url.railway.app/api/booking/create', {
```

**In `app.js` (if you have contact forms):**
```javascript
// Find any fetch calls to /api/contact/submit and update them
const response = await fetch('https://your-backend-url.railway.app/api/contact/submit', {
```

### 3.2 Push Updated Frontend

```bash
git add .
git commit -m "Update API URLs for production"
git push
```

GitHub Pages will automatically redeploy with the updated URLs.

## 🌍 Step 4: Custom Domain (Optional)

### 4.1 Configure Custom Domain

1. In GitHub repository Settings → Pages
2. Add your custom domain (e.g., `cogni-sphere.com`)
3. Update DNS records at your domain provider

### 4.2 Update CORS Settings

In Railway environment variables, update:
```env
ALLOWED_ORIGINS=https://cogni-sphere.com,https://www.cogni-sphere.com
```

## 🔧 Alternative Backend Hosting Options

### Option A: Render

1. Sign up at [render.com](https://render.com)
2. Create **Web Service**
3. Connect GitHub repository
4. Set environment variables
5. Deploy

### Option B: Heroku

1. Sign up at [heroku.com](https://heroku.com)
2. Install Heroku CLI
3. Create new app: `heroku create cognisphere-backend`
4. Set environment variables: `heroku config:set VARIABLE_NAME=value`
5. Deploy: `git push heroku main`

## 🧪 Step 5: Testing

### 5.1 Test Frontend
- Visit your GitHub Pages URL
- Test navigation and static pages

### 5.2 Test Backend
- Test health endpoint: `https://your-backend-url.railway.app/api/health`
- Test booking functionality
- Test contact form

### 5.3 Test Email
- Schedule a test meeting
- Verify emails are received

## 📊 Step 6: Monitoring

### 6.1 Railway Monitoring
- Check Railway dashboard for logs
- Monitor resource usage
- Set up alerts if needed

### 6.2 GitHub Pages Monitoring
- Check repository for deployment status
- Monitor for any build errors

## 🔒 Security Checklist

- [ ] Environment variables are set securely
- [ ] CORS origins are properly configured
- [ ] Rate limiting is enabled
- [ ] Input validation is working
- [ ] Email authentication is working
- [ ] Database is properly secured

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `ALLOWED_ORIGINS` in environment variables
   - Ensure frontend URL is included

2. **Email Not Sending**
   - Verify Zoho Mail credentials
   - Check Railway logs for email errors

3. **Database Issues**
   - Railway provides persistent storage
   - Check if database file is being created

4. **Frontend Not Loading**
   - Check GitHub Pages deployment status
   - Verify file paths are correct

### Getting Help

- Check Railway logs for backend issues
- Check GitHub Pages deployment logs
- Test API endpoints directly with tools like Postman

## 📈 Next Steps

1. **Analytics**: Add Google Analytics to track visitors
2. **SSL**: Ensure HTTPS is enabled (Railway provides this)
3. **Backup**: Set up database backups
4. **Monitoring**: Add uptime monitoring
5. **CDN**: Consider adding a CDN for better performance

## 🎉 Success!

Your Cognisphere website is now live with:
- ✅ Frontend: GitHub Pages
- ✅ Backend: Railway (or your chosen platform)
- ✅ Email: Zoho Mail
- ✅ Database: SQLite on Railway
- ✅ Booking System: Fully functional
- ✅ Contact Forms: Working

**Frontend URL**: `https://yourusername.github.io/your-repo-name`
**Backend URL**: `https://your-backend-url.railway.app`

Both systems are now connected and fully functional! 