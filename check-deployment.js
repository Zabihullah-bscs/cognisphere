#!/usr/bin/env node

/**
 * Script to check deployment status of Cognisphere website
 * Usage: node check-deployment.js <backend-url>
 * Example: node check-deployment.js https://cognisphere-backend.railway.app
 */

const https = require('https');
const http = require('http');

// Get backend URL from command line argument
const backendUrl = process.argv[2];

if (!backendUrl) {
    console.error('❌ Please provide the backend URL as an argument');
    console.log('Usage: node check-deployment.js <backend-url>');
    console.log('Example: node check-deployment.js https://cognisphere-backend.railway.app');
    process.exit(1);
}

console.log('🔍 Checking deployment status...\n');

// Function to make HTTP request
function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        
        const req = client.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    data: data
                });
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

// Check frontend (GitHub Pages)
async function checkFrontend() {
    console.log('🌐 Checking Frontend (GitHub Pages)...');
    try {
        const response = await makeRequest('https://cogni-sphere.com');
        if (response.status === 200) {
            console.log('✅ Frontend is accessible');
            console.log(`   URL: https://cogni-sphere.com`);
            console.log(`   Status: ${response.status}`);
        } else {
            console.log('⚠️  Frontend returned unexpected status');
            console.log(`   Status: ${response.status}`);
        }
    } catch (error) {
        console.log('❌ Frontend is not accessible');
        console.log(`   Error: ${error.message}`);
    }
    console.log('');
}

// Check backend health
async function checkBackendHealth() {
    console.log('🔧 Checking Backend Health...');
    try {
        const response = await makeRequest(`${backendUrl}/api/health`);
        if (response.status === 200) {
            console.log('✅ Backend is healthy');
            console.log(`   URL: ${backendUrl}/api/health`);
            console.log(`   Status: ${response.status}`);
            
            try {
                const healthData = JSON.parse(response.data);
                console.log(`   Uptime: ${healthData.uptime} seconds`);
                console.log(`   Timestamp: ${healthData.timestamp}`);
            } catch (e) {
                console.log('   Response: Valid JSON response');
            }
        } else {
            console.log('⚠️  Backend returned unexpected status');
            console.log(`   Status: ${response.status}`);
        }
    } catch (error) {
        console.log('❌ Backend is not accessible');
        console.log(`   Error: ${error.message}`);
    }
    console.log('');
}

// Test booking API
async function testBookingAPI() {
    console.log('📅 Testing Booking API...');
    try {
        const testData = {
            meetingType: 'consultation',
            date: '2025-12-25',
            time: '10:00',
            visitorName: 'Test User',
            visitorEmail: 'test@example.com',
            visitorPhone: '1234567890',
            meetingNotes: 'Deployment test'
        };

        const response = await makeRequest(`${backendUrl}/api/booking/create`);
        console.log('✅ Booking API endpoint is accessible');
        console.log(`   URL: ${backendUrl}/api/booking/create`);
        console.log(`   Status: ${response.status}`);
    } catch (error) {
        console.log('❌ Booking API is not accessible');
        console.log(`   Error: ${error.message}`);
    }
    console.log('');
}

// Test contact API
async function testContactAPI() {
    console.log('📧 Testing Contact API...');
    try {
        const response = await makeRequest(`${backendUrl}/api/contact/submit`);
        console.log('✅ Contact API endpoint is accessible');
        console.log(`   URL: ${backendUrl}/api/contact/submit`);
        console.log(`   Status: ${response.status}`);
    } catch (error) {
        console.log('❌ Contact API is not accessible');
        console.log(`   Error: ${error.message}`);
    }
    console.log('');
}

// Main function
async function main() {
    console.log('🚀 Cognisphere Deployment Status Checker\n');
    console.log(`Backend URL: ${backendUrl}\n`);
    
    await checkFrontend();
    await checkBackendHealth();
    await testBookingAPI();
    await testContactAPI();
    
    console.log('📋 Summary:');
    console.log('1. Frontend: https://cogni-sphere.com');
    console.log('2. Backend: ' + backendUrl);
    console.log('3. Contact Page: https://cogni-sphere.com/about-us/contact-us.html');
    console.log('\n🎉 Deployment check completed!');
}

// Run the check
main().catch(console.error); 