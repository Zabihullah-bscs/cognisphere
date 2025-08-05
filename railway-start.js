#!/usr/bin/env node

/**
 * Railway Startup Script
 * Handles Railway-specific startup requirements
 */

console.log('🚀 Railway Startup Script');
console.log('========================');

// Check environment
console.log('\n📋 Environment Check:');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`PORT: ${process.env.PORT || '3000'}`);
console.log(`Platform: ${process.platform}`);

// Check Railway-specific variables
console.log('\n📊 Railway Environment:');
console.log(`RAILWAY_ENVIRONMENT: ${process.env.RAILWAY_ENVIRONMENT || 'Not set'}`);
console.log(`RAILWAY_PROJECT_ID: ${process.env.RAILWAY_PROJECT_ID || 'Not set'}`);

// Validate required variables
const requiredVars = ['NODE_ENV', 'PORT', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'ADMIN_EMAIL'];
let missingVars = [];

requiredVars.forEach(varName => {
    if (!process.env[varName]) {
        missingVars.push(varName);
    }
});

if (missingVars.length > 0) {
    console.log(`\n❌ Missing environment variables: ${missingVars.join(', ')}`);
    console.log('Please set these in Railway dashboard');
    process.exit(1);
}

console.log('\n✅ Environment validation passed');
console.log('🚀 Starting server...\n');

// Start the server
require('./server.js'); 