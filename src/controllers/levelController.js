/* eslint-disable no-underscore-dangle */
const asyncHandler = require('express-async-handler');

const Level = require('../models/Level');

const getUsersLevels = asyncHandler(async (req, res) => {
  const levels = await Level.find({ user: req.user.id });
  res.json(levels);
});

const getLevels = asyncHandler(async (req, res) => {
  const levels = await Level.find({});
  res.json(levels);
});

const createLevel = asyncHandler(async (req, res) => {
  const level = new Level({
    name: req.body.name,
    description: req.body.description,
    votes: req.body.votes,
    levelData: req.body.levelData,
    user: req.user.id,
  });

  const createdLevel = await level.save();
  res.status(201).json(createdLevel);
});

const getLevelById = asyncHandler(async (req, res) => {
  const level = await Level.findById(req.params.id);

  if (level) {
    res.json(level);
  } else {
    res.status(404);
    throw new Error('Level not found');
  }
});

const updateLevel = asyncHandler(async (req, res) => {
  const level = await Level.findById(req.params.id);

  if (Level) {
    level.name = req.body.name || level.name;
    level.description = req.body.description || level.description;
    level.votes = req.body.votes || level.votes;
    level.levelData = req.body.levelData || level.levelData;

    const updatedLevel = await level.save();

    res.json({
      _id: updatedLevel._id,
      name: updatedLevel.name,
      description: updatedLevel.description,
      votes: updatedLevel.votes,
      levelData: updatedLevel.levelData,
    });
  } else {
    res.status(404);
    throw new Error('Level not found');
  }
});

const deleteLevel = asyncHandler(async (req, res) => {
  const level = await Level.findById(req.params.id);

  if (level) {
    await level.delete();
    res.json({ message: 'Level removed' });
  } else {
    res.status(404);
    throw new Error('Level not found');
  }
});

module.exports = {
  getUsersLevels, getLevels, createLevel, getLevelById, updateLevel, deleteLevel,
};
