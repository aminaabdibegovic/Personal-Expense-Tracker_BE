/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
require('dotenv').config();
const { loginUser, getUsername } = require('../controllers/authController');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  try {
    const token = await loginUser(username, password);
    res.cookie('token', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 3600000,
    });
    return res.json({ message: 'Login successful', token });
  } catch (err) {
    return res.status(400).json({ message: 'Error logging in', error: err.message });
  }
});

router.get('/getUsername', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;
    const user = await getUsername(user_id);
    return res.status(201).json({ username: user.username, email: user.email });
  } catch (err) {
    return res.status(400).json({ message: 'Error getting username', error: err.message });
  }
});

module.exports = router;
