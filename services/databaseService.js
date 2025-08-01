const sqlite3 = require('sqlite3').verbose();
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
const db = new sqlite3.Database(dbPath);

// Initialize database tables
async function initializeDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Create bookings table
            db.run(`
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
            db.run(`
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
            db.run('CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date)');
            db.run('CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)');
            db.run('CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(visitor_email)');
            db.run('CREATE INDEX IF NOT EXISTS idx_inquiries_status ON contact_inquiries(status)');
            db.run('CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON contact_inquiries(created_at)');

            console.log('✅ Database initialized successfully');
            resolve();
        });
    });
}

// Booking operations
async function createBooking(booking) {
    return new Promise((resolve, reject) => {
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

        db.run(query, params, function(err) {
            if (err) {
                console.error('Error creating booking:', err);
                reject(err);
            } else {
                console.log('Booking created with ID:', booking.id);
                resolve(booking.id);
            }
        });
    });
}

async function getBookingsByDate(date) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM bookings WHERE date = ? AND status != "cancelled" ORDER BY time';
        
        db.all(query, [date], (err, rows) => {
            if (err) {
                console.error('Error fetching bookings by date:', err);
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
}

async function getBookingById(bookingId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM bookings WHERE id = ?';
        
        db.get(query, [bookingId], (err, row) => {
            if (err) {
                console.error('Error fetching booking by ID:', err);
                reject(err);
            } else {
                resolve(row || null);
            }
        });
    });
}

async function checkAvailability(date, time, duration = 30) {
    return new Promise((resolve, reject) => {
        // Get all bookings for the date that are not cancelled
        const query = 'SELECT time, duration FROM bookings WHERE date = ? AND status != "cancelled"';
        
        db.all(query, [date], (err, rows) => {
            if (err) {
                console.error('Error checking availability:', err);
                reject(err);
            } else {
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
                        resolve(false); // Conflict found
                        return;
                    }
                }
                
                resolve(true); // No conflicts found
            }
        });
    });
}

async function getAllBookings(page = 1, limit = 20, filters = {}) {
    return new Promise((resolve, reject) => {
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

        db.get(countQuery, params.slice(0, -2), (err, countRow) => {
            if (err) {
                console.error('Error getting booking count:', err);
                reject(err);
                return;
            }

            db.all(query, params, (err, rows) => {
                if (err) {
                    console.error('Error fetching all bookings:', err);
                    reject(err);
                } else {
                    resolve({
                        data: rows || [],
                        pagination: {
                            page,
                            limit,
                            total: countRow.total,
                            totalPages: Math.ceil(countRow.total / limit)
                        }
                    });
                }
            });
        });
    });
}

async function updateBookingStatus(bookingId, status) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        
        db.run(query, [status, bookingId], function(err) {
            if (err) {
                console.error('Error updating booking status:', err);
                reject(err);
            } else {
                resolve(this.changes > 0);
            }
        });
    });
}

async function cancelBooking(bookingId, reason = null) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE bookings SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        
        db.run(query, [bookingId], function(err) {
            if (err) {
                console.error('Error cancelling booking:', err);
                reject(err);
            } else {
                resolve(this.changes > 0);
            }
        });
    });
}

// Contact inquiry operations
async function saveContactInquiry(inquiry) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO contact_inquiries (
                name, email, phone, subject, message, company, service, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            inquiry.name, inquiry.email, inquiry.phone, inquiry.subject,
            inquiry.message, inquiry.company, inquiry.service, inquiry.status, inquiry.createdAt
        ];

        db.run(query, params, function(err) {
            if (err) {
                console.error('Error saving contact inquiry:', err);
                reject(err);
            } else {
                console.log('Contact inquiry saved with ID:', this.lastID);
                resolve(this.lastID);
            }
        });
    });
}

async function getAllContactInquiries(page = 1, limit = 20, filters = {}) {
    return new Promise((resolve, reject) => {
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

        db.get(countQuery, params.slice(0, -2), (err, countRow) => {
            if (err) {
                console.error('Error getting inquiry count:', err);
                reject(err);
                return;
            }

            db.all(query, params, (err, rows) => {
                if (err) {
                    console.error('Error fetching all inquiries:', err);
                    reject(err);
                } else {
                    resolve({
                        data: rows || [],
                        pagination: {
                            page,
                            limit,
                            total: countRow.total,
                            totalPages: Math.ceil(countRow.total / limit)
                        }
                    });
                }
            });
        });
    });
}

async function getContactInquiryById(inquiryId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM contact_inquiries WHERE id = ?';
        
        db.get(query, [inquiryId], (err, row) => {
            if (err) {
                console.error('Error fetching inquiry by ID:', err);
                reject(err);
            } else {
                resolve(row || null);
            }
        });
    });
}

async function updateInquiryStatus(inquiryId, status, notes = null) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE contact_inquiries SET status = ?, admin_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        
        db.run(query, [status, notes, inquiryId], function(err) {
            if (err) {
                console.error('Error updating inquiry status:', err);
                reject(err);
            } else {
                resolve(this.changes > 0);
            }
        });
    });
}

// Dashboard statistics
async function getDashboardStats() {
    return new Promise((resolve, reject) => {
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
        let completedQueries = 0;
        const totalQueries = Object.keys(queries).length;

        Object.keys(queries).forEach(key => {
            db.get(queries[key], (err, row) => {
                if (err) {
                    console.error(`Error getting ${key} stats:`, err);
                } else {
                    stats[key] = row.count;
                }
                
                completedQueries++;
                if (completedQueries === totalQueries) {
                    resolve(stats);
                }
            });
        });
    });
}

// Close database connection
function closeDatabase() {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
    });
}

// Initialize database on module load
initializeDatabase().catch(console.error);

module.exports = {
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