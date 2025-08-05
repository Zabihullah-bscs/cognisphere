const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Database configuration
const dbPath = path.join(__dirname, 'data', 'cognisphere.db');
const dbDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection
const db = new Database(dbPath);

async function resetDatabase() {
    try {
        console.log('Dropping existing tables...');
        
        // Drop existing tables
        db.exec('DROP TABLE IF EXISTS bookings');
        db.exec('DROP TABLE IF EXISTS contact_inquiries');
        
        console.log('Creating new tables...');
        
        // Create bookings table
        db.exec(`
            CREATE TABLE bookings (
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

        // Create contact_inquiries table
        db.exec(`
            CREATE TABLE contact_inquiries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                subject TEXT NOT NULL,
                message TEXT NOT NULL,
                company TEXT,
                service TEXT,
                status TEXT DEFAULT 'new',
                admin_notes TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create indexes for better performance
        db.exec('CREATE INDEX idx_bookings_date ON bookings(date)');
        db.exec('CREATE INDEX idx_bookings_status ON bookings(status)');
        db.exec('CREATE INDEX idx_bookings_email ON bookings(visitor_email)');
        db.exec('CREATE INDEX idx_inquiries_status ON contact_inquiries(status)');
        db.exec('CREATE INDEX idx_inquiries_created_at ON contact_inquiries(created_at)');

        console.log('✅ Database reset successfully');
        
        // Test the status column
        const testQuery = 'SELECT status FROM bookings LIMIT 1';
        db.prepare(testQuery);
        console.log('✅ Status column is accessible');
        
    } catch (error) {
        console.error('❌ Database reset failed:', error);
    } finally {
        db.close();
    }
}

resetDatabase(); 