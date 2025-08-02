#!/usr/bin/env node

/**
 * Test health endpoint locally
 */

const http = require('http');

const PORT = process.env.PORT || 8080;
const HOST = 'localhost';

console.log('🔍 Testing health endpoint...\n');

const options = {
    hostname: HOST,
    port: PORT,
    path: '/api/health',
    method: 'GET',
    timeout: 10000
};

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(`✅ Health check successful!`);
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Response: ${data}`);
        
        try {
            const response = JSON.parse(data);
            console.log(`   Server uptime: ${response.uptime}s`);
            console.log(`   Environment: ${response.environment}`);
            console.log(`   Port: ${response.port}`);
        } catch (e) {
            console.log('   Response is not JSON');
        }
    });
});

req.on('error', (error) => {
    console.log(`❌ Health check failed: ${error.message}`);
    process.exit(1);
});

req.on('timeout', () => {
    console.log('⏰ Health check timeout');
    req.destroy();
    process.exit(1);
});

req.end(); 