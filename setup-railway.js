#!/usr/bin/env node

/**
 * Railway Deployment Setup Script
 * This script helps verify your Railway deployment configuration
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Railway Deployment Setup Check\n');

// Check required files
const requiredFiles = [
    'package.json',
    'server.js',
    'railway.json',
    '.env'
];

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - MISSING`);
    }
});

// Check package.json dependencies
console.log('\n📦 Checking package.json dependencies:');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = ['express', 'better-sqlite3', 'nodemailer', 'serve'];
    
    requiredDeps.forEach(dep => {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
            console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
        } else {
            console.log(`❌ ${dep} - MISSING`);
        }
    });
} catch (error) {
    console.log('❌ Error reading package.json');
}

// Check environment variables
console.log('\n🔧 Checking environment variables:');
const envContent = fs.readFileSync('.env', 'utf8');
const requiredEnvVars = [
    'NODE_ENV=production',
    'PORT=3000',
    'SMTP_HOST=smtp.zoho.com',
    'SMTP_USER=admin@cogni-sphere.com',
    'ALLOWED_ORIGINS=https://cognisphere-production.up.railway.app'
];

requiredEnvVars.forEach(envVar => {
    if (envContent.includes(envVar.split('=')[0])) {
        console.log(`✅ ${envVar.split('=')[0]}`);
    } else {
        console.log(`❌ ${envVar.split('=')[0]} - MISSING`);
    }
});

// Check frontend files
console.log('\n🌐 Checking frontend files:');
const frontendFiles = [
    'index.html',
    'about-us/contact-us.html',
    'style.css',
    'app.js'
];

frontendFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - MISSING`);
    }
});

console.log('\n🎯 Railway Deployment Checklist:');
console.log('1. ✅ Repository pushed to GitHub');
console.log('2. 🔄 Create Railway project from GitHub repo');
console.log('3. 🔧 Add environment variables in Railway dashboard');
console.log('4. 🧪 Test with Railway default domain first');
console.log('5. 🌐 Add custom domain later (optional)');
console.log('6. 🔗 Configure DNS records at your domain registrar');
console.log('7. 📧 Test booking functionality');
console.log('8. 🗑️  Unpublish from GitHub Pages');

console.log('\n📚 For detailed instructions, see: RAILWAY_DEPLOYMENT_GUIDE.md');
console.log('\n🚀 Ready for Railway deployment!'); 