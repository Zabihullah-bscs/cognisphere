#!/usr/bin/env node

/**
 * Simple test to check Railway server status
 */

const https = require('https');

console.log('🔍 Testing Railway Server Status...\n');

function testEndpoint(path, description) {
    return new Promise((resolve) => {
        console.log(`📡 Testing ${description} (${path})...`);
        
        const options = {
            hostname: 'cognisphere-production.up.railway.app',
            port: 443,
            path: path,
            method: 'GET',
            timeout: 15000,
            headers: {
                'User-Agent': 'Railway-Test/1.0'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log(`   Status: ${res.statusCode}`);
                console.log(`   Headers: ${JSON.stringify(res.headers, null, 2)}`);
                console.log(`   Response: ${data.substring(0, 300)}${data.length > 300 ? '...' : ''}`);
                
                if (res.statusCode === 200) {
                    console.log('   ✅ SUCCESS! Server is responding!');
                    resolve(true);
                } else {
                    console.log(`   ❌ Server returned ${res.statusCode}`);
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

async function runTests() {
    console.log('🚀 Starting comprehensive Railway server tests...\n');
    
    // Test 1: Root endpoint
    const rootSuccess = await testEndpoint('/', 'Root endpoint');
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 2: Health endpoint
    const healthSuccess = await testEndpoint('/api/health', 'Health endpoint');
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 3: Non-existent endpoint (should return 404)
    const notFoundSuccess = await testEndpoint('/nonexistent', 'Non-existent endpoint');
    
    console.log('\n📊 Test Results Summary:');
    console.log(`   Root endpoint: ${rootSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`   Health endpoint: ${healthSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`   Non-existent endpoint: ${notFoundSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);
    
    if (rootSuccess || healthSuccess) {
        console.log('\n🎉 GREAT NEWS! Your Railway server is working!');
        console.log('The booking functionality should now work on your website.');
    } else {
        console.log('\n❌ Railway server is still not responding.');
        console.log('Please check the runtime logs in Railway dashboard for any startup errors.');
    }
}

// Run the tests
runTests(); 