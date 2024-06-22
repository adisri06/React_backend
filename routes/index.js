// routes/index.js
const express = require('express');
const router = express.Router();
const pool = require('../db/db'); // Ensure correct path
const { response } = require('../app');

// Example route
router.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, email, surname, age, height, weight FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.get('/get_user_id/:username', async (req, res) => {
  try {
    console.log('hello', req.params)
    const { username } = req.params;
    const result = await pool.query('SELECT id FROM "users" WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/addusers', async (req, res) => {
  const { username, email, surname, age, height, weight, password } = req.body;
  console.log('details are', req.body)
  const query = `
    INSERT INTO "users" (username, email, surname, age, height, weight, password)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [username, email, surname, age, height, weight, password]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/check_credentials', async (req, res) => {
  const id = req.headers['id'];
  const password = req.headers['password'];
console.log('id', id , password)
  if (!id || !password) {
    return res.status(400).json({ message: 'Userid and password are required in headers' });
  }

  const query = 'SELECT * FROM "users" WHERE id = $1 AND password = $2';

  try {
    const result = await pool.query(query, [id, password]);
    console.log(query , result)
    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Success', user: result.rows[0] });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', (req, res) => {
  res.send('Hello, World!');
});
module.exports = router;
