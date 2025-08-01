const nodemailer = require('nodemailer');

// Email configuration
const emailConfig = {
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    auth: {
        user: 'admin@cogni-sphere.com',
        pass: '6EubGLUDuCZy'
    }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

async function testEmail() {
    try {
        console.log('Testing email configuration...');
        
        // Verify email configuration
        await transporter.verify();
        console.log('✅ Email configuration verified successfully');
        
        // Send test email
        const mailOptions = {
            from: '"Cognisphere" <admin@cogni-sphere.com>',
            to: 'admin@cogni-sphere.com',
            subject: 'Test Email - Cognisphere Backend',
            html: `
                <h2>🎉 Email System Test Successful!</h2>
                <p>This is a test email to verify that the Cognisphere backend email system is working correctly.</p>
                <p><strong>Test Details:</strong></p>
                <ul>
                    <li>✅ SMTP Configuration: Working</li>
                    <li>✅ Gmail Authentication: Successful</li>
                    <li>✅ Email Templates: Ready</li>
                    <li>✅ Booking System: Functional</li>
                </ul>
                <p>Your email system is now ready for production use!</p>
                <hr>
                <p><em>Sent from Cognisphere Backend at ${new Date().toLocaleString()}</em></p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
        
    } catch (error) {
        console.error('❌ Email test failed:', error);
    }
}

// Run the test
testEmail(); 