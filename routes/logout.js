const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.clearCookie('token');
    return res.status(201).json('Logging out successfuly');
  } catch (err) {
    return res.status(401).json('Logging out unsuccessfuly' + err.message);
  }
});

module.exports = router;
