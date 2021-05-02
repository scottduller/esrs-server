/* eslint-disable no-underscore-dangle */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('..');
const Level = require('../models/Level');
const Playlist = require('../models/Playlist');
const User = require('../models/User');

let cookie;
let level;
let playlist;

describe('Playlist endpoints', () => {
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

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'username',
        password: 'password',
      });
    cookie = res.headers['set-cookie'];

    const res1 = await request(app)
      .post('/api/levels/')
      .send({
        name: 'level',
        description: 'description',
        levelData: 'levelData',
      })
      .set('cookie', cookie);
    level = res1.body.payload;
  });

  afterAll(async () => {
    app.close();
    mongoose.connection.close();
  });

  it('should create a new playlist', async () => {
    const res = await request(app)
      .post('/api/playlists/')
      .send({
        name: 'playlist',
        levels: [],
      })
      .set('cookie', cookie);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
  });

  it('should get all playlists', async () => {
    const res = await request(app)
      .get('/api/playlists/')
      .set('cookie', cookie);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);

    [playlist] = res.body.payload;
  });

  it('should get a playlist by id', async () => {
    const res = await request(app)
      .get(`/api/playlists/${playlist._id}`)
      .set('cookie', cookie);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.payload).toEqual(playlist);
  });

  it('should get all logged in users playlists', async () => {
    const res = await request(app)
      .get('/api/playlists/user')
      .set('cookie', cookie);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
  });

  it('should update a playlist by id', async () => {
    const res = await request(app)
      .put(`/api/playlists/${playlist._id}`)
      .set('cookie', cookie)
      .send({
        name: 'updatedPlaylist',
        levels: [level],
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.message).toEqual('Playlist updated');

    const { payload } = res.body;
    payload.updatedAt = '';
    payload.__v = 0;

    playlist.name = 'updatedPlaylist';
    playlist.levels = [level._id];
    playlist.updatedAt = '';

    expect(payload).toEqual(playlist);
  });

  it('should delete a playlist by id', async () => {
    const res = await request(app)
      .delete(`/api/playlists/${playlist._id}`)
      .set('cookie', cookie);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.message).toEqual('Playlist deleted');

    const { payload } = res.body;
    payload.updatedAt = '';
    payload.__v = 0;

    expect(payload).toEqual(playlist);
  });
});
