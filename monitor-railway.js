#!/usr/bin/env node

/**
 * Monitor Railway deployment and test backend
 */

const https = require('https');

const backendUrl = 'https://cognisphere-production.up.railway.app';

console.log('🔍 Monitoring Railway Backend Deployment...\n');

let attempts = 0;
const maxAttempts = 10;

function testBackend() {
    attempts++;
    console.log(`\n📡 Attempt ${attempts}/${maxAttempts} - Testing backend...`);
    
    return new Promise((resolve) => {
        const options = {
            hostname: 'cognisphere-production.up.railway.app',
            port: 443,
            path: '/api/health',
            method: 'GET',
            timeout: 10000
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log(`   Status: ${res.statusCode}`);
                
                if (res.statusCode === 200) {
                    console.log('   ✅ Backend is responding!');
                    console.log(`   Response: ${data}`);
                    resolve(true);
                } else {
                    console.log(`   ❌ Backend returned ${res.statusCode}`);
                    console.log(`   Response: ${data.substring(0, 100)}...`);
                    resolve(false);
                }
            });
        });

        req.on('error', (error) => {
            console.log(`   ❌ Connection error: ${error.message}`);
            resolve(false);
        });

        req.on('timeout', () => {
            console.log('   ⏰ Request timeout');
            req.destroy();
            resolve(false);
        });

        req.end();
    });
}

async function monitorDeployment() {
    for (let i = 0; i < maxAttempts; i++) {
        const success = await testBackend();
        
        if (success) {
            console.log('\n🎉 SUCCESS! Backend is working!');
            console.log('You can now test the booking functionality on your website.');
            return;
        }
        
        if (i < maxAttempts - 1) {
            console.log('\n⏳ Waiting 30 seconds before next attempt...');
            await new Promise(resolve => setTimeout(resolve, 30000));
        }
    }
    
    console.log('\n❌ Backend is still not responding after all attempts.');
    console.log('Please check Railway logs for any deployment issues.');
}

// Start monitoring
monitorDeployment(); 