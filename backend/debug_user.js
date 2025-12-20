const db = require('./db');

(async () => {
    try {
        console.log('--- Checking Appointment 1 Owner ---');
        const appt = await db.query("SELECT patient_id FROM Appointments WHERE id = 1");
        if (appt.rows.length === 0) { console.log('Appt 1 not found'); process.exit(); }

        const pid = appt.rows[0].patient_id;
        console.log('Patient ID:', pid);

        const user = await db.query("SELECT id, email, password_hash FROM Users WHERE id = $1", [pid]);
        console.log('User:', user.rows[0]);

    } catch (err) {
        console.error(err);
    }
    process.exit();
})();
