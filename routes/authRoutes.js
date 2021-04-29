const express = require('express');
const passport = require('passport');

const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  const {
    username, password, name, favourites,
  } = req.body;

  if (!username || !name || !favourites || !password) {
    res.status(422).json({ success: false, message: 'Username, name, favourites and password are required' });
  }

  try {
    const user = await User.findOne({ username });

    if (user) {
      res.status(409).json({ success: false, message: 'User already exists with this username' });
    }

    await User.register({ username, name, favourites }, password);
    res.status(201).json({ success: true, message: 'User registered' });
  } catch (err) {
    next({ success: false, message: err.message });
  }
});

router.post('/login', passport.authenticate('local', (req, res, err) => {
  if (err) {
    res.status(500).json({ success: false, message: err.message });
  } else {
    res.status(200).json({ success: true, message: 'User logged in' });
  }
}));

router.get('/logout', async (req, res, next) => {
  try {
    await req.logout();
    res.status(200).json({ success: true, message: 'User logged out' });
  } catch (err) {
    next({ success: false, message: err.message });
  }
});

module.exports = router;
