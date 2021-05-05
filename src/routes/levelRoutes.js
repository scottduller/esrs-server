const express = require('express');

const requireLogin = require('../middleware/requireLogin');

const {
  getUsersLevels, getLevels, createLevel, getLevelById, updateLevel, deleteLevel,
} = require('../controllers/levelController');

const router = express.Router();

router.get('/user', requireLogin, getUsersLevels);

router
  .route('/')
  .get(requireLogin, getLevels)
  .post(requireLogin, createLevel);

router
  .route('/:id')
  .get(requireLogin, getLevelById)
  .put(requireLogin, updateLevel)
  .delete(requireLogin, deleteLevel);

module.exports = router;
