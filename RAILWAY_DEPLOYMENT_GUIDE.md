# 🚀 Railway Full-Stack Deployment Guide

## Overview
This guide will help you deploy both frontend and backend on Railway. We'll start with Railway's default domain to verify everything works, then add your custom domain `cogni-sphere.com` later.

## Prerequisites
1. Railway account (free tier available)
2. Custom domain `cogni-sphere.com` (already owned)
3. GitHub repository connected to Railway

## Step 1: Prepare Your Repository

### 1.1 Update Environment Variables
Create a `.env` file with Railway-specific settings:

```env
NODE_ENV=production
PORT=3000
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=admin@cogni-sphere.com
SMTP_PASS=6EubGLUDuCZy
ADMIN_EMAIL=admin@cogni-sphere.com
ALLOWED_ORIGINS=https://cognisphere-production.up.railway.app
```

**Note:** We'll update `ALLOWED_ORIGINS` to your custom domain after confirming everything works.

### 1.2 Commit and Push Changes
```bash
git add .
git commit -m "Prepare for Railway deployment with custom domain"
git push
```

## Step 2: Railway Deployment

### 2.1 Create Railway Project
1. Go to [Railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `cognisphere` repository

### 2.2 Configure Environment Variables
1. Go to your project settings
2. Navigate to "Variables" tab
3. Add all environment variables from the `.env` file above

### 2.3 Deploy the Service
1. Railway will automatically detect the Node.js project
2. The `railway.json` configuration will be used
3. Wait for the build to complete

## Step 3: Test with Railway Default Domain

### 3.1 Get Your Railway URL
1. After deployment, Railway will provide a default URL
2. It will look like: `https://cognisphere-production.up.railway.app`
3. Test your application at this URL first

### 3.2 Verify Functionality
1. Visit your Railway URL
2. Navigate to the contact page
3. Test the booking functionality
4. Verify emails are sent correctly

## Step 4: Custom Domain Setup (Optional - After Testing)

### 4.1 Add Custom Domain
1. Go to your Railway project
2. Click on your deployed service
3. Go to "Settings" → "Domains"
4. Click "Add Domain"
5. Enter: `cogni-sphere.com`

### 3.2 Configure DNS Records
You'll need to update your domain's DNS settings at your domain registrar (Hostinger):

#### Option A: Railway DNS (Recommended)
1. Railway will provide DNS records
2. Add these to your domain registrar:
   - Type: `CNAME`
   - Name: `@` or leave empty
   - Value: `[Railway-provided-domain].up.railway.app`

#### Option B: Custom DNS
If you prefer to keep DNS at your registrar:
1. Add A record pointing to Railway's IP
2. Add CNAME record for www subdomain

### 3.3 SSL Certificate
Railway automatically provides SSL certificates for custom domains.

## Step 5: Verify Deployment

### 5.1 Test Health Endpoint
```bash
curl https://cognisphere-production.up.railway.app/api/health
```

### 5.2 Test Booking Functionality
1. Visit `https://cognisphere-production.up.railway.app/about-us/contact-us.html`
2. Try scheduling a meeting
3. Verify emails are sent

### 5.3 Update for Custom Domain (After Testing)
Once everything works with the Railway domain:
1. Update `ALLOWED_ORIGINS` to `https://cogni-sphere.com`
2. Add your custom domain in Railway
3. Update DNS records
4. Test at `https://cogni-sphere.com`

## Step 6: Unpublish from GitHub Pages

### 6.1 Remove GitHub Pages
1. Go to your GitHub repository
2. Settings → Pages
3. Change source to "None"
4. Save

### 6.2 Remove CNAME File
```bash
git rm CNAME
git commit -m "Remove CNAME for Railway deployment"
git push
```

## Troubleshooting

### Common Issues

#### 1. Build Failures
- Check Railway logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

#### 2. Database Issues
- Railway provides persistent storage
- Database file will be stored in Railway's filesystem
- No additional database setup required

#### 3. Email Issues
- Verify SMTP credentials in Railway variables
- Check Zoho Mail settings
- Test email functionality after deployment

#### 4. Domain Issues
- DNS propagation can take up to 48 hours
- Verify DNS records are correct
- Check Railway domain settings

### Monitoring
- Use Railway's built-in monitoring
- Check logs for any errors
- Monitor resource usage

## Cost Considerations
- Railway free tier: $5/month credit
- Custom domains: Free
- SSL certificates: Free
- Estimated cost: $5-10/month for this setup

## Benefits of Railway Deployment
1. ✅ No network connectivity issues
2. ✅ Automatic SSL certificates
3. ✅ Built-in monitoring and logging
4. ✅ Easy scaling
5. ✅ Custom domain support
6. ✅ Persistent storage
7. ✅ Automatic deployments from GitHub

## Next Steps
1. Deploy to Railway
2. Test with Railway's default domain
3. Verify all functionality works
4. Add custom domain (optional)
5. Unpublish from GitHub Pages
6. Monitor performance

Your website will be fully functional at Railway's default URL with both frontend and backend running! 🎉 