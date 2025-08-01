const express = require('express');
const router = express.Router();

const { 
    getAllBookings, 
    getBookingById, 
    updateBookingStatus,
    cancelBooking,
    getAllContactInquiries,
    getContactInquiryById,
    updateInquiryStatus,
    getDashboardStats
} = require('../services/databaseService');

// Basic authentication middleware (you can enhance this with JWT)
const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    // For now, using a simple token check
    // In production, you should implement proper JWT authentication
    const token = authHeader.split(' ')[1];
    if (token !== process.env.ADMIN_TOKEN) {
        return res.status(403).json({ error: 'Invalid token' });
    }

    next();
};

// Apply authentication to all admin routes
router.use(authenticateAdmin);

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
    try {
        const stats = await getDashboardStats();
        res.json(stats);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
});

// Get all bookings with pagination and filters
router.get('/bookings', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            status, 
            dateFrom, 
            dateTo,
            meetingType 
        } = req.query;

        const filters = {};
        if (status) filters.status = status;
        if (dateFrom) filters.dateFrom = dateFrom;
        if (dateTo) filters.dateTo = dateTo;
        if (meetingType) filters.meetingType = meetingType;

        const bookings = await getAllBookings(parseInt(page), parseInt(limit), filters);
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Get specific booking details
router.get('/bookings/:bookingId', async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await getBookingById(bookingId);
        
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json({ booking });
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
});

// Update booking status
router.patch('/bookings/:bookingId/status', async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;

        if (!['confirmed', 'cancelled', 'completed', 'rescheduled'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const updated = await updateBookingStatus(bookingId, status);
        
        if (!updated) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json({ 
            success: true, 
            message: 'Booking status updated successfully' 
        });
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ error: 'Failed to update booking status' });
    }
});

// Cancel booking (admin override)
router.delete('/bookings/:bookingId', async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { reason } = req.body;

        const cancelled = await cancelBooking(bookingId, reason);
        
        if (!cancelled) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json({ 
            success: true, 
            message: 'Booking cancelled successfully' 
        });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
});

// Get all contact inquiries with pagination and filters
router.get('/inquiries', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            status, 
            service,
            dateFrom, 
            dateTo 
        } = req.query;

        const filters = {};
        if (status) filters.status = status;
        if (service) filters.service = service;
        if (dateFrom) filters.dateFrom = dateFrom;
        if (dateTo) filters.dateTo = dateTo;

        const inquiries = await getAllContactInquiries(parseInt(page), parseInt(limit), filters);
        res.json(inquiries);
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
});

// Get specific inquiry details
router.get('/inquiries/:inquiryId', async (req, res) => {
    try {
        const { inquiryId } = req.params;
        const inquiry = await getContactInquiryById(inquiryId);
        
        if (!inquiry) {
            return res.status(404).json({ error: 'Inquiry not found' });
        }

        res.json({ inquiry });
    } catch (error) {
        console.error('Error fetching inquiry:', error);
        res.status(500).json({ error: 'Failed to fetch inquiry' });
    }
});

// Update inquiry status
router.patch('/inquiries/:inquiryId/status', async (req, res) => {
    try {
        const { inquiryId } = req.params;
        const { status, notes } = req.body;

        if (!['new', 'in-progress', 'responded', 'closed'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const updated = await updateInquiryStatus(inquiryId, status, notes);
        
        if (!updated) {
            return res.status(404).json({ error: 'Inquiry not found' });
        }

        res.json({ 
            success: true, 
            message: 'Inquiry status updated successfully' 
        });
    } catch (error) {
        console.error('Error updating inquiry status:', error);
        res.status(500).json({ error: 'Failed to update inquiry status' });
    }
});

// Export bookings data
router.get('/export/bookings', async (req, res) => {
    try {
        const { format = 'json', dateFrom, dateTo } = req.query;
        
        const filters = {};
        if (dateFrom) filters.dateFrom = dateFrom;
        if (dateTo) filters.dateTo = dateTo;

        const bookings = await getAllBookings(1, 1000, filters); // Get all bookings

        if (format === 'csv') {
            // Convert to CSV format
            const csvData = convertToCSV(bookings.data);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=bookings.csv');
            res.send(csvData);
        } else {
            res.json(bookings);
        }
    } catch (error) {
        console.error('Error exporting bookings:', error);
        res.status(500).json({ error: 'Failed to export bookings' });
    }
});

// Helper function to convert data to CSV
function convertToCSV(data) {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header];
            return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        });
        csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
}

module.exports = router; 