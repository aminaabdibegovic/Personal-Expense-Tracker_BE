const express = require('express');
const router = express.Router();
require('dotenv').config();
const { registerUser } = require('../controllers/authController');

router.post('/', async (req, res) => {
  const { email, username, password } = req.body;
  try {
    await registerUser(email, username, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Register unsuccessfully' + err.message });
  }
});

module.exports = router;
