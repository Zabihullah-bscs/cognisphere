const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const { sendContactEmail } = require('../services/emailService');
const { saveContactInquiry } = require('../services/databaseService');

// Validation middleware for contact form
const validateContact = [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
    body('subject').trim().isLength({ min: 5, max: 200 }).withMessage('Subject must be between 5 and 200 characters'),
    body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters'),
    body('company').optional().isLength({ max: 100 }).withMessage('Company name too long'),
    body('service').optional().isIn(['ai', 'data', 'cloud', 'consulting', 'other']).withMessage('Invalid service type')
];

// Submit contact form
router.post('/submit', validateContact, async (req, res) => {
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
            name,
            email,
            phone,
            subject,
            message,
            company,
            service
        } = req.body;

        // Create contact inquiry object
        const inquiry = {
            name,
            email,
            phone: phone || null,
            subject,
            message,
            company: company || null,
            service: service || null,
            status: 'new',
            createdAt: new Date().toISOString()
        };

        // Save to database
        await saveContactInquiry(inquiry);

        // Send notification email
        await sendContactEmail(inquiry);

        res.status(200).json({
            success: true,
            message: 'Thank you for your message! We will get back to you soon.'
        });

    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({ error: 'Failed to submit contact form' });
    }
});

// Get contact information
router.get('/info', (req, res) => {
    res.json({
        email: 'admin@cogni-sphere.com',
        phone: '+92-XXX-XXXXXXX',
        address: 'Pakistan',
        timezone: 'Asia/Karachi (PST)',
        businessHours: {
            monday: '9:00 AM - 6:00 PM',
            tuesday: '9:00 AM - 6:00 PM',
            wednesday: '9:00 AM - 6:00 PM',
            thursday: '9:00 AM - 6:00 PM',
            friday: '9:00 AM - 6:00 PM',
            saturday: '10:00 AM - 4:00 PM',
            sunday: 'Closed'
        }
    });
});

module.exports = router; 