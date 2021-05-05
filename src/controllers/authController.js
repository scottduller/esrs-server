/* eslint-disable no-underscore-dangle */
const asyncHandler = require('express-async-handler');

const User = require('../models/User');

const registerUser = asyncHandler(async (req, res) => {
  const {
    username, password, name,
  } = req.body;

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  if (!username || !name || !password) {
    res.status(422);
    throw new Error('Username, name and password are required');
  }

  const user = await User.register({ username, name }, password);

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      name: user.name,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  if (!req.user && !req.isAuthenticated()) {
    res.status(500);
    throw new Error('User not logged in');
  } else {
    res.json(req.user);
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  await req.logout();
  if (req.user && req.isAuthenticated()) {
    res.status(400);
    throw new Error('User not logged out');
  }
  res.json({ message: 'User logged out' });
});

module.exports = { registerUser, loginUser, logoutUser };
