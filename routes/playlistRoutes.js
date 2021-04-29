const express = require('express');
const Playlist = require('../models/Playlist');
const requireLogin = require('../middleware/requireLogin');

const router = express.Router();

router.get('/', requireLogin, async (req, res, next) => {
  try {
    const playlists = await Playlist.find({ user: req.user.id });
    res.status(200).json({ success: true, payload: playlists });
  } catch (err) {
    next({ success: false, message: err.message });
  }
});

router.get('/:id', requireLogin, async (req, res, next) => {
  try {
    const playlist = await Playlist.find({ user: req.user.id, _id: req.params.id });
    res.status(200).json({ success: true, payload: playlist });
  } catch (err) {
    next({ success: false, message: err.message });
  }
});

router.post('/', requireLogin, async (req, res, next) => {
  const { name, levels } = req.body;

  try {
    const playlist = new Playlist({
      name,
      levels,
      user: req.user.id,
    });

    await playlist.save();
    res.status(200).json({ success: true, payload: playlist });
  } catch (err) {
    next({ success: false, message: err.message });
  }
});

router.put('/:id', requireLogin, async (req, res, next) => {
  const { name, levels } = req.body;

  try {
    const playlist = await Playlist.findOne({
      user: req.user.id,
      _id: req.params.id,
    });

    playlist.name = name;
    playlist.levels = levels;

    await playlist.save();
    res.status(200).json({ success: true, message: 'Playlist updated', payload: playlist });
  } catch (err) {
    next({ success: false, message: err.message });
  }
});

router.delete('/:id', requireLogin, async (req, res, next) => {
  try {
    const playlist = await Playlist.deleteOne({
      _id: req.params.id,
      user: req.user.id,
    });
    res.status(200).json({ success: true, message: 'Playlist deleted', payload: playlist });
  } catch (err) {
    next({ success: false, message: err.message });
  }
});

module.exports = router;
