const path = require('path');

// Database configuration
const dbPath = path.join(__dirname, 'data', 'cognisphere.db');
console.log('Current directory:', __dirname);
console.log('Database path:', dbPath);

// Test the path that databaseService uses
const dbPathService = path.join(__dirname, 'services', '..', 'data', 'cognisphere.db');
console.log('Service database path:', dbPathService);

// Check if they're the same
console.log('Paths are same:', dbPath === dbPathService);
console.log('Current path exists:', require('fs').existsSync(dbPath));
console.log('Service path exists:', require('fs').existsSync(dbPathService)); 