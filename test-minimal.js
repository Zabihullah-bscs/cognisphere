#!/usr/bin/env node

/**
 * Minimal test server for Railway deployment
 */

const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

// Basic middleware
app.use(express.json());

// Simple health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        message: 'Minimal test server is working!'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Minimal Test Server',
        status: 'running',
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Minimal test server running on port ${PORT}`);
    console.log(`🔧 Railway PORT env: ${process.env.PORT || 'not set'}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Process env keys: ${Object.keys(process.env).filter(key => key.includes('PORT')).join(', ')}`);
}).on('error', (error) => {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
});

console.log('✅ Minimal test server script loaded successfully'); 