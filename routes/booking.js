const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const { sendBookingEmails } = require('../services/emailService');
const { createBooking, getBookingsByDate, checkAvailability, getBookingById, cancelBooking } = require('../services/databaseService');

// Validation middleware for booking data
const validateBooking = [
    body('meetingType').isIn(['consultation', 'project', 'technical']).withMessage('Invalid meeting type'),
    body('date').isISO8601().withMessage('Invalid date format'),
    body('time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format'),
    body('visitorName').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('visitorEmail').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('visitorPhone').optional().isMobilePhone().withMessage('Invalid phone number'),
    body('meetingNotes').optional().isLength({ max: 1000 }).withMessage('Meeting notes too long')
];

// Get available time slots for a specific date
router.get('/availability/:date', async (req, res) => {
    try {
        const { date } = req.params;
        
        // Validate date format
        if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        // Check if date is in the past
        if (moment(date).isBefore(moment(), 'day')) {
            return res.status(400).json({ error: 'Cannot book appointments in the past' });
        }

        // Get existing bookings for this date
        const existingBookings = await getBookingsByDate(date);
        
        // Define available time slots (9 AM to 5 PM, excluding 1-2 PM lunch)
        const availableSlots = [
            '09:00', '10:00', '11:00', '12:00', 
            '14:00', '15:00', '16:00', '17:00'
        ];

        // Filter out booked slots
        const bookedTimes = existingBookings.map(booking => booking.time);
        const availableTimes = availableSlots.filter(time => !bookedTimes.includes(time));

        res.json({
            date,
            availableSlots: availableTimes,
            bookedSlots: bookedTimes
        });

    } catch (error) {
        console.error('Error checking availability:', error);
        res.status(500).json({ error: 'Failed to check availability' });
    }
});

// Create a new booking
router.post('/create', validateBooking, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: errors.array() 
            });
        }

        const {
            meetingType,
            date,
            time,
            visitorName,
            visitorEmail,
            visitorPhone,
            meetingNotes
        } = req.body;

        // Check if date is in the past
        if (moment(date).isBefore(moment(), 'day')) {
            return res.status(400).json({ error: 'Cannot book appointments in the past' });
        }

        // Get meeting type details
        const meetingTypes = {
            consultation: { name: 'Free Consultation', duration: 30 },
            project: { name: 'Project Discussion', duration: 60 },
            technical: { name: 'Technical Review', duration: 45 }
        };

        const selectedType = meetingTypes[meetingType];
        
        // Check if the time slot is still available
        const isAvailable = await checkAvailability(date, time, selectedType.duration);
        if (!isAvailable) {
            return res.status(409).json({ error: 'Selected time slot is no longer available' });
        }

        // Create booking object
        const bookingId = uuidv4();
        const bookingDateTime = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
        const endDateTime = bookingDateTime.clone().add(selectedType.duration, 'minutes');

        const booking = {
            id: bookingId,
            meetingType,
            meetingName: selectedType.name,
            duration: selectedType.duration,
            date,
            time,
            startDateTime: bookingDateTime.toISOString(),
            endDateTime: endDateTime.toISOString(),
            visitorName,
            visitorEmail,
            visitorPhone: visitorPhone || null,
            meetingNotes: meetingNotes || null,
            timezone: 'Asia/Karachi', // Pakistan Standard Time
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        // Save booking to database
        await createBooking(booking);

        // Generate calendar event - simplified to avoid ical issues
        const calendarEvent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Cognisphere//Meeting//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:${bookingId}
DTSTART:${bookingDateTime.format('YYYYMMDDTHHmmss')}Z
DTEND:${endDateTime.format('YYYYMMDDTHHmmss')}Z
SUMMARY:${selectedType.name} - ${visitorName}
DESCRIPTION:${meetingNotes || 'Meeting with Cognisphere team'}
LOCATION:Online Meeting
ORGANIZER;CN=Cognisphere:mailto:admin@cogni-sphere.com
ATTENDEE;CN=${visitorName}:mailto:${visitorEmail}
ATTENDEE;CN=Cognisphere Team:mailto:admin@cogni-sphere.com
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

        // Send confirmation emails (don't fail the booking if email fails)
        try {
            await sendBookingEmails(booking, calendarEvent);
        } catch (emailError) {
            console.error('Email sending failed, but booking was created:', emailError);
            // Continue with the booking even if email fails
        }

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking: {
                id: bookingId,
                meetingName: selectedType.name,
                date,
                time,
                duration: selectedType.duration,
                timezone: 'Pakistan Standard Time (PST)'
            }
        });

    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

// Get booking details by ID
router.get('/:bookingId', async (req, res) => {
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

// Cancel a booking
router.delete('/:bookingId', async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { email } = req.body; // Require email for verification

        const booking = await getBookingById(bookingId);
        
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Verify email matches booking
        if (booking.visitorEmail !== email) {
            return res.status(403).json({ error: 'Unauthorized to cancel this booking' });
        }

        // Cancel booking
        await cancelBooking(bookingId);

        res.json({ 
            success: true, 
            message: 'Booking cancelled successfully' 
        });

    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
});

module.exports = router; 