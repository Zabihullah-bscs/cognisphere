#!/usr/bin/env node

/**
 * Script to update API URLs in frontend files for production deployment
 * Usage: node update-api-urls.js <backend-url>
 * Example: node update-api-urls.js https://cognisphere-backend.railway.app
 */

const fs = require('fs');
const path = require('path');

// Get backend URL from command line argument
const backendUrl = process.argv[2];

if (!backendUrl) {
    console.error('❌ Please provide the backend URL as an argument');
    console.log('Usage: node update-api-urls.js <backend-url>');
    console.log('Example: node update-api-urls.js https://cognisphere-backend.railway.app');
    process.exit(1);
}

// Validate URL format
if (!backendUrl.startsWith('http')) {
    console.error('❌ Backend URL must start with http:// or https://');
    process.exit(1);
}

console.log(`🔄 Updating API URLs to: ${backendUrl}`);

// Files to update
const filesToUpdate = [
    'about-us/contact-us.html',
    'app.js'
];

let updatedFiles = 0;

filesToUpdate.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            let originalContent = content;
            
            // Update booking API URL
            content = content.replace(
                /fetch\('\/api\/booking\/create'/g,
                `fetch('${backendUrl}/api/booking/create'`
            );
            
            // Update contact API URL
            content = content.replace(
                /fetch\('\/api\/contact\/submit'/g,
                `fetch('${backendUrl}/api/contact/submit'`
            );
            
            // Update health check URL
            content = content.replace(
                /fetch\('\/api\/health'/g,
                `fetch('${backendUrl}/api/health'`
            );
            
            // Check if any changes were made
            if (content !== originalContent) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`✅ Updated: ${filePath}`);
                updatedFiles++;
            } else {
                console.log(`ℹ️  No changes needed: ${filePath}`);
            }
            
        } catch (error) {
            console.error(`❌ Error updating ${filePath}:`, error.message);
        }
    } else {
        console.log(`⚠️  File not found: ${filePath}`);
    }
});

console.log(`\n🎉 Updated ${updatedFiles} files successfully!`);
console.log('\n📝 Next steps:');
console.log('1. Commit and push your changes:');
console.log('   git add .');
console.log('   git commit -m "Update API URLs for production"');
console.log('   git push');
console.log('\n2. GitHub Pages will automatically redeploy');
console.log('\n3. Test your website to ensure everything works'); 