# Cognisphere Website

A professional AI services company website with booking system and contact forms.

## 🚀 Quick Start

### For Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd cognisphere
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your email settings
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🌐 Deployment Guide

### Frontend (GitHub Pages)

The frontend files are ready for GitHub Pages deployment:

- `index.html` - Homepage
- `about-us/` - About pages
- `services/` - Service pages  
- `solutions/` - Solution pages
- `style.css` - Main stylesheet
- `app.js` - Frontend JavaScript

**To deploy to GitHub Pages:**
1. Push your code to GitHub
2. Go to Settings → Pages
3. Select source branch (usually `main`)
4. Your site will be available at `https://yourusername.github.io/your-repo-name`

### Backend (Node.js Hosting)

The backend requires a Node.js hosting service. Recommended options:

#### **Option A: Render**
1. Sign up at [render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repo
4. Set environment variables
5. Deploy

#### **Option B: Heroku**
1. Sign up at [heroku.com](https://heroku.com)
2. Install Heroku CLI
3. Create new app
4. Deploy with Git

#### **Option C: Vercel**
1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Set environment variables
4. Deploy automatically

#### **Option D: Railway**
1. Sign up at [railway.app](https://railway.app)
2. Connect your GitHub repo
3. Set environment variables
4. Deploy automatically

### Environment Variables for Backend

Create a `.env` file on your backend hosting:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Admin Configuration
ADMIN_EMAIL=admin@cogni-sphere.com
ADMIN_TOKEN=your-secure-admin-token

# Email Configuration (Zoho Mail SMTP)
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=admin@cogni-sphere.com
SMTP_PASS=your-zoho-app-password

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

# CORS Configuration
ALLOWED_ORIGINS=https://yourusername.github.io,https://cogni-sphere.com
```

### Update Frontend API URLs

After deploying the backend, update the API URLs in your frontend files:

**In `about-us/contact-us.html`:**
```javascript
// Change from relative URLs to your backend URL
const response = await fetch('https://your-backend-url.com/api/booking/create', {
    // ... rest of the code
});
```

**In `app.js` (if you have contact forms there):**
```javascript
// Update contact form submission URL
const response = await fetch('https://your-backend-url.com/api/contact/submit', {
    // ... rest of the code
});
```

## 📁 Project Structure

```
cognisphere/
├── index.html                 # Homepage
├── about-us/                  # About pages
│   ├── contact-us.html       # Contact & booking page
│   ├── careers.html          # Careers page
│   └── our-work.html         # Portfolio page
├── services/                  # Service pages
├── solutions/                 # Solution pages
├── images/                    # Images and assets
├── videos/                    # Video files
├── style.css                  # Main stylesheet
├── app.js                     # Frontend JavaScript
├── server.js                  # Backend server
├── routes/                    # API routes
├── services/                  # Backend services
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🔧 Configuration

### Email Setup

1. **Zoho Mail Configuration**
   - Set up Zoho Mail for your domain
   - Generate App Password
   - Update `.env` file with credentials

2. **DNS Configuration**
   - Add MX records for Zoho Mail
   - Add SPF records for email deliverability

### Database

- SQLite database is automatically created
- Database file: `data/cognisphere.db`
- No additional setup required

## 🚀 Running the Project

### Development Mode
```bash
npm start
```

### Production Mode
```bash
NODE_ENV=production npm start
```

### Testing Email Configuration
```bash
node test-email.js
```

## 📧 Email Templates

Professional email templates are included:
- `services/email-templates/booking-confirmation.html`
- `services/email-templates/booking-notification.html`
- `services/email-templates/contact-notification.html`

## 🔒 Security Features

- CORS protection
- Rate limiting
- Input validation
- SQL injection protection
- XSS protection

## 📞 Support

For technical support or questions:
- Email: admin@cogni-sphere.com
- Phone: +92 306-8952115

## 📄 License

This project is proprietary to Cognisphere.
