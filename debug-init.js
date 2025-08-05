const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Database configuration
const dbPath = path.join(__dirname, 'data', 'cognisphere.db');
const dbDir = path.dirname(dbPath);

console.log('Database path:', dbPath);
console.log('Database exists before:', fs.existsSync(dbPath));

// Create database connection
const db = new Database(dbPath);

try {
    console.log('Checking if table exists...');
    const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='bookings'").get();
    console.log('Table exists:', !!tableExists);
    
    if (tableExists) {
        console.log('Checking table schema...');
        const tableInfo = db.prepare("PRAGMA table_info(bookings)").all();
        console.log('Columns:', tableInfo.map(col => col.name));
    }
    
    console.log('Running initializeDatabase...');
    
    // Check if status column exists in bookings table
    let statusColumnExists = false;
    try {
        const tableInfo = db.prepare("PRAGMA table_info(bookings)").all();
        statusColumnExists = tableInfo.some(col => col.name === 'status');
        console.log('Status column exists:', statusColumnExists);
    } catch (e) {
        console.log('Table doesn\'t exist');
    }

    // If table exists but doesn't have status column, drop and recreate
    if (!statusColumnExists) {
        console.log('Recreating bookings table with correct schema...');
        db.exec('DROP TABLE IF EXISTS bookings');
    }

    // Create bookings table
    db.exec(`
        CREATE TABLE IF NOT EXISTS bookings (
            id TEXT PRIMARY KEY,
            meeting_type TEXT NOT NULL,
            meeting_name TEXT NOT NULL,
            duration INTEGER NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            start_date_time TEXT NOT NULL,
            end_date_time TEXT NOT NULL,
            visitor_name TEXT NOT NULL,
            visitor_email TEXT NOT NULL,
            visitor_phone TEXT,
            meeting_notes TEXT,
            timezone TEXT NOT NULL,
            status TEXT DEFAULT 'confirmed',
            created_at TEXT NOT NULL,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log('Table created. Checking schema again...');
    const tableInfo = db.prepare("PRAGMA table_info(bookings)").all();
    console.log('Columns after creation:', tableInfo.map(col => col.name));
    
    console.log('Testing the failing query...');
    const query = 'SELECT time, duration FROM bookings WHERE date = ? AND status != "cancelled"';
    const stmt = db.prepare(query);
    const rows = stmt.all('2025-08-05');
    console.log('✅ Query executed successfully, rows:', rows.length);
    
} catch (error) {
    console.error('❌ Error:', error);
} finally {
    db.close();
} 