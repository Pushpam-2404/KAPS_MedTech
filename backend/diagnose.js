// backend/diagnose.js
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// 1. Locate the .env file
const envPath = path.join(__dirname, '.env');
console.log(`\n🔍 Looking for .env at: ${envPath}`);

if (!fs.existsSync(envPath)) {
    console.error('❌ FATAL: .env file NOT FOUND at ' + envPath);
    console.error('   -> Make sure the file is named ".env" (not .env.txt) and is inside the "backend" folder.');
    process.exit(1);
}

// 2. Read file content manually (Bypassing dotenv parser to see what's really there)
const envContent = fs.readFileSync(envPath, 'utf8');
console.log('✅ Found .env file.');

// Check for the "Source" text that breaks things
if (envContent.includes('".')) {
    console.error('   -> Open backend/.env and DELETE everything. Paste ONLY the variables.');
    process.exit(1);
}

// 3. Load Variables
require('dotenv').config({ path: envPath });

console.log('------------ CONFIG CHECK ------------');
console.log(`PORT:         ${process.env.PORT || 'UNDEFINED (Will default to 3000)'}`);
console.log(`JWT_SECRET:   ${process.env.JWT_SECRET ? '✅ LOADED' : '❌ MISSING'}`);
console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? '✅ LOADED' : '❌ MISSING'}`);
console.log('--------------------------------------');

if (!process.env.DATABASE_URL) {
    console.error('❌ FATAL: DATABASE_URL is missing. The server cannot start.');
    process.exit(1);
}

// 4. Test Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

(async () => {
    try {
        console.log('🔌 Attempting to connect to NeonDB...');
        const res = await pool.query('SELECT NOW() as time, current_database() as db');
        console.log('✅ SUCCESS! Database Connected.');
        console.log(`   -> Time: ${res.rows[0].time}`);
        console.log(`   -> DB:   ${res.rows[0].db}`);

        // 5. Test Schema
        console.log('🔎 Checking Users Table...');
        const tableCheck = await pool.query("SELECT count(*) FROM users");
        console.log(`✅ Table "Users" exists and has ${tableCheck.rows[0].count} rows.`);
        console.log('\n🚀 DIAGNOSIS COMPLETE: You are ready to start the server.');
        process.exit(0);

    } catch (err) {
        console.error('\n❌ CONNECTION FAILED:');
        console.error(err.message);
        if (err.message.includes('password')) {
            console.error('   -> HINT: Your password in .env is WRONG. Reset it in Neon console.');
        } else if (err.message.includes('relation "users" does not exist')) {
            console.error('   -> HINT: Database connected, but tables are missing. Run schema.sql!');
        }
        process.exit(1);
    }
})();