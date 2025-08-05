# 🚨 Railway Deployment Troubleshooting Guide

## Issue: "Failed to get private network endpoint"

This error indicates a Railway platform issue, not a code issue. Here's how to fix it:

## Step 1: Check Railway Project Settings

1. **Go to Railway Dashboard**
   - Visit [railway.app](https://railway.app)
   - Navigate to your project

2. **Check Networking Settings**
   - Go to Settings > Networking
   - Look for "Private Networking" option
   - Try toggling it on/off

3. **Check Service Configuration**
   - Go to your deployed service
   - Check if there are any error messages
   - Verify the service is properly configured

## Step 2: Environment Variables Setup

Make sure these environment variables are set in Railway:

```
NODE_ENV=production
PORT=3000
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=admin@cogni-sphere.com
SMTP_PASS=6EubGLUDuCZy
ADMIN_EMAIL=admin@cogni-sphere.com
ALLOWED_ORIGINS=https://cognisphere-production.up.railway.app
```

## Step 3: Alternative Solutions

### Option A: Create New Railway Project
1. Create a completely new Railway project
2. Connect it to your GitHub repository
3. Set up environment variables
4. Deploy

### Option B: Use Railway CLI
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Link project: `railway link`
4. Deploy: `railway up`

### Option C: Check Railway Status
1. Visit [Railway Status Page](https://status.railway.app/)
2. Check if there are any ongoing issues
3. Wait if there are platform-wide problems

## Step 4: Verify Deployment

After fixing the networking issue:

1. **Check Build Logs**
   - Look for successful build messages
   - Verify `npm ci` completed successfully

2. **Check Runtime Logs**
   - Look for server startup messages
   - Verify health check endpoints are responding

3. **Test Health Endpoints**
   - Visit: `https://your-app-name.up.railway.app/health`
   - Should return: `OK`

## Step 5: Common Railway Issues

### Issue: Build Fails
- Check `package.json` and `package-lock.json` are in sync
- Verify all dependencies are listed

### Issue: Health Check Fails
- Server might be taking too long to start
- Check if database initialization is blocking startup

### Issue: Environment Variables Not Set
- Double-check all variables in Railway dashboard
- Ensure no typos in variable names

## Step 6: Contact Railway Support

If the issue persists:
1. Go to Railway Discord: [discord.gg/railway](https://discord.gg/railway)
2. Check the #help channel
3. Report the "Failed to get private network endpoint" error

## Quick Fix Commands

```bash
# Check environment variables locally
node check-env.js

# Test server locally
node server.js

# Verify health endpoints
curl http://localhost:3000/health
curl http://localhost:3000/api/health
```

## Expected Success Indicators

✅ Build completes without errors  
✅ Server starts and logs appear  
✅ Health check endpoint responds  
✅ No "Failed to get private network endpoint" errors  
✅ Service shows as "Healthy" in Railway dashboard 