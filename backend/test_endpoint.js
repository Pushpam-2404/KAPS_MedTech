(async () => {
    try {
        console.log('1. Logging in...');
        const LoginRes = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'prsatyarthi2404@gmail.com', password: 'password123' })
        });

        if (!LoginRes.ok) throw new Error('Login failed: ' + await LoginRes.text());
        const loginData = await LoginRes.json();
        const token = loginData.token;
        console.log('Login successful.');

        console.log('2. Fetching Record for Appointment ID 1...');
        const recordRes = await fetch('http://localhost:3001/api/appointments/1/record', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('Response Status:', recordRes.status);
        const text = await recordRes.text();
        console.log('Record Data:', text);

    } catch (err) {
        console.error('Error:', err.message);
    }
})();
