const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

// Email configuration
const emailConfig = {
    host: process.env.SMTP_HOST || 'localhost',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'admin@cogni-sphere.com',
        pass: process.env.SMTP_PASS || ''
    }
};

// Debug: Log email configuration (without password)
console.log('📧 Email Configuration:');
console.log('  Host:', emailConfig.host);
console.log('  Port:', emailConfig.port);
console.log('  User:', emailConfig.auth.user);
console.log('  Password:', emailConfig.auth.pass ? '[SET]' : '[NOT SET]');

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Email templates
const emailTemplates = {
    bookingConfirmation: {
        subject: 'Meeting Confirmed - Cognisphere',
        template: 'booking-confirmation.html'
    },
    bookingNotification: {
        subject: 'New Meeting Booking - Cognisphere',
        template: 'booking-notification.html'
    },
    contactNotification: {
        subject: 'New Contact Inquiry - Cognisphere',
        template: 'contact-notification.html'
    },
    bookingCancellation: {
        subject: 'Meeting Cancelled - Cognisphere',
        template: 'booking-cancellation.html'
    }
};

// Load email template
async function loadEmailTemplate(templateName, data) {
    try {
        const templatePath = path.join(__dirname, 'email-templates', templateName);
        let template = await fs.readFile(templatePath, 'utf8');
        
        // Replace placeholders with actual data
        Object.keys(data).forEach(key => {
            const placeholder = `{{${key}}}`;
            template = template.replace(new RegExp(placeholder, 'g'), data[key]);
        });
        
        return template;
    } catch (error) {
        console.error('Error loading email template:', error);
        // Return a simple fallback template
        return generateFallbackTemplate(templateName, data);
    }
}

// Generate fallback template if file doesn't exist
function generateFallbackTemplate(templateName, data) {
    switch (templateName) {
        case 'booking-confirmation.html':
            return `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Meeting Confirmed</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #72a1dea2; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background: #f9f9f9; }
                        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                        .meeting-details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #72a1dea2; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Meeting Confirmed</h1>
                        </div>
                        <div class="content">
                            <p>Dear {{visitorName}},</p>
                            <p>Your meeting with Cognisphere has been confirmed!</p>
                            
                            <div class="meeting-details">
                                <h3>Meeting Details:</h3>
                                <p><strong>Type:</strong> {{meetingName}}</p>
                                <p><strong>Date:</strong> {{date}}</p>
                                <p><strong>Time:</strong> {{time}} (Pakistan Standard Time)</p>
                                <p><strong>Duration:</strong> {{duration}} minutes</p>
                                <p><strong>Meeting Link:</strong> <a href="{{meetingLink}}">Join Meeting</a></p>
                            </div>
                            
                            <p>We look forward to meeting with you!</p>
                            <p>Best regards,<br>The Cognisphere Team</p>
                        </div>
                        <div class="footer">
                            <p>Cognisphere - AI & Data Solutions</p>
                            <p>admin@cogni-sphere.com</p>
                        </div>
                    </div>
                </body>
                </html>
            `;
            
        case 'booking-notification.html':
            return `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>New Booking Notification</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #72a1dea2; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background: #f9f9f9; }
                        .booking-details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #72a1dea2; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>New Meeting Booking</h1>
                        </div>
                        <div class="content">
                            <p>A new meeting has been booked:</p>
                            
                            <div class="booking-details">
                                <h3>Booking Details:</h3>
                                <p><strong>Visitor:</strong> {{visitorName}}</p>
                                <p><strong>Email:</strong> {{visitorEmail}}</p>
                                <p><strong>Phone:</strong> {{visitorPhone}}</p>
                                <p><strong>Meeting Type:</strong> {{meetingName}}</p>
                                <p><strong>Date:</strong> {{date}}</p>
                                <p><strong>Time:</strong> {{time}}</p>
                                <p><strong>Duration:</strong> {{duration}} minutes</p>
                                <p><strong>Notes:</strong> {{meetingNotes}}</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `;
            
        case 'contact-notification.html':
            return `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>New Contact Inquiry</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #72a1dea2; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background: #f9f9f9; }
                        .inquiry-details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #72a1dea2; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>New Contact Inquiry</h1>
                        </div>
                        <div class="content">
                            <p>A new contact inquiry has been submitted:</p>
                            
                            <div class="inquiry-details">
                                <h3>Inquiry Details:</h3>
                                <p><strong>Name:</strong> {{name}}</p>
                                <p><strong>Email:</strong> {{email}}</p>
                                <p><strong>Phone:</strong> {{phone}}</p>
                                <p><strong>Company:</strong> {{company}}</p>
                                <p><strong>Subject:</strong> {{subject}}</p>
                                <p><strong>Service:</strong> {{service}}</p>
                                <p><strong>Message:</strong></p>
                                <p>{{message}}</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `;
            
        default:
            return `<p>${JSON.stringify(data)}</p>`;
    }
}

// Send booking confirmation emails
async function sendBookingEmails(booking, calendarEvent) {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@cogni-sphere.com';
        
        // Generate meeting link (you can integrate with actual meeting platforms)
        const meetingLink = generateMeetingLink(booking);
        
        // Prepare email data
        const emailData = {
            visitorName: booking.visitorName,
            visitorEmail: booking.visitorEmail,
            visitorPhone: booking.visitorPhone || 'Not provided',
            meetingName: booking.meetingName,
            date: booking.date,
            time: booking.time,
            duration: booking.duration,
            meetingNotes: booking.meetingNotes || 'No additional notes',
            meetingLink: meetingLink,
            bookingId: booking.id,
            timezone: 'Pakistan Standard Time (PST)'
        };

        // Send confirmation email to visitor
        const visitorEmailContent = await loadEmailTemplate('booking-confirmation.html', emailData);
        await sendEmail({
            to: booking.visitorEmail,
            subject: 'Meeting Confirmed - Cognisphere',
            html: visitorEmailContent,
            attachments: [{
                filename: 'meeting.ics',
                content: calendarEvent
            }]
        });

        // Send notification email to admin
        const adminEmailContent = await loadEmailTemplate('booking-notification.html', emailData);
        await sendEmail({
            to: adminEmail,
            subject: 'New Meeting Booking - Cognisphere',
            html: adminEmailContent
        });

        console.log('Booking confirmation emails sent successfully');
        return true;

    } catch (error) {
        console.error('Error sending booking emails:', error);
        return false;
    }
}

// Send contact notification email
async function sendContactEmail(inquiry) {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@cogni-sphere.com';
        
        const emailData = {
            name: inquiry.name,
            email: inquiry.email,
            phone: inquiry.phone || 'Not provided',
            company: inquiry.company || 'Not provided',
            subject: inquiry.subject,
            service: inquiry.service || 'Not specified',
            message: inquiry.message,
            inquiryDate: new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        const emailContent = await loadEmailTemplate('contact-notification.html', emailData);
        
        await sendEmail({
            to: adminEmail,
            subject: 'New Contact Inquiry - Cognisphere',
            html: emailContent
        });

        console.log('Contact notification email sent successfully');
        return true;

    } catch (error) {
        console.error('Error sending contact email:', error);
        return false;
    }
}

// Send generic email
async function sendEmail({ to, subject, html, text, attachments = [] }) {
    try {
        console.log('📧 Attempting to send email:');
        console.log('  To:', to);
        console.log('  Subject:', subject);
        console.log('  From:', emailConfig.auth.user);
        console.log('  SMTP Host:', emailConfig.host);
        console.log('  SMTP Port:', emailConfig.port);
        
        const mailOptions = {
            from: `"Cognisphere" <${emailConfig.auth.user}>`,
            to,
            subject,
            html,
            text,
            attachments
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', info.messageId);
        return true;

    } catch (error) {
        console.error('❌ Error sending email:', error);
        console.error('  Error details:', error.message);
        return false;
    }
}

// Generate meeting link (placeholder - integrate with actual meeting platforms)
function generateMeetingLink(booking) {
    // For now, return a placeholder link
    // In production, integrate with Google Meet, Zoom, or other platforms
    const baseUrl = process.env.MEETING_BASE_URL || 'https://meet.google.com';
    const meetingId = booking.id.replace(/-/g, '').substring(0, 12);
    return `${baseUrl}/${meetingId}`;
}

// Verify email configuration
async function verifyEmailConfig() {
    try {
        await transporter.verify();
        console.log('✅ Email configuration verified successfully');
        return true;
    } catch (error) {
        console.error('❌ Email configuration verification failed:', error);
        return false;
    }
}

module.exports = {
    sendBookingEmails,
    sendContactEmail,
    sendEmail,
    verifyEmailConfig
}; 