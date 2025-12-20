const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Create the connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for NeonDB/AWS RDS
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
};