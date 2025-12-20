const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    const { name, email, password, role, identifier, phone, department, specialty } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // Check Email
        const check = await client.query('SELECT id FROM Users WHERE email = $1', [email]);
        if (check.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert User
        const userRes = await client.query(
            'INSERT INTO Users (name, email, password_hash, role, identifier, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, role, name',
            [name, email, hashedPassword, role, identifier, phone]
        );
        const user = userRes.rows[0];

        // If Doctor, insert into Doctors table
        if (role === 'doctor') {
            if (!department) {
                await client.query('ROLLBACK');
                return res.status(400).json({ error: 'Doctor requires department' });
            }
            await client.query(
                'INSERT INTO Doctors (user_id, department, specialty) VALUES ($1, $2, $3)',
                [user.id, department, specialty]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: err.message, code: err.code });
    } finally {
        client.release();
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await db.query('SELECT * FROM Users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        res.json({ token, role: user.role, name: user.name, id: user.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message, code: err.code });
    }
});

module.exports = router;
