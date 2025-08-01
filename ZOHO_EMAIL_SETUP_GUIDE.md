# Zoho Mail Setup Guide for Cognisphere Backend

## 🎯 Overview

This guide will help you configure Zoho Mail for your Cognisphere backend using your custom domain (cogni-sphere.com) with Hostinger DNS.

## 📧 Zoho Mail Configuration

### Step 1: Zoho Mail Account Setup
1. **Sign up for Zoho Mail Free Plan**
   - Go to https://www.zoho.com/mail/
   - Choose the "Forever Free Plan" (5GB storage, 5 users)
   - Use your domain: `cogni-sphere.com`

2. **Create Email Account**
   - Create `admin@cogni-sphere.com` as your primary admin email
   - Set a strong password for the email account

### Step 2: Generate App Password
1. **Login to Zoho Mail**
   - Go to https://mail.zoho.com/
   - Login with `admin@cogni-sphere.com`

2. **Enable 2-Factor Authentication**
   - Go to Settings → Security
   - Enable "Two-Factor Authentication"
   - Use Google Authenticator or SMS

3. **Generate App Password**
   - Go to Settings → Security → App Passwords
   - Click "Generate New Password"
   - Name it "Cognisphere Backend"
   - Copy the generated password (16 characters)

### Step 3: Update .env File
Replace the placeholder in your `.env` file:

```env
# Email Configuration (Zoho Mail SMTP)
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=admin@cogni-sphere.com
SMTP_PASS=your-16-character-app-password-here
```

## 🌐 DNS Configuration (Hostinger)

### Step 1: Access Hostinger DNS
1. Login to Hostinger control panel
2. Go to "Domains" → "cogni-sphere.com"
3. Click "DNS" or "Manage DNS"

### Step 2: Add Zoho Mail DNS Records
Add these records to your Hostinger DNS:

#### MX Records (Mail Exchange)
```
Type: MX
Name: @
Value: mx.zoho.com
Priority: 10
TTL: 3600

Type: MX
Name: @
Value: mx2.zoho.com
Priority: 20
TTL: 3600
```

#### TXT Records (SPF for Email Security)
```
Type: TXT
Name: @
Value: v=spf1 include:zoho.com ~all
TTL: 3600
```

#### CNAME Records (Optional - for webmail)
```
Type: CNAME
Name: mail
Value: mail.zoho.com
TTL: 3600
```

### Step 3: Verify DNS Propagation
1. Wait 24-48 hours for DNS propagation
2. Test using: https://mxtoolbox.com/
3. Enter your domain: `cogni-sphere.com`

## 🧪 Testing Email Configuration

### Step 1: Test SMTP Connection
```bash
node test-email.js
```

### Step 2: Test Booking System
1. Start the server: `npm start`
2. Go to: http://localhost:3000/about-us/contact-us.html
3. Schedule a test meeting
4. Check both admin and visitor emails

### Step 3: Test Contact Form
1. Submit a contact form
2. Check admin email for notification

## 🔧 Zoho Mail SMTP Settings

### Production Settings
```
SMTP Host: smtp.zoho.com
SMTP Port: 587 (TLS) or 465 (SSL)
Security: TLS/SSL
Username: admin@cogni-sphere.com
Password: Your App Password
```

### Alternative Ports
- **Port 587**: TLS (Recommended)
- **Port 465**: SSL
- **Port 25**: Not recommended (blocked by many ISPs)

## 📧 Email Templates Configuration

Your email templates are already configured for:
- **From Address**: `admin@cogni-sphere.com`
- **Reply-To**: `admin@cogni-sphere.com`
- **Domain Branding**: `cogni-sphere.com`

## 🚀 Production Deployment

### Step 1: Environment Variables
For production, update your `.env` file:
```env
NODE_ENV=production
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=admin@cogni-sphere.com
SMTP_PASS=your-production-app-password
ADMIN_EMAIL=admin@cogni-sphere.com
```

### Step 2: Security Best Practices
1. **Use App Passwords** instead of regular passwords
2. **Enable 2FA** on your Zoho account
3. **Monitor email sending** for abuse detection
4. **Set up email forwarding** if needed

### Step 3: Email Deliverability
1. **SPF Record**: Already configured
2. **DKIM**: Zoho provides DKIM keys (optional)
3. **DMARC**: Add DMARC record for better security

## 🔍 Troubleshooting

### Common Issues:

1. **"Authentication failed"**
   - Check if App Password is correct
   - Ensure 2FA is enabled
   - Verify email address is correct

2. **"Connection timeout"**
   - Check firewall settings
   - Try port 465 instead of 587
   - Verify SMTP_HOST is correct

3. **"DNS not propagated"**
   - Wait 24-48 hours
   - Check DNS propagation tools
   - Verify MX records are correct

4. **"Email not received"**
   - Check spam folder
   - Verify recipient email address
   - Check Zoho Mail settings

### Testing Commands:
```bash
# Test SMTP connection
telnet smtp.zoho.com 587

# Test DNS records
nslookup -type=mx cogni-sphere.com

# Test email sending
node test-email.js
```

## 📊 Zoho Mail Features

### Free Plan Includes:
- ✅ 5GB storage per user
- ✅ 5 users maximum
- ✅ Custom domain support
- ✅ SMTP/IMAP access
- ✅ Webmail interface
- ✅ Mobile apps
- ✅ Spam protection

### Limitations:
- ⚠️ 25 emails per hour (free plan)
- ⚠️ 5GB storage limit
- ⚠️ Basic support only

## 🎉 Success Checklist

- [ ] Zoho Mail account created
- [ ] DNS records configured in Hostinger
- [ ] App password generated
- [ ] .env file updated
- [ ] SMTP connection tested
- [ ] Booking emails working
- [ ] Contact form emails working
- [ ] DNS propagation verified

## 📞 Support

- **Zoho Mail Support**: https://www.zoho.com/mail/help/
- **Hostinger Support**: https://www.hostinger.com/contact
- **DNS Check**: https://mxtoolbox.com/

Your Cognisphere backend is now configured for professional email communication using your custom domain! 🚀 