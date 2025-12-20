const db = require('./db');
const bcrypt = require('bcrypt');

(async () => {
    try {
        const hash = await bcrypt.hash('password123', 10);
        await db.query("UPDATE Users SET password_hash = $1 WHERE email = 'prsatyarthi2404@gmail.com'", [hash]);
        console.log('Password updated for prsatyarthi2404@gmail.com');
    } catch (err) {
        console.error(err);
    }
    process.exit();
})();
