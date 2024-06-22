// routes/index.js
const express = require('express');
const router = express.Router();
const pool = require('../db/db'); // Ensure correct path
const { response } = require('../app');

// Example route
router.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/', (req, res) => {
  res.send('Hello, World!');
});
module.exports = router;
