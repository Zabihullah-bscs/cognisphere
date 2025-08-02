# 🚀 Deployment Guide

This guide will help you deploy the Cognisphere website and backend.

## 📋 **Project Structure**

```
cognisphere/
├── server.js              # Main backend server
├── package.json           # Dependencies and scripts
├── index.html             # Main website page
├── about-us/              # Frontend pages
├── services/              # Frontend pages
├── solutions/             # Frontend pages
├── routes/                # API routes
├── services/              # Backend services
└── images/                # Static assets
```

## 🌐 **Frontend Deployment (GitHub Pages)**

### **Step 1: Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### **Step 2: Enable GitHub Pages**
1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Select **Source**: Deploy from a branch
4. Select **Branch**: main
5. Click **Save**

Your site will be available at: `https://yourusername.github.io/your-repo-name`

## 🔧 **Backend Deployment**

### **Option 1: Render (Recommended)**

1. **Sign up** at [render.com](https://render.com)
2. **Create New Web Service**
3. **Connect GitHub Repository**
4. **Configure:**
   - **Name**: cognisphere-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   SMTP_HOST=smtp.zoho.com
   SMTP_PORT=587
   SMTP_USER=admin@cogni-sphere.com
   SMTP_PASS=your-zoho-app-password
   ADMIN_EMAIL=admin@cogni-sphere.com
   ALLOWED_ORIGINS=https://yourusername.github.io
   ```
6. **Deploy**

### **Option 2: Heroku**

1. **Sign up** at [heroku.com](https://heroku.com)
2. **Install Heroku CLI**
3. **Create app:**
   ```bash
   heroku create your-app-name
   ```
4. **Set environment variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SMTP_HOST=smtp.zoho.com
   heroku config:set SMTP_PORT=587
   heroku config:set SMTP_USER=admin@cogni-sphere.com
   heroku config:set SMTP_PASS=your-zoho-app-password
   heroku config:set ADMIN_EMAIL=admin@cogni-sphere.com
   ```
5. **Deploy:**
   ```bash
   git push heroku main
   ```

### **Option 3: Vercel**

1. **Sign up** at [vercel.com](https://vercel.com)
2. **Import GitHub Repository**
3. **Configure:**
   - **Framework Preset**: Node.js
   - **Build Command**: `npm install`
   - **Output Directory**: `.`
4. **Add Environment Variables** in Vercel dashboard
5. **Deploy**

## 🔗 **Connect Frontend to Backend**

After deploying the backend, update the frontend API URLs:

### **For GitHub Pages + Render:**
In `about-us/contact-us.html`, update the fetch URL:
```javascript
const response = await fetch('https://your-app-name.onrender.com/api/booking/create', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData)
});
```

### **For GitHub Pages + Heroku:**
```javascript
const response = await fetch('https://your-app-name.herokuapp.com/api/booking/create', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData)
});
```

## 📧 **Email Configuration**

### **Zoho Mail Setup**
1. **Create Zoho Mail account** for your domain
2. **Generate App Password** in Zoho Mail settings
3. **Set environment variables:**
   ```
   SMTP_HOST=smtp.zoho.com
   SMTP_PORT=587
   SMTP_USER=admin@cogni-sphere.com
   SMTP_PASS=your-zoho-app-password
   ADMIN_EMAIL=admin@cogni-sphere.com
   ```

## 🧪 **Testing**

### **Test Backend**
```bash
# Health check
curl https://your-backend-url.com/api/health

# Test booking
curl -X POST https://your-backend-url.com/api/booking/create \
  -H "Content-Type: application/json" \
  -d '{
    "meetingType": "consultation",
    "date": "2025-08-20",
    "time": "14:00",
    "visitorName": "Test User",
    "visitorEmail": "test@example.com"
  }'
```

### **Test Frontend**
1. Visit your GitHub Pages URL
2. Navigate to Contact page
3. Try scheduling a meeting
4. Verify emails are sent

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **CORS Errors**
   - Ensure `ALLOWED_ORIGINS` includes your frontend URL
   - Check that the backend URL is correct in frontend

2. **Email Not Sending**
   - Verify Zoho Mail credentials
   - Check environment variables are set correctly
   - Test email configuration

3. **Database Issues**
   - SQLite database is created automatically
   - Check file permissions on hosting platform

4. **Port Issues**
   - Most platforms use `process.env.PORT`
   - Ensure your app listens on the correct port

## 📞 **Support**

If you encounter issues:
1. Check the deployment platform logs
2. Verify all environment variables are set
3. Test individual components (backend API, email service)
4. Check CORS configuration

---

**🎉 Your Cognisphere website will be live and fully functional!** 