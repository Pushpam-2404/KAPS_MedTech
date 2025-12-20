const db = require('./db');

(async () => {
    try {
        console.log('--- Checking Completed Appointments ---');
        const appts = await db.query("SELECT * FROM Appointments WHERE status = 'Completed'");
        console.log(`Found ${appts.rows.length} completed appointments`);

        if (appts.rows.length > 0) {
            console.log('Sample Appt ID:', appts.rows[0].id);
            const record = await db.query('SELECT * FROM MedicalRecords WHERE appointment_id = $1', [appts.rows[0].id]);
            console.log('Medical Record for Sample:', record.rows[0] || 'NONE FOUND');
        }

    } catch (err) {
        console.error(err);
    }
    process.exit();
})();
