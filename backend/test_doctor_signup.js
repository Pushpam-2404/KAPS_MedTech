const db = require('./db');
// const axios = require('axios'); // Removed

(async () => {
    try {
        console.log('1. Signing up new doctor...');
        const payload = {
            name: 'Dr. Test Signup',
            email: 'dr.test@hospital.com',
            password: 'password123',
            role: 'doctor',
            department: 'Cardiology',
            specialty: 'Heart Surgeon'
        };

        const res = await fetch('http://localhost:3001/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(await res.text());
        console.log('Signup Response:', await res.json());

        console.log('2. checking DB...');
        const user = await db.query("SELECT * FROM Users WHERE email = 'dr.test@hospital.com'");
        console.log('User ID:', user.rows[0].id, 'Role:', user.rows[0].role);

        const doc = await db.query("SELECT * FROM Doctors WHERE user_id = $1", [user.rows[0].id]);
        console.log('Doctor Entry:', doc.rows[0]);

        if (doc.rows.length === 1 && doc.rows[0].department === 'Cardiology') {
            console.log('SUCCESS: Doctor Signup Verified');
        } else {
            console.log('FAILURE: Doctor entry missing or incorrect');
        }

    } catch (err) {
        console.error(err);
    }
    process.exit();
})();
