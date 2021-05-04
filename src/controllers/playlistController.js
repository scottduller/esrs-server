/* eslint-disable no-underscore-dangle */
const asyncHandler = require('express-async-handler');

const Playlist = require('../models/Playlist');

const getUsersPlaylists = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find({ user: req.user.id });
  res.json(playlists);
});

const getPlaylists = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find({});
  res.json(playlists);
});

const createPlaylist = asyncHandler(async (req, res) => {
  const playlist = new Playlist({
    name: req.body.name,
    levels: req.body.levels,
    user: req.user.id,
  });

  const createdPlaylist = await playlist.save();
  res.status(201).json(createdPlaylist);
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (playlist) {
    res.json(playlist);
  } else {
    res.status(404);
    throw new Error('Playlist not found');
  }
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (Playlist) {
    playlist.name = req.body.name || playlist.name;
    playlist.levels = req.body.levels || playlist.levels;

    const updatedPlaylist = await playlist.save();

    res.json({
      _id: updatedPlaylist._id,
      name: updatedPlaylist.name,
      levels: updatedPlaylist.levels,
    });
  } else {
    res.status(404);
    throw new Error('Playlist not found');
  }
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (playlist) {
    await playlist.delete();
    res.json({ message: 'Playlist removed' });
  } else {
    res.status(404);
    throw new Error('Playlist not found');
  }
});

module.exports = {
  getUsersPlaylists, getPlaylists, createPlaylist, getPlaylistById, updatePlaylist, deletePlaylist,
};
