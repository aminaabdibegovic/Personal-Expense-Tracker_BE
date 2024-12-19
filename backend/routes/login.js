const express = require('express');
const router = express.Router();
require('dotenv').config();
const {loginUser} = require('../controllers/authController'); 


router.post('/', async(req,res) =>{
    const { username, password } = req.body;
    try {
      const token = await loginUser(username, password);
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 3600000,
      });
      return res.json({ message: 'Login successful', token }); 
    } catch (err) {
      return res.status(400).json({ message: 'Error logging in', error: err.message });
    }
  });

module.exports = router;
