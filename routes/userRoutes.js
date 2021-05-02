const express = require('express');
const User = require('../models/User');
const requireLogin = require('../middleware/requireLogin');

const router = express.Router();

router.get('/', requireLogin, async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, payload: users });
  } catch (err) {
    next({ success: false, message: err.message });
  }
});

router.get('/:id', requireLogin, async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    res.status(200).json({ success: true, payload: user });
  } catch (err) {
    next({ success: false, message: err.message });
  }
});

router.put('/:id', requireLogin, async (req, res, next) => {
  const { username, name, favourites } = req.body;
  try {
    const user = await User.findOne({ _id: req.params.id });

    user.username = username;
    user.name = name;
    user.favourites = favourites;

    await user.save();
    res.status(200).json({ success: true, message: 'User updated', payload: user });
  } catch (err) {
    next({ success: false, message: err.message });
  }
});

router.delete('/:id', requireLogin, async (req, res, next) => {
  try {
    const user = await User.delete({ _id: req.params.id });
    res.status(200).json({ success: true, message: 'User deleted', payload: user });
  } catch (err) {
    next({ success: false, message: err.message });
  }
});

module.exports = router;
