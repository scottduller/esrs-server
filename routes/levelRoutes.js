/* eslint-disable no-underscore-dangle */
/* eslint-disable no-prototype-builtins */
const express = require('express');
const Level = require('../models/Level');
const requireLogin = require('../middleware/requireLogin');

const router = express.Router();

router.get('/user', requireLogin, async (req, res, next) => {
  try {
    const levels = await Level.find({ user: req.user.id });
    res.status(200).json({ success: true, payload: levels });
  } catch (err) {
    next({ success: false, message: err.message });
  }
});

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
    const level = await Level.findById(req.params.id);
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
    favorites,
    levelData,
  } = req.body;

  try {
    const level = new Level({
      name,
      description,
      votes,
      favorites,
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
    favorites,
    levelData,
  } = req.body;

  try {
    const level = await Level.findById(req.params.id);

    if (level.user.toString() !== req.user.id) {
      res.status(401).json({ success: false, message: 'Not Authorised' });
    } else {
      level.name = name;
      level.description = description;
      level.votes = votes;
      level.favorites = favorites;
      level.levelData = levelData;

      await level.save();
      res.status(200).json({ success: true, message: 'Level updated', payload: level });
    }
  } catch (err) {
    next({ success: false, message: err.message });
  }
});

router.delete('/:id', requireLogin, async (req, res, next) => {
  try {
    const level = await Level.findById(req.params.id);

    if (level.user.toString() !== req.user.id) {
      res.status(401).json({ success: false, message: 'Not Authorised' });
    } else {
      await Level.findByIdAndRemove(req.params.id);
      res.status(200).json({ success: true, message: 'Level deleted', payload: level });
    }
  } catch (err) {
    next({ success: false, message: err.message });
  }
});

module.exports = router;
