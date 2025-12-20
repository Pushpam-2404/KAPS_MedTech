const bcrypt = require('bcrypt');
const db = require('./db');

(async () => {
    try {
        const password = 'password123';
        const targetHash = '$2b$10$p.0XnjLjKr5r2Pm4omUWn.IK/7yK5Y0euoC8FvYSnBS7WpWOfnYq.';

        console.log('--- HASH VERIFICATION ---');
        const match = await bcrypt.compare(password, targetHash);
        console.log(`Does 'password123' match targetHash? ${match}`);

        console.log('\n--- DB VERIFICATION ---');
        const res = await db.query("SELECT email, password_hash FROM Users WHERE email = 'cardio3@health.edu'");
        if (res.rows.length === 0) {
            console.log('User not found!');
        } else {
            const row = res.rows[0];
            console.log(`Stored Hash in DB: [${row.password_hash}]`);
            console.log(`Is Stored Hash === Target Hash? ${row.password_hash === targetHash}`);

            const dbMatch = await bcrypt.compare(password, row.password_hash);
            console.log(`Does 'password123' match Stored Hash? ${dbMatch}`);
        }
    } catch (err) {
        console.error(err);
    }
    process.exit();
})();
