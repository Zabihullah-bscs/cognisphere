const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testBooking() {
    try {
        const bookingData = {
            meetingType: "consultation",
            meetingName: "Free Consultation",
            duration: 30,
            date: "2025-08-05",
            time: "11:00",
            startDateTime: "2025-08-05T11:00:00",
            endDateTime: "2025-08-05T11:30:00",
            visitorName: "Test User",
            visitorEmail: "test@example.com",
            visitorPhone: "1234567890",
            meetingNotes: "Test booking",
            timezone: "PST",
            status: "confirmed",
            createdAt: "2025-08-05T11:00:00"
        };

        const response = await fetch('http://localhost:8080/api/booking/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();
        console.log('Response status:', response.status);
        console.log('Response:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

testBooking(); 