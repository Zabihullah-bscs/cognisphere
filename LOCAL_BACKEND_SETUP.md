# 🖥️ Local Backend + GitHub Pages Frontend Setup

## 🎯 **Overview**

This setup runs your backend on your local machine (24/7) and serves the frontend from GitHub Pages. Perfect for your powerful machine with 32GB RAM and RTX 4060!

## 📋 **Prerequisites**

- ✅ Your machine runs 24/7
- ✅ 32GB RAM + RTX 4060 (excellent specs!)
- ✅ Static IP or dynamic DNS
- ✅ Port 8080 available
- ✅ GitHub account

## 🔧 **Step 1: Configure Local Backend**

### **1.1 Update Environment Variables**

Create/update your `.env` file:

```env
# Server Configuration
PORT=8080
NODE_ENV=production

# Admin Configuration
ADMIN_EMAIL=admin@cogni-sphere.com
ADMIN_TOKEN=your-secure-admin-token

# Email Configuration (Zoho Mail SMTP)
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=admin@cogni-sphere.com
SMTP_PASS=6EubGLUDuCZy

# Meeting Platform Configuration
MEETING_BASE_URL=https://meet.google.com

# Database Configuration
DB_PATH=./data/cognisphere.db

# Security
JWT_SECRET=your-secure-jwt-secret
SESSION_SECRET=your-secure-session-secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration (Update with your GitHub Pages URL)
ALLOWED_ORIGINS=https://zabihullah-bscs.github.io,http://localhost:3000
```

### **1.2 Get Your Local IP Address**

**Windows:**
```cmd
ipconfig
```
Look for "IPv4 Address" (usually 192.168.x.x)

**Linux/Mac:**
```bash
ifconfig
# or
ip addr show
```

### **1.3 Configure Firewall**

**Windows:**
1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Add Node.js and allow on Private/Public

**Linux:**
```bash
sudo ufw allow 8080
```

## 🚀 **Step 2: Start Local Backend**

### **2.1 Install Dependencies**
```bash
npm install
```

### **2.2 Start the Server**
```bash
npm start
```

You should see:
```
🚀 Server running on port 8080
📧 Admin email: admin@cogni-sphere.com
🌍 Environment: production
📊 Database path: ./data/cognisphere.db
✅ Health check available at: http://localhost:8080/api/health
✅ Database initialized successfully
```

### **2.3 Test Local Backend**
```bash
# Health check
curl http://localhost:8080/api/health

# Test booking
curl -X POST http://localhost:8080/api/booking/create \
  -H "Content-Type: application/json" \
  -d '{
    "meetingType": "consultation",
    "date": "2025-08-20",
    "time": "14:00",
    "visitorName": "Test User",
    "visitorEmail": "test@example.com"
  }'
```

## 🌐 **Step 3: Configure External Access**

### **3.1 Option A: Static IP (Recommended)**

If you have a static IP from your ISP:
- Your backend URL: `http://YOUR_STATIC_IP:8080`
- Update CORS in `.env`: `ALLOWED_ORIGINS=https://zabihullah-bscs.github.io`

### **3.2 Option B: Dynamic DNS (Free)**

1. **Sign up for free DDNS service:**
   - [No-IP](https://www.noip.com/) (free)
   - [Dynu](https://www.dynu.com/) (free)
   - [DuckDNS](https://www.duckdns.org/) (free)

2. **Install DDNS client on your machine**
3. **Your backend URL:** `http://your-domain.ddns.net:8080`

### **3.3 Option C: Port Forwarding**

1. **Access your router admin panel** (usually 192.168.1.1)
2. **Find Port Forwarding settings**
3. **Add rule:**
   - External Port: 8080
   - Internal IP: Your machine's IP
   - Internal Port: 8080
   - Protocol: TCP

## 🔄 **Step 4: Update Frontend URLs**

Once you have your external backend URL, update the frontend:

### **4.1 Manual Update**

In `about-us/contact-us.html`, find this line:
```javascript
const response = await fetch('/api/booking/create', {
```

Change to:
```javascript
const response = await fetch('http://YOUR_IP:8080/api/booking/create', {
```

### **4.2 Update CORS in Backend**

Update your `.env` file:
```env
ALLOWED_ORIGINS=https://zabihullah-bscs.github.io,http://localhost:3000
```

## 🌐 **Step 5: Deploy Frontend to GitHub Pages**

### **5.1 Push Updated Frontend**
```bash
git add .
git commit -m "Update frontend to use local backend"
git push
```

### **5.2 Enable GitHub Pages**
1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Select **Source**: Deploy from a branch
4. Select **Branch**: main
5. Click **Save**

Your site will be at: `https://zabihullah-bscs.github.io/cognisphere`

## 🧪 **Step 6: Testing**

### **6.1 Test Backend**
```bash
# Health check
curl http://YOUR_IP:8080/api/health

# Test booking
curl -X POST http://YOUR_IP:8080/api/booking/create \
  -H "Content-Type: application/json" \
  -d '{
    "meetingType": "consultation",
    "date": "2025-08-20",
    "time": "14:00",
    "visitorName": "Test User",
    "visitorEmail": "test@example.com"
  }'
```

### **6.2 Test Frontend**
1. Visit your GitHub Pages URL
2. Navigate to Contact page
3. Try scheduling a meeting
4. Verify emails are sent

## 🔧 **Step 7: Keep Backend Running 24/7**

### **7.1 Windows: Task Scheduler**
1. Open Task Scheduler
2. Create Basic Task
3. **Trigger:** At startup
4. **Action:** Start a program
5. **Program:** `C:\Program Files\nodejs\node.exe`
6. **Arguments:** `C:\path\to\your\project\server.js`
7. **Start in:** `C:\path\to\your\project`

### **7.2 Linux: Systemd Service**
Create `/etc/systemd/system/cognisphere.service`:
```ini
[Unit]
Description=Cognisphere Backend
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/your/project
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable cognisphere
sudo systemctl start cognisphere
```

### **7.3 PM2 (Recommended)**
```bash
# Install PM2
npm install -g pm2

# Start your app
pm2 start server.js --name cognisphere

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup
```

## 🔒 **Security Considerations**

### **8.1 Firewall Rules**
- Only allow port 8080 from trusted sources
- Consider using a reverse proxy (nginx)

### **8.2 Rate Limiting**
Your server already has rate limiting configured

### **8.3 SSL/HTTPS**
For production, consider:
- Using a reverse proxy with Let's Encrypt
- Or upgrading to a VPS with SSL

## 📊 **Monitoring**

### **9.1 Health Checks**
```bash
# Check if server is running
curl http://YOUR_IP:8080/api/health

# Check logs
tail -f /path/to/your/project/logs/app.log
```

### **9.2 Resource Monitoring**
With your 32GB RAM, you can easily handle:
- 1000+ concurrent users
- Multiple Node.js processes
- Database operations
- Email sending

## 🎉 **Benefits of This Setup**

✅ **No credit card required**
✅ **Full control over your backend**
✅ **Powerful machine utilization**
✅ **Free GitHub Pages hosting**
✅ **Easy to scale and modify**
✅ **24/7 availability**
✅ **Cost-effective**

## 📞 **Support**

If you encounter issues:
1. Check if backend is running: `curl http://localhost:8080/api/health`
2. Verify firewall settings
3. Check CORS configuration
4. Test email functionality
5. Monitor system resources

---

**🚀 Your Cognisphere website will be live with local backend + GitHub Pages!** 