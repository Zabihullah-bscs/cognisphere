# Email Setup Guide for Cognisphere Backend

## Gmail SMTP Configuration

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to "Security"
3. Enable "2-Step Verification" if not already enabled

### Step 2: Generate App Password
1. Go to Google Account settings: https://myaccount.google.com/
2. Navigate to "Security" → "2-Step Verification"
3. Scroll down and click "App passwords"
4. Select "Mail" as the app and "Other" as the device
5. Click "Generate"
6. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Update .env File
Replace the current SMTP_PASS in your .env file with the App Password:

```env
# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=cognisphere.ai@gmail.com
SMTP_PASS=your-16-character-app-password-here
```

### Step 4: Test Email Configuration
Run the test script to verify email functionality:
```bash
node test-email.js
```

## Alternative Email Providers

### Option 1: Gmail with OAuth2 (Recommended for Production)
For better security, use OAuth2 instead of App Passwords:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=cognisphere.ai@gmail.com
SMTP_PASS=your-oauth2-token
SMTP_CLIENT_ID=your-oauth2-client-id
SMTP_CLIENT_SECRET=your-oauth2-client-secret
SMTP_REFRESH_TOKEN=your-oauth2-refresh-token
```

### Option 2: Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Option 3: SendGrid (Recommended for Production)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

## Email Templates

The following email templates have been created:

1. **booking-confirmation.html** - Sent to visitors when they book a meeting
2. **booking-notification.html** - Sent to admin when a new booking is made
3. **contact-notification.html** - Sent to admin when a contact form is submitted

## Testing Email Functionality

### Test 1: Booking Confirmation
1. Go to http://localhost:3000/about-us/contact-us.html
2. Schedule a meeting
3. Check both visitor and admin emails

### Test 2: Contact Form
1. Submit a contact form
2. Check admin email for notification

### Test 3: Manual Test
```bash
node test-email.js
```

## Troubleshooting

### Common Issues:

1. **"Invalid login" Error**
   - Ensure 2FA is enabled
   - Use App Password, not regular password
   - Check if App Password is correctly copied

2. **"Less secure app access" Error**
   - Gmail no longer supports less secure apps
   - Use App Passwords or OAuth2

3. **"Connection timeout" Error**
   - Check firewall settings
   - Verify SMTP_HOST and SMTP_PORT
   - Try different ports (465 for SSL, 587 for TLS)

4. **"Authentication failed" Error**
   - Double-check email and password
   - Ensure no extra spaces in .env file
   - Try regenerating App Password

## Security Best Practices

1. **Never commit .env files** to version control
2. **Use App Passwords** instead of regular passwords
3. **Consider OAuth2** for production environments
4. **Use environment-specific** email configurations
5. **Monitor email sending** for abuse detection

## Production Deployment

For production deployment:

1. Use a professional email service (SendGrid, Mailgun, etc.)
2. Set up proper DNS records (SPF, DKIM, DMARC)
3. Monitor email deliverability
4. Implement rate limiting
5. Set up email analytics

## Current Status

✅ Email templates created
✅ Email service configured
⚠️ Gmail authentication needs App Password
✅ Booking system functional
✅ Contact form functional
✅ Database working
✅ Backend server running

## Next Steps

1. Generate Gmail App Password
2. Update .env file with App Password
3. Test email functionality
4. Deploy to production
5. Monitor email delivery 