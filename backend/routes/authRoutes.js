const express = require('express');
const router = express.Router();
const { register, login, verifyEmail } = require('../controllers/authController'); // ⬅️ include verifyEmail

router.post('/register', register);
router.post('/login', login);
router.get('/verify/:token', verifyEmail); // ⬅️ NEW: email verification route

module.exports = router;
