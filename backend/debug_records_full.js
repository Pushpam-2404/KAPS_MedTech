const db = require('./db');

(async () => {
    try {
        console.log('--- Checking ALL Appointments ---');
        const appts = await db.query("SELECT id, status, appointment_date FROM Appointments");
        console.log(appts.rows);

        console.log('--- Checking ALL Medical Records ---');
        const records = await db.query("SELECT id, appointment_id, diagnosis FROM MedicalRecords");
        console.log(records.rows);

    } catch (err) {
        console.error(err);
    }
    process.exit();
})();
