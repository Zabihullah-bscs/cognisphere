const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Import routes
const bookingRoutes = require('./routes/booking');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');

// Initialize database
const { initializeDatabase } = require('./services/databaseService');

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://unpkg.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"]
        }
    }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['https://cogni-sphere.com']
        : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:8080'],
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        port: PORT,
        environment: process.env.NODE_ENV || 'development'
    });
});

// API routes
app.use('/api/booking', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '.')));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about-us/:page', (req, res) => {
    const page = req.params.page;
    const filePath = path.join(__dirname, 'about-us', `${page}.html`);
    res.sendFile(filePath);
});

app.get('/services/:page', (req, res) => {
    const page = req.params.page;
    const filePath = path.join(__dirname, 'services', `${page}.html`);
    res.sendFile(filePath);
});

app.get('/solutions/:page', (req, res) => {
    const page = req.params.page;
    const filePath = path.join(__dirname, 'solutions', `${page}.html`);
    res.sendFile(filePath);
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📧 Admin email: ${process.env.ADMIN_EMAIL || 'admin@cogni-sphere.com'}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Database path: ${process.env.DB_PATH || './data/cognisphere.db'}`);
    console.log(`✅ Health check available at: http://localhost:${PORT}/api/health`);
    
    // Initialize database in background
    setTimeout(async () => {
        try {
            await initializeDatabase();
            console.log('✅ Database initialized successfully');
        } catch (error) {
            console.error('❌ Database initialization failed:', error);
            console.log('⚠️  Server will continue without database functionality');
        }
    }, 1000);
}).on('error', (error) => {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

module.exports = app; 