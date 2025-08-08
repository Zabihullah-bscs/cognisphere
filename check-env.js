function checkRequiredEnvVars() {
    /**
     * Environment Variables Check Script
     * Helps debug Railway deployment issues
     */

    console.log('🔍 Environment Variables Check\n');

    // Check critical environment variables
    const requiredVars = [
        'NODE_ENV',
        'PORT',
        'ADMIN_EMAIL',
        'ADMIN_TOKEN',
        'SMTP_HOST',
        'SMTP_PORT',
        'SMTP_USER',
        'SMTP_PASS',
        'MEETING_BASE_URL',
        'DB_PATH',
        'JWT_SECRET',
        'SESSION_SECRET',
        'RATE_LIMIT_WINDOW_MS',
        'RATE_LIMIT_MAX_REQUESTS',
        'ALLOWED_ORIGINS'
    ];

    console.log('📋 Required Environment Variables:');
    requiredVars.forEach(varName => {
        const value = process.env[varName];
        if (value) {
            // Mask sensitive values
            if (varName.includes('PASS')) {
                console.log(`✅ ${varName}: [SET]`);
            } else {
                console.log(`✅ ${varName}: ${value}`);
            }
        } else {
            console.log(`❌ ${varName}: [NOT SET]`);
        }
    });

    console.log('\n🌍 Current Environment:');
    console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    console.log(`PORT: ${process.env.PORT || '3000'}`);
    console.log(`Platform: ${process.platform}`);
    console.log(`Node Version: ${process.version}`);

    console.log('\n📊 Railway Specific:');
    console.log(`RAILWAY_ENVIRONMENT: ${process.env.RAILWAY_ENVIRONMENT || 'Not set'}`);
    console.log(`RAILWAY_PROJECT_ID: ${process.env.RAILWAY_PROJECT_ID || 'Not set'}`);
    console.log(`RAILWAY_SERVICE_ID: ${process.env.RAILWAY_SERVICE_ID || 'Not set'}`);

    console.log('\n🚀 Server Configuration:');
    console.log(`Server will start on port: ${process.env.PORT || 3000}`);
    console.log(`Health check path: /health`);
    console.log(`API health check path: /api/health`);

    console.log('\n✅ Environment check complete!');
}

module.exports = checkRequiredEnvVars;