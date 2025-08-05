const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'cognisphere.db');
const db = new Database(dbPath);

try {
    console.log('Checking all tables in database...');
    
    // Get all tables
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('Tables in database:', tables.map(t => t.name));
    
    // Check if there's a table named 'cancelled'
    const cancelledTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='cancelled'").get();
    console.log('Cancelled table exists:', !!cancelledTable);
    
    // Check bookings table schema again
    const tableInfo = db.prepare("PRAGMA table_info(bookings)").all();
    console.log('Bookings table columns:', tableInfo.map(col => col.name));
    
    // Test a simple query without the status condition
    const simpleQuery = 'SELECT time, duration FROM bookings WHERE date = ?';
    const stmt1 = db.prepare(simpleQuery);
    const rows1 = stmt1.all('2025-08-05');
    console.log('✅ Simple query works, rows:', rows1.length);
    
    // Test the status column specifically
    const statusQuery = 'SELECT status FROM bookings LIMIT 1';
    const stmt2 = db.prepare(statusQuery);
    const rows2 = stmt2.all();
    console.log('✅ Status query works, rows:', rows2.length);
    
} catch (error) {
    console.error('❌ Error:', error);
} finally {
    db.close();
} 