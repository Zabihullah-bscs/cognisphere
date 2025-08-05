# 🚀 Railway Setup - Step by Step Guide

## Current Issue: "Failed to get private network endpoint" + "1/1 replicas never became healthy"

This guide will fix both issues.

## Step 1: Railway Project Configuration

### 1.1 Go to Railway Dashboard
- Visit [railway.app](https://railway.app)
- Navigate to your project

### 1.2 Generate Public Domain
1. Go to **Settings > Networking**
2. In the **Public Networking** section, click **"Generate Domain"**
3. When asked for **Port Number**, enter: **`3000`**
4. Click **Generate** or **Confirm**
5. **Copy the generated domain** (e.g., `https://your-app-name.up.railway.app`)

### 1.3 Disable Private Networking (if enabled)
1. In the same **Networking** settings
2. Look for **Private Networking** section
3. If it's enabled, **disable it** for now
4. Save changes

## Step 2: Environment Variables Setup

### 2.1 Go to Variables Tab
1. In your Railway project, go to **Variables** tab
2. Add these environment variables:

```
NODE_ENV=production
PORT=3000
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=admin@cogni-sphere.com
SMTP_PASS=6EubGLUDuCZy
ADMIN_EMAIL=admin@cogni-sphere.com
ALLOWED_ORIGINS=https://your-generated-domain.up.railway.app
```

**Important:** Replace `your-generated-domain` with the actual domain you got from Step 1.2

### 2.2 Verify Variables
- Make sure all variables are set correctly
- No extra spaces or quotes
- Case-sensitive

## Step 3: Deploy and Test

### 3.1 Trigger Deployment
1. Go to **Deployments** tab
2. Click **"Deploy"** or **"Redeploy"**
3. Wait for build to complete

### 3.2 Check Build Logs
Look for these success indicators:
- ✅ `npm ci` completed successfully
- ✅ `🚀 Railway Startup Script` appears
- ✅ `✅ Environment validation passed`
- ✅ `🚀 Starting server...`
- ✅ `✅ Server running on port 3000`

### 3.3 Test Health Endpoints
1. Visit: `https://your-generated-domain.up.railway.app/health`
   - Should return: `OK`
2. Visit: `https://your-generated-domain.up.railway.app/api/health`
   - Should return JSON with status info

## Step 4: Troubleshooting

### If Still Getting "1/1 replicas never became healthy":

1. **Check Railway Status**
   - Visit [status.railway.app](https://status.railway.app)
   - Check for platform issues

2. **Try Different Port**
   - Change `PORT=3000` to `PORT=8080` in environment variables
   - Update the port in Railway networking settings

3. **Check Logs**
   - Go to **Deployments** tab
   - Click on the latest deployment
   - Check **Runtime Logs** for errors

### If Getting "Failed to get private network endpoint":

1. **Disable Private Networking**
   - Go to Settings > Networking
   - Turn off Private Networking
   - Use only Public Networking

2. **Create New Project**
   - Sometimes Railway projects get corrupted
   - Create a completely new project
   - Follow steps 1-3 again

## Step 5: Verify Full Functionality

### 5.1 Test Website
1. Visit your Railway domain
2. Navigate to different pages
3. Test the contact form

### 5.2 Test Booking System
1. Go to Contact Us page
2. Try scheduling a meeting
3. Verify emails are sent

## Expected Success Flow

1. ✅ Build completes without errors
2. ✅ Railway startup script runs
3. ✅ Environment variables validated
4. ✅ Server starts on port 3000
5. ✅ Health check responds
6. ✅ Website loads correctly
7. ✅ Booking system works
8. ✅ Emails are sent

## Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| "Failed to get private network endpoint" | Disable private networking, use public domain |
| "1/1 replicas never became healthy" | Check port configuration, increase healthcheck timeout |
| Build fails | Check package.json and package-lock.json sync |
| Environment variables not set | Double-check all variables in Railway dashboard |
| Health check fails | Verify server starts and responds on correct port |

## Support

If issues persist:
1. Check Railway Discord: [discord.gg/railway](https://discord.gg/railway)
2. Report specific error messages
3. Share your Railway project logs 