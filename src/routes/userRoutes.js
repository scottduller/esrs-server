const express = require('express');

const requireLogin = require('../middleware/requireLogin');

const {
  getUsers, getUserById,
} = require('../controllers/userController');

const router = express.Router();

router.get('/', requireLogin, getUsers);

router
  .route('/:id')
  .get(requireLogin, getUserById);

module.exports = router;
