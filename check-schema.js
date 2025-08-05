const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'cognisphere.db');
const db = new Database(dbPath);

try {
    console.log('Checking bookings table schema...');
    
    // Get table info
    const tableInfo = db.prepare("PRAGMA table_info(bookings)").all();
    console.log('Table columns:');
    tableInfo.forEach(col => {
        console.log(`  ${col.name} (${col.type})`);
    });
    
    // Test a simple query
    const testQuery = 'SELECT COUNT(*) as count FROM bookings';
    const result = db.prepare(testQuery).get();
    console.log('Total bookings:', result.count);
    
    // Test status column specifically
    const statusQuery = 'SELECT status FROM bookings LIMIT 1';
    db.prepare(statusQuery);
    console.log('✅ Status column is accessible');
    
} catch (error) {
    console.error('❌ Schema check failed:', error);
} finally {
    db.close();
} 