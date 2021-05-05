const express = require('express');

const requireLogin = require('../middleware/requireLogin');

const {
  getUsersPlaylists, getPlaylists, createPlaylist, getPlaylistById, updatePlaylist, deletePlaylist,
} = require('../controllers/playlistController');

const router = express.Router();

router.get('/user', requireLogin, getUsersPlaylists);

router
  .route('/')
  .get(requireLogin, getPlaylists)
  .post(requireLogin, createPlaylist);

router
  .route('/:id')
  .get(requireLogin, getPlaylistById)
  .put(requireLogin, updatePlaylist)
  .delete(requireLogin, deletePlaylist);

module.exports = router;
