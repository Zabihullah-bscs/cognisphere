# 🌐 Custom Domain Setup Guide for cogni-sphere.com

This guide will help you configure your custom domain `cogni-sphere.com` to work with your Railway deployment.

## 🎯 **What We'll Achieve**

- Use `cogni-sphere.com` instead of `cognisphere-production.up.railway.app`
- Set up proper DNS configuration
- Enable HTTPS/SSL for your domain
- Ensure all functionality works with your custom domain

## 📋 **Prerequisites**

✅ **Railway Account**: Your backend is already deployed  
✅ **Domain Registrar**: You mentioned you bought the domain from Hostinger  
✅ **DNS Access**: Ability to modify DNS records in Hostinger  
✅ **GitHub Repository**: Your code is already connected to Railway  

## 🚀 **Step 1: Railway Domain Configuration**

### **1.1 Add Custom Domain in Railway**

1. **Go to Railway Dashboard**
   - Visit [railway.app](https://railway.app)
   - Select your `cognisphere` project

2. **Navigate to Settings**
   - Click on the **"Settings"** tab
   - Scroll down to **"Domains"** section

3. **Add Custom Domain**
   - Click **"Add Domain"**
   - Enter: `cogni-sphere.com`
   - Click **"Add"**

4. **Get DNS Records**
   - Railway will provide you with DNS records to configure
   - You'll see something like:
     ```
     Type: CNAME
     Name: @
     Value: cognisphere-production.up.railway.app
     ```

## 🔧 **Step 2: Hostinger DNS Configuration**

### **2.1 Access Hostinger DNS Settings**

1. **Login to Hostinger**
   - Go to [hostinger.com](https://hostinger.com)
   - Login to your account

2. **Access Domain Management**
   - Go to **"Domains"** section
   - Find `cogni-sphere.com`
   - Click **"Manage"**

3. **Access DNS Settings**
   - Click on **"DNS"** or **"DNS Management"**
   - Look for **"DNS Records"** or **"Zone Editor"**

### **2.2 Configure DNS Records**

**Add these DNS records in Hostinger:**

#### **Primary Domain (cogni-sphere.com)**
```
Type: CNAME
Name: @
Value: cognisphere-production.up.railway.app
TTL: 300 (or Auto)
```

#### **WWW Subdomain (www.cogni-sphere.com)**
```
Type: CNAME
Name: www
Value: cognisphere-production.up.railway.app
TTL: 300 (or Auto)
```

#### **Email Records (Keep Existing)**
Since you're using Zoho Mail, keep these existing records:
```
Type: MX
Name: @
Value: mx.zoho.com
Priority: 10
TTL: 300

Type: TXT
Name: @
Value: v=spf1 include:zoho.com ~all
TTL: 300
```

## ⏳ **Step 3: Wait for DNS Propagation**

### **3.1 DNS Propagation Time**
- **Typical time**: 5-30 minutes
- **Maximum time**: Up to 48 hours
- **Check status**: Use online DNS checkers

### **3.2 Verify DNS Propagation**
You can check if DNS is propagated using these tools:
- [whatsmydns.net](https://whatsmydns.net)
- [dnschecker.org](https://dnschecker.org)
- [mxtoolbox.com](https://mxtoolbox.com)

## ✅ **Step 4: Verify Railway Configuration**

### **4.1 Check Railway Domain Status**
1. **Go back to Railway Dashboard**
2. **Check the "Domains" section**
3. **Status should show**: "Active" or "Verified"
4. **SSL Certificate**: Should be automatically provisioned

### **4.2 Test Your Domain**
```bash
# Test the main domain
curl https://cogni-sphere.com/api/health

# Test the www subdomain
curl https://www.cogni-sphere.com/api/health
```

## 🔄 **Step 5: Update Frontend URLs (If Needed)**

Since we're using full-stack deployment, your frontend should already work with relative URLs. However, let's verify:

### **5.1 Check Current Configuration**
Your `about-us/contact-us.html` should already use:
```javascript
const response = await fetch('/api/booking/create', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData)
});
```

This relative URL will work with any domain.

## 🎉 **Step 6: Test Everything**

### **6.1 Test Frontend**
1. **Visit**: `https://cogni-sphere.com`
2. **Navigate to**: Contact page
3. **Test booking**: Schedule a meeting
4. **Verify**: Emails are sent correctly

### **6.2 Test API Endpoints**
```bash
# Health check
curl https://cogni-sphere.com/api/health

# Test booking (replace with your details)
curl -X POST https://cogni-sphere.com/api/booking/create \
  -H "Content-Type: application/json" \
  -d '{
    "meetingType": "consultation",
    "date": "2025-08-20",
    "time": "14:00",
    "visitorName": "Test User",
    "visitorEmail": "test@example.com"
  }'
```

## 🔧 **Troubleshooting**

### **If Domain Doesn't Work:**

1. **Check DNS Records**
   - Verify CNAME records are correct
   - Ensure TTL is set to 300 or Auto
   - Wait for DNS propagation

2. **Check Railway Status**
   - Ensure domain is "Active" in Railway
   - Check if SSL certificate is provisioned

3. **Test with Different Tools**
   ```bash
   # Test with nslookup
   nslookup cogni-sphere.com
   
   # Test with dig
   dig cogni-sphere.com CNAME
   ```

### **If SSL/HTTPS Doesn't Work:**
- Railway automatically provisions SSL certificates
- Wait 5-10 minutes after domain activation
- Clear browser cache and try again

### **If Emails Don't Work:**
- Verify Zoho Mail DNS records are still intact
- Check Railway environment variables
- Test email functionality

## 📞 **Support**

### **Railway Support**
- Railway automatically handles SSL certificates
- Domain verification is usually instant
- Contact Railway support if domain doesn't activate

### **Hostinger Support**
- Contact Hostinger if you can't access DNS settings
- They can help with DNS record configuration

## 🎯 **Expected Results**

After completing this setup:

✅ **Your website**: `https://cogni-sphere.com`  
✅ **WWW version**: `https://www.cogni-sphere.com`  
✅ **API endpoints**: `https://cogni-sphere.com/api/*`  
✅ **SSL/HTTPS**: Automatically enabled  
✅ **Email functionality**: Works with Zoho Mail  
✅ **Booking system**: Fully functional  

## 🚀 **Next Steps**

1. **Configure DNS records in Hostinger**
2. **Wait for DNS propagation**
3. **Test your domain**
4. **Update any external links** (if you have any pointing to the Railway URL)

---

**🎉 Your Cognisphere website will be live at `https://cogni-sphere.com` with full functionality!** 