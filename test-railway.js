#!/usr/bin/env node

/**
 * Test script to check Railway backend status
 */

const https = require('https');

const backendUrl = 'https://cognisphere-production.up.railway.app';

console.log('🔍 Testing Railway Backend...\n');

// Test 1: Health endpoint
console.log('1. Testing /api/health endpoint...');
testEndpoint('/api/health');

// Test 2: Root endpoint
console.log('\n2. Testing root endpoint...');
testEndpoint('/');

// Test 3: Booking endpoint (should return 405 Method Not Allowed for GET)
console.log('\n3. Testing /api/booking/create endpoint...');
testEndpoint('/api/booking/create');

function testEndpoint(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'cognisphere-production.up.railway.app',
            port: 443,
            path: path,
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
                console.log(`   Headers: ${JSON.stringify(res.headers, null, 2)}`);
                console.log(`   Response: ${data.substring(0, 200)}${data.length > 200 ? '...' : ''}`);
                resolve();
            });
        });

        req.on('error', (error) => {
            console.log(`   Error: ${error.message}`);
            resolve();
        });

        req.on('timeout', () => {
            console.log('   Timeout: Request took too long');
            req.destroy();
            resolve();
        });

        req.end();
    });
}

// Wait a bit between tests
setTimeout(() => {
    console.log('\n✅ Testing completed!');
}, 2000); 