const { initializeDatabase, createBooking, checkAvailability } = require('./services/databaseService');

async function testDatabase() {
    try {
        console.log('Testing database initialization...');
        await initializeDatabase();
        console.log('✅ Database initialized successfully');

        console.log('Testing availability check...');
        const isAvailable = await checkAvailability('2025-08-05', '10:00', 30);
        console.log('✅ Availability check:', isAvailable);

        console.log('Testing booking creation...');
        const booking = {
            id: 'test-123',
            meetingType: 'consultation',
            meetingName: 'Free Consultation',
            duration: 30,
            date: '2025-08-05',
            time: '10:00',
            startDateTime: '2025-08-05T10:00:00',
            endDateTime: '2025-08-05T10:30:00',
            visitorName: 'Test User',
            visitorEmail: 'test@example.com',
            visitorPhone: '1234567890',
            meetingNotes: 'Test booking',
            timezone: 'PST',
            status: 'confirmed',
            createdAt: '2025-08-05T10:00:00'
        };

        const bookingId = await createBooking(booking);
        console.log('✅ Booking created with ID:', bookingId);

    } catch (error) {
        console.error('❌ Database test failed:', error);
    }
}

testDatabase(); 