// const fetch = require('node-fetch'); // or native fetch
// Native fetch in Node 21+


(async () => {
    try {
        console.log('Testing login for cardio3@health.edu...');
        const res = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'cardio3@health.edu',
                password: 'password123'
            })
        });

        if (res.ok) {
            const data = await res.json();
            console.log('✅ Login SUCCESS!');
            console.log('Token:', data.token ? 'Present' : 'Missing');
            console.log('Role:', data.role);
        } else {
            console.log('❌ Login FAILED');
            console.log('Status:', res.status);
            console.log('Response:', await res.text());
        }
    } catch (err) {
        console.error('Error:', err);
    }
})();
