const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Database configuration
const dbPath = path.join(__dirname, '..', 'data', 'cognisphere.db');
const dbDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection
const db = new Database(dbPath);

// Initialize database tables
async function initializeDatabase() {
    try {
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

        // Create contact_inquiries table
        db.exec(`
            CREATE TABLE IF NOT EXISTS contact_inquiries (
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
        db.exec('CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date)');
        db.exec('CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)');
        db.exec('CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(visitor_email)');
        db.exec('CREATE INDEX IF NOT EXISTS idx_inquiries_status ON contact_inquiries(status)');
        db.exec('CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON contact_inquiries(created_at)');

        console.log('✅ Database initialized successfully');
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    }
}

// Booking operations
async function createBooking(booking) {
    try {
        const query = `
            INSERT INTO bookings (
                id, meeting_type, meeting_name, duration, date, time,
                start_date_time, end_date_time, visitor_name, visitor_email,
                visitor_phone, meeting_notes, timezone, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            booking.id, booking.meetingType, booking.meetingName, booking.duration,
            booking.date, booking.time, booking.startDateTime, booking.endDateTime,
            booking.visitorName, booking.visitorEmail, booking.visitorPhone,
            booking.meetingNotes, booking.timezone, booking.status, booking.createdAt
        ];

        const stmt = db.prepare(query);
        stmt.run(params);
        
        console.log('Booking created with ID:', booking.id);
        return booking.id;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
}

async function getBookingsByDate(date) {
    try {
        const query = 'SELECT * FROM bookings WHERE date = ? AND status != "cancelled" ORDER BY time';
        const stmt = db.prepare(query);
        const rows = stmt.all(date);
        return rows || [];
    } catch (error) {
        console.error('Error fetching bookings by date:', error);
        throw error;
    }
}

async function getBookingById(bookingId) {
    try {
        const query = 'SELECT * FROM bookings WHERE id = ?';
        const stmt = db.prepare(query);
        const row = stmt.get(bookingId);
        return row || null;
    } catch (error) {
        console.error('Error fetching booking by ID:', error);
        throw error;
    }
}

async function checkAvailability(date, time, duration = 30) {
    try {
        // Get all bookings for the date that are not cancelled
        const query = 'SELECT time, duration FROM bookings WHERE date = ? AND status != "cancelled"';
        const stmt = db.prepare(query);
        const rows = stmt.all(date);
        
        // Convert time to minutes for easier comparison
        const requestedTimeMinutes = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
        const requestedEndMinutes = requestedTimeMinutes + duration;
        
        // Check for conflicts with existing bookings
        for (const booking of rows) {
            const bookingTimeMinutes = parseInt(booking.time.split(':')[0]) * 60 + parseInt(booking.time.split(':')[1]);
            const bookingEndMinutes = bookingTimeMinutes + booking.duration;
            
            // Check if the requested booking conflicts with this existing booking
            // A conflict occurs if:
            // 1. Requested start time is during an existing booking, OR
            // 2. Requested end time is during an existing booking, OR
            // 3. Requested booking completely contains an existing booking
            if ((requestedTimeMinutes >= bookingTimeMinutes && requestedTimeMinutes < bookingEndMinutes) ||
                (requestedEndMinutes > bookingTimeMinutes && requestedEndMinutes <= bookingEndMinutes) ||
                (requestedTimeMinutes <= bookingTimeMinutes && requestedEndMinutes >= bookingEndMinutes)) {
                return false; // Conflict found
            }
        }
        
        return true; // No conflicts found
    } catch (error) {
        console.error('Error checking availability:', error);
        throw error;
    }
}

async function getAllBookings(page = 1, limit = 20, filters = {}) {
    try {
        let query = 'SELECT * FROM bookings WHERE 1=1';
        const params = [];
        const conditions = [];

        // Apply filters
        if (filters.status) {
            conditions.push('status = ?');
            params.push(filters.status);
        }
        if (filters.dateFrom) {
            conditions.push('date >= ?');
            params.push(filters.dateFrom);
        }
        if (filters.dateTo) {
            conditions.push('date <= ?');
            params.push(filters.dateTo);
        }
        if (filters.meetingType) {
            conditions.push('meeting_type = ?');
            params.push(filters.meetingType);
        }

        if (conditions.length > 0) {
            query += ' AND ' + conditions.join(' AND ');
        }

        // Add pagination
        const offset = (page - 1) * limit;
        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM bookings WHERE 1=1';
        if (conditions.length > 0) {
            countQuery += ' AND ' + conditions.join(' AND ');
        }

        const countStmt = db.prepare(countQuery);
        const countRow = countStmt.get(params.slice(0, -2));

        const stmt = db.prepare(query);
        const rows = stmt.all(params);

        return {
            data: rows || [],
            pagination: {
                page,
                limit,
                total: countRow.total,
                totalPages: Math.ceil(countRow.total / limit)
            }
        };
    } catch (error) {
        console.error('Error fetching all bookings:', error);
        throw error;
    }
}

async function updateBookingStatus(bookingId, status) {
    try {
        const query = 'UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        const stmt = db.prepare(query);
        const result = stmt.run(status, bookingId);
        return result.changes > 0;
    } catch (error) {
        console.error('Error updating booking status:', error);
        throw error;
    }
}

async function cancelBooking(bookingId, reason = null) {
    try {
        const query = 'UPDATE bookings SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        const stmt = db.prepare(query);
        const result = stmt.run(bookingId);
        return result.changes > 0;
    } catch (error) {
        console.error('Error cancelling booking:', error);
        throw error;
    }
}

// Contact inquiry operations
async function saveContactInquiry(inquiry) {
    try {
        const query = `
            INSERT INTO contact_inquiries (
                name, email, phone, subject, message, company, service, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            inquiry.name, inquiry.email, inquiry.phone, inquiry.subject,
            inquiry.message, inquiry.company, inquiry.service, inquiry.status, inquiry.createdAt
        ];

        const stmt = db.prepare(query);
        const result = stmt.run(params);
        
        console.log('Contact inquiry saved with ID:', result.lastInsertRowid);
        return result.lastInsertRowid;
    } catch (error) {
        console.error('Error saving contact inquiry:', error);
        throw error;
    }
}

async function getAllContactInquiries(page = 1, limit = 20, filters = {}) {
    try {
        let query = 'SELECT * FROM contact_inquiries WHERE 1=1';
        const params = [];
        const conditions = [];

        // Apply filters
        if (filters.status) {
            conditions.push('status = ?');
            params.push(filters.status);
        }
        if (filters.service) {
            conditions.push('service = ?');
            params.push(filters.service);
        }
        if (filters.dateFrom) {
            conditions.push('created_at >= ?');
            params.push(filters.dateFrom);
        }
        if (filters.dateTo) {
            conditions.push('created_at <= ?');
            params.push(filters.dateTo);
        }

        if (conditions.length > 0) {
            query += ' AND ' + conditions.join(' AND ');
        }

        // Add pagination
        const offset = (page - 1) * limit;
        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM contact_inquiries WHERE 1=1';
        if (conditions.length > 0) {
            countQuery += ' AND ' + conditions.join(' AND ');
        }

        const countStmt = db.prepare(countQuery);
        const countRow = countStmt.get(params.slice(0, -2));

        const stmt = db.prepare(query);
        const rows = stmt.all(params);

        return {
            data: rows || [],
            pagination: {
                page,
                limit,
                total: countRow.total,
                totalPages: Math.ceil(countRow.total / limit)
            }
        };
    } catch (error) {
        console.error('Error fetching all inquiries:', error);
        throw error;
    }
}

async function getContactInquiryById(inquiryId) {
    try {
        const query = 'SELECT * FROM contact_inquiries WHERE id = ?';
        const stmt = db.prepare(query);
        const row = stmt.get(inquiryId);
        return row || null;
    } catch (error) {
        console.error('Error fetching inquiry by ID:', error);
        throw error;
    }
}

async function updateInquiryStatus(inquiryId, status, notes = null) {
    try {
        const query = 'UPDATE contact_inquiries SET status = ?, admin_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        const stmt = db.prepare(query);
        const result = stmt.run(status, notes, inquiryId);
        return result.changes > 0;
    } catch (error) {
        console.error('Error updating inquiry status:', error);
        throw error;
    }
}

// Dashboard statistics
async function getDashboardStats() {
    try {
        const queries = {
            totalBookings: 'SELECT COUNT(*) as count FROM bookings',
            confirmedBookings: 'SELECT COUNT(*) as count FROM bookings WHERE status = "confirmed"',
            cancelledBookings: 'SELECT COUNT(*) as count FROM bookings WHERE status = "cancelled"',
            totalInquiries: 'SELECT COUNT(*) as count FROM contact_inquiries',
            newInquiries: 'SELECT COUNT(*) as count FROM contact_inquiries WHERE status = "new"',
            todayBookings: 'SELECT COUNT(*) as count FROM bookings WHERE date = DATE("now")',
            thisWeekBookings: 'SELECT COUNT(*) as count FROM bookings WHERE date BETWEEN DATE("now", "weekday 0", "-6 days") AND DATE("now")',
            thisMonthBookings: 'SELECT COUNT(*) as count FROM bookings WHERE date BETWEEN DATE("now", "start of month") AND DATE("now")'
        };

        const stats = {};

        Object.keys(queries).forEach(key => {
            try {
                const stmt = db.prepare(queries[key]);
                const row = stmt.get();
                stats[key] = row.count;
            } catch (error) {
                console.error(`Error getting ${key} stats:`, error);
                stats[key] = 0;
            }
        });

        return stats;
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        throw error;
    }
}

// Close database connection
function closeDatabase() {
    try {
        db.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error closing database:', error);
    }
}

// Database initialization is now controlled by server.js

module.exports = {
    initializeDatabase,
    createBooking,
    getBookingsByDate,
    getBookingById,
    checkAvailability,
    getAllBookings,
    updateBookingStatus,
    cancelBooking,
    saveContactInquiry,
    getAllContactInquiries,
    getContactInquiryById,
    updateInquiryStatus,
    getDashboardStats,
    closeDatabase
}; 