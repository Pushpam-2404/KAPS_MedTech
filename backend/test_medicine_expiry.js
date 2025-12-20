const db = require('./db');

// Native fetch is available in Node 21+


(async () => {
    try {
        console.log('--- Setting up Test Data for Medicine Expiry ---');
        const client = await db.pool.connect();

        try {
            await client.query('BEGIN');

            // 1. Create Patient or Get Existing
            let patientId;
            const patCheck = await client.query("SELECT id FROM Users WHERE email = 'pat_expiry@test.com'");
            if (patCheck.rows.length > 0) {
                patientId = patCheck.rows[0].id;
            } else {
                const patRes = await client.query(`
                    INSERT INTO Users (name, email, password_hash, role) 
                    VALUES ('Test Patient', 'pat_expiry@test.com', 'hash', 'student') 
                    RETURNING id`
                );
                patientId = patRes.rows[0].id;
            }

            // 2. Create Doctor or Get Existing
            let doctorId;
            let docUserId;
            const docCheck = await client.query("SELECT id FROM Users WHERE email = 'doc_expiry@test.com'");
            if (docCheck.rows.length > 0) {
                docUserId = docCheck.rows[0].id;
                const d = await client.query("SELECT id FROM Doctors WHERE user_id = $1", [docUserId]);
                doctorId = d.rows[0].id; // assume exists
            } else {
                const docRes = await client.query(`
                    INSERT INTO Users (name, email, password_hash, role) 
                    VALUES ('Test Doctor', 'doc_expiry@test.com', 'hash', 'doctor') 
                    RETURNING id`
                );
                docUserId = docRes.rows[0].id;
                const docDetails = await client.query(`
                    INSERT INTO Doctors (user_id, department, specialty) 
                    VALUES ($1, 'General', 'Gen') RETURNING id`, [docUserId]
                );
                doctorId = docDetails.rows[0].id;
            }

            // 3. Create OLD Appointment (10 days ago)
            const oldDate = new Date();
            oldDate.setDate(oldDate.getDate() - 10);
            const apptOld = await client.query(`
                INSERT INTO Appointments (patient_id, doctor_id, appointment_date, appointment_time, status)
                VALUES ($1, $2, $3, '10:00', 'Completed') RETURNING id`,
                [patientId, doctorId, oldDate]
            );

            // 4. Create Medical Record for Old Appt
            const recOld = await client.query(`
                INSERT INTO MedicalRecords (appointment_id, diagnosis, advice)
                VALUES ($1, 'Fever', 'Rest') RETURNING id`,
                [apptOld.rows[0].id]
            );

            // 5. Prescribe Meds
            // Med A: Duration '5 days' (Should be EXPIRED: 10 days ago + 5 days = 5 days ago)
            await client.query(`
                INSERT INTO Prescriptions (record_id, medicine_name, dosage, frequency, duration)
                VALUES ($1, 'ExpiredMed', '1-1-1', 'Daily', '5 days')`,
                [recOld.rows[0].id]
            );
            // Med B: Duration '20 days' (Should be ACTIVE: 10 days ago + 20 days = 10 days future)
            await client.query(`
                INSERT INTO Prescriptions (record_id, medicine_name, dosage, frequency, duration)
                VALUES ($1, 'ActiveMed', '1-1-1', 'Daily', '20 days')`,
                [recOld.rows[0].id]
            );

            // 6. Create FUTURE Appointment (for Reminder check) -> Follow up date
            // Add follow up date to the record
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 5);
            await client.query(`
                UPDATE MedicalRecords SET follow_up_date = $1 WHERE id = $2`,
                [futureDate, recOld.rows[0].id]
            );

            await client.query('COMMIT');
            console.log('--- Test Data Created ---');

            // 7. Login as Patient
            console.log('Logging in...');
            const bcrypt = require('bcrypt');
            const newHash = await bcrypt.hash('password123', 10);

            await client.query("UPDATE Users SET password_hash = $1 WHERE id = $2", [newHash, patientId]);
            await client.query('COMMIT'); // Commit before login attempt

            const loginRes = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'pat_expiry@test.com', password: 'password123' })
            });
            if (!loginRes.ok) throw new Error('Login Failed: ' + await loginRes.text());
            const loginData = await loginRes.json();
            const token = loginData.token;
            console.log('Login successful, token:', token ? 'acquired' : 'missing');

            // 8. Check My Medicine
            console.log('Checking /my-medicine ...');
            const medRes = await fetch('http://localhost:3001/api/appointments/my-medicine', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const meds = await medRes.json();
            console.log('Medicines Returned:', meds.map(m => `${m.medicine_name} (${m.duration})`));

            const hasExpired = meds.some(m => m.medicine_name === 'ExpiredMed');
            const hasActive = meds.some(m => m.medicine_name === 'ActiveMed');

            if (!hasExpired && hasActive) {
                console.log('SUCCESS: ExpiredMed hidden, ActiveMed visible.');
            } else {
                console.log('FAILURE: Logic incorrect.');
                console.log('Has ExpiredMed?', hasExpired);
                console.log('Has ActiveMed?', hasActive);
            }

            // 9. Check Reminders
            console.log('Checking /reminders ...');
            const remRes = await fetch('http://localhost:3001/api/appointments/reminders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const rems = await remRes.json();
            console.log('Reminders Returned:', rems.length);
            if (rems.length > 0) {
                console.log('SUCCESS: Reminder found.');
            } else {
                console.log('FAILURE: Reminder not found.');
            }

        } catch (err) {
            await client.query('ROLLBACK');
            console.error(err);
        } finally {
            client.release();
        }

    } catch (err) {
        console.error(err);
    }
    process.exit();
})();
