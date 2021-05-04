const express = require('express');

const requireLogin = require('../middleware/requireLogin');

const {
  getUsers, getUserById, updateUser, deleteUser,
} = require('../controllers/userController');

const router = express.Router();

router.get('/', requireLogin, getUsers);

router
  .route('/:id')
  .get(requireLogin, getUserById)
  .put(requireLogin, updateUser)
  .delete(requireLogin, deleteUser);

module.exports = router;
