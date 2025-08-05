const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Database configuration
const dbPath = path.join(__dirname, 'data', 'cognisphere.db');
const dbDir = path.dirname(dbPath);

console.log('Database path:', dbPath);
console.log('Database exists:', fs.existsSync(dbPath));

// Create database connection
const db = new Database(dbPath);

try {
    console.log('Testing direct query...');
    
    // Test the exact query that's failing
    const query = 'SELECT time, duration FROM bookings WHERE date = ? AND status != "cancelled"';
    console.log('Query:', query);
    
    const stmt = db.prepare(query);
    const rows = stmt.all('2025-08-05');
    console.log('✅ Query executed successfully, rows:', rows.length);
    
} catch (error) {
    console.error('❌ Query failed:', error);
} finally {
    db.close();
} 