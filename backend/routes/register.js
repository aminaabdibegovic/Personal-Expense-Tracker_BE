const express = require('express');
const router = express.Router();
require('dotenv').config();
const { registerUser} = require('../controllers/authController'); 

router.post('/', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await registerUser(username, email, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
   res.status(400).json({ message: 'Register unsuccessfully' });
}
});

module.exports = router;
