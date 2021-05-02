/* eslint-disable no-underscore-dangle */
const request = require('supertest');
const app = require('..');
const Level = require('../models/Level');
const Playlist = require('../models/Playlist');
const User = require('../models/User');

let cookie;
let level;

describe('Level endpoints', () => {
  beforeAll(async () => {
    await User.deleteMany({});
    await Level.deleteMany({});
    await Playlist.deleteMany({});

    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'username',
        password: 'password',
        name: 'name',
        favourites: [],
      });

    const res1 = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'username',
        password: 'password',
      });
    cookie = res1.headers['set-cookie'];
  });

  it('should create a new level', async () => {
    const res = await request(app)
      .post('/api/levels/')
      .send({
        name: 'level',
        description: 'description',
        levelData: 'levelData',
      })
      .set('cookie', cookie);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);

    level = res.body.payload;
  });

  it('should get all levels', async () => {
    const res = await request(app)
      .get('/api/levels/')
      .set('cookie', cookie);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
  });

  it('should get a level by id', async () => {
    const res = await request(app)
      .get(`/api/levels/${level._id}`)
      .set('cookie', cookie);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.payload).toEqual(level);
  });

  it('should get all logged in users levels', async () => {
    const res = await request(app)
      .get('/api/levels/user')
      .set('cookie', cookie);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
  });

  it('should update a level by id', async () => {
    const res = await request(app)
      .put(`/api/levels/${level._id}`)
      .set('cookie', cookie)
      .send({
        name: 'updatedLevel',
        description: 'updatedDescription',
        votes: 2,
        favorites: 2,
        levelData: 'updatedLevelData',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.message).toEqual('Level updated');

    const { payload } = res.body;
    payload.updatedAt = '';
    level.name = 'updatedLevel';
    level.description = 'updatedDescription';
    level.votes = 2;
    level.favorites = 2;
    level.levelData = 'updatedLevelData';
    level.updatedAt = '';

    expect(payload).toEqual(level);
  });

  it('should delete a level by id', async () => {
    const res = await request(app)
      .delete(`/api/levels/${level._id}`)
      .set('cookie', cookie);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.message).toEqual('Level deleted');

    const { payload } = res.body;
    payload.updatedAt = '';

    expect(payload).toEqual(level);
  });
});
