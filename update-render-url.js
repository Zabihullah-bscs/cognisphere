#!/usr/bin/env node

/**
 * Update frontend API URLs to point to Render backend
 * Usage: node update-render-url.js https://your-app-name.onrender.com
 */

const fs = require('fs');
const path = require('path');

// Get Render URL from command line argument
const renderUrl = process.argv[2];

if (!renderUrl) {
    console.log('❌ Please provide your Render URL as an argument');
    console.log('Usage: node update-render-url.js https://your-app-name.onrender.com');
    process.exit(1);
}

// Validate URL format
if (!renderUrl.startsWith('https://') || !renderUrl.includes('.onrender.com')) {
    console.log('❌ Invalid Render URL format');
    console.log('Expected format: https://your-app-name.onrender.com');
    process.exit(1);
}

console.log(`🔄 Updating frontend to use Render backend: ${renderUrl}\n`);

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
            
            // Update fetch URLs
            content = content.replace(
                /fetch\('\/api\//g,
                `fetch('${renderUrl}/api/`
            );
            
            // Update any other relative API URLs
            content = content.replace(
                /['"]\/api\//g,
                `'${renderUrl}/api/`
            );
            
            if (content !== originalContent) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`✅ Updated: ${filePath}`);
                updatedFiles++;
            } else {
                console.log(`ℹ️  No changes needed: ${filePath}`);
            }
        } catch (error) {
            console.log(`❌ Error updating ${filePath}:`, error.message);
        }
    } else {
        console.log(`⚠️  File not found: ${filePath}`);
    }
});

console.log(`\n🎉 Updated ${updatedFiles} files successfully!`);
console.log(`\n📋 Next steps:`);
console.log(`1. Commit and push your changes:`);
console.log(`   git add .`);
console.log(`   git commit -m "Update API URLs to use Render backend"`);
console.log(`   git push`);
console.log(`\n2. Deploy frontend to GitHub Pages`);
console.log(`3. Test the booking functionality`);
console.log(`\n🔗 Your backend URL: ${renderUrl}`);
console.log(`🔗 Test health check: ${renderUrl}/api/health`); 