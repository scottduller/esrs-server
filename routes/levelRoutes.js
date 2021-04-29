const express = require('express');
const Level = require('../models/Level');
const requireLogin = require('../middleware/requireLogin');

const router = express.Router();

router.get('/', requireLogin, async (req, res, next) => {
  try {
    const levels = await Level.find({});
    res.status(200).json({ success: true, payload: levels });
  } catch (err) {
    next({ success: false, message: err.message });
  }
});

router.get('/:id', requireLogin, async (req, res, next) => {
  try {
    const level = await Level.find({ _id: req.params.id });
    res.status(200).json({ success: true, payload: level });
  } catch (err) {
    next({ success: false, message: err.message });
  }
});

router.get('/user', requireLogin, async (req, res, next) => {
  try {
    const levels = await Level.find({ user: req.user.id });
    res.status(200).json({ success: true, payload: levels });
  } catch (err) {
    next({ success: false, message: err.message });
  }
});

router.get('/user/:id', requireLogin, async (req, res, next) => {
  try {
    const level = await Level.find({ user: req.user.id, _id: req.params.id });
    res.status(200).json({ success: true, payload: level });
  } catch (err) {
    next({ success: false, message: err.message });
  }
});

router.post('/', requireLogin, async (req, res, next) => {
  const {
    name,
    description,
    votes,
    favourites,
    levelData,
  } = req.body;

  try {
    const level = new Level({
      name,
      description,
      votes,
      favourites,
      levelData,
      user: req.user.id,
    });

    await level.save();
    res.status(200).json({ success: true, payload: level });
  } catch (err) {
    next({ success: false, message: err.message });
  }
});

router.put('/:id', requireLogin, async (req, res, next) => {
  const {
    name,
    description,
    votes,
    favourites,
    levelData,
  } = req.body;

  try {
    const level = await Level.findOne({
      user: req.user.id,
      _id: req.params.id,
    });

    level.name = name;
    level.description = description;
    level.votes = votes;
    level.favourites = favourites;
    level.levelData = levelData;

    await level.save();
    res.status(200).json({ success: true, message: 'Level updated', payload: level });
  } catch (err) {
    next({ success: false, message: err.message });
  }
});

router.delete('/:id', requireLogin, async (req, res, next) => {
  try {
    const level = await Level.deleteOne({
      _id: req.params.id,
      user: req.user.id,
    });
    res.status(200).json({ success: true, message: 'Level deleted', payload: level });
  } catch (err) {
    next({ success: false, message: err.message });
  }
});

module.exports = router;
