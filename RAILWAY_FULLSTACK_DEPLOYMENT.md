# 🚀 Railway Full-Stack Deployment Guide

This guide will help you deploy both the frontend and backend of your Cognisphere website on Railway as a single full-stack application.

## 📋 **What We're Deploying**

- **Frontend**: HTML, CSS, JavaScript files (your website)
- **Backend**: Node.js API with booking and email functionality
- **Database**: SQLite (embedded in the application)
- **Email Service**: Zoho Mail integration

## 🎯 **Benefits of Full-Stack Railway Deployment**

✅ **Single Platform**: Everything runs on Railway  
✅ **Simplified Management**: One project, one URL  
✅ **Better Performance**: No cross-origin requests  
✅ **Easier Debugging**: All logs in one place  
✅ **Cost Effective**: Single deployment  

## 🔧 **Current Setup**

Your application is now configured as a full-stack app where:

1. **Express.js server** serves both API endpoints and static files
2. **Frontend files** are served from the root directory
3. **API endpoints** are available at `/api/*`
4. **All requests** go to the same domain

## 📁 **File Structure**

```
cognisphere/
├── server.js              # Main server (serves both frontend & API)
├── package.json           # Dependencies and scripts
├── railway.json           # Railway configuration
├── index.html             # Main website page
├── about-us/              # Frontend pages
├── services/              # Frontend pages
├── solutions/             # Frontend pages
├── routes/                # API routes
│   ├── booking.js         # Booking API
│   ├── contact.js         # Contact API
│   └── admin.js           # Admin API
├── services/              # Backend services
│   ├── databaseService.js # Database operations
│   ├── emailService.js    # Email functionality
│   └── email-templates/   # Email templates
└── images/                # Static assets
```

## 🚀 **Deployment Steps**

### **Step 1: Push Current Changes**

```bash
git add .
git commit -m "Configure full-stack deployment for Railway"
git push
```

### **Step 2: Railway Deployment**

1. **Go to Railway Dashboard**
2. **Create New Project** (if not already done)
3. **Connect GitHub Repository**
4. **Railway will automatically detect and deploy**

### **Step 3: Configure Environment Variables**

In Railway dashboard, set these variables:

```
NODE_ENV=production
PORT=8080
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=admin@cogni-sphere.com
SMTP_PASS=6EubGLUDuCZy
ADMIN_EMAIL=admin@cogni-sphere.com
```

### **Step 4: Get Your Domain**

1. **Go to "Settings" tab in Railway**
2. **Click "Generate Domain"**
3. **Copy the generated URL** (e.g., `https://your-app-name.up.railway.app`)

## 🌐 **How It Works**

### **Frontend Requests**
- `https://your-app.up.railway.app/` → Serves `index.html`
- `https://your-app.up.railway.app/about-us/contact-us.html` → Serves contact page
- `https://your-app.up.railway.app/images/logo.png` → Serves images

### **API Requests**
- `https://your-app.up.railway.app/api/health` → Health check
- `https://your-app.up.railway.app/api/booking/create` → Create booking
- `https://your-app.up.railway.app/api/contact/submit` → Submit contact form

## 🔍 **Testing the Deployment**

### **Test Frontend**
```bash
curl https://your-app.up.railway.app/
```

### **Test API**
```bash
curl https://your-app.up.railway.app/api/health
```

### **Test Booking**
```bash
curl -X POST https://your-app.up.railway.app/api/booking/create \
  -H "Content-Type: application/json" \
  -d '{
    "meetingType": "consultation",
    "date": "2025-08-15",
    "time": "10:00",
    "visitorName": "Test User",
    "visitorEmail": "test@example.com"
  }'
```

## 🎉 **Benefits You'll Get**

1. **Single URL**: Everything accessible from one domain
2. **No CORS Issues**: Frontend and backend on same origin
3. **Simplified Management**: One deployment, one set of logs
4. **Better Performance**: No external API calls
5. **Easier Debugging**: All issues in one place

## 🔧 **Troubleshooting**

### **If the deployment fails:**
1. Check Railway logs for error messages
2. Verify all environment variables are set
3. Ensure all dependencies are in `package.json`

### **If the website doesn't load:**
1. Check if the server is running (logs should show "Server running on port...")
2. Verify the domain is correctly generated
3. Test the health endpoint first

### **If booking doesn't work:**
1. Check if database is initialized (logs should show "Database initialized successfully")
2. Verify email configuration
3. Test the booking API directly

## 📞 **Support**

If you encounter any issues:
1. Check Railway logs first
2. Test individual endpoints
3. Verify environment variables
4. Contact support with specific error messages

---

**🎯 Your website will be fully functional with both frontend and backend running on Railway!** 