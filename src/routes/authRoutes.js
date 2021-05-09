const express = require('express');

const requireLogin = require('../middleware/requireLogin');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/logout', requireLogin, logoutUser);

module.exports = router;
