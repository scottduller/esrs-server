/* eslint-disable no-underscore-dangle */
const request = require('supertest');
const createServer = require('../app');
const Playlist = require('../models/Playlist');
const Level = require('../models/Level');
const setupDB = require('./setup');

describe('Playlist endpoints', () => {
  let jwt1;
  let user1;
  let jwt2;
  let user2;

  const app = createServer();

  setupDB();

  beforeEach(async () => {
    let res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'username1',
        password: 'password1',
        name: 'name1',
      });

    user1 = res.body;

    res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'username2',
        password: 'password2',
        name: 'name2',
      });

    user2 = res.body;

    res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'username1',
        password: 'password1',
      });
    jwt1 = `Bearer ${res.body.token}`;

    res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'username2',
        password: 'password2',
      });
    jwt2 = `Bearer ${res.body.token}`;
  });

  it('should get the logged in users playlists', async () => {
    const playlist1 = await Playlist.create({
      name: 'playlist',
      levels: [],
      user: user1._id,
    });

    const playlist2 = await Playlist.create({
      name: 'playlist',
      levels: [],
      user: user2._id,
    });

    let res = await request(app)
      .get('/api/playlists/user')
      .set('Authorization', jwt1);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);

    expect(res.body[0]._id).toBe(playlist1.id);
    expect(res.body[0].name).toBe(playlist1.name);
    expect(res.body[0].levels.length).toEqual(0);
    expect(String(res.body[0].user)).toBe(String(playlist1.user));

    res = await request(app)
      .get('/api/playlists/user')
      .set('Authorization', jwt2);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);

    expect(res.body[0]._id).toBe(playlist2.id);
    expect(res.body[0].name).toBe(playlist2.name);
    expect(res.body[0].levels.length).toEqual(0);
    expect(String(res.body[0].user)).toBe(String(playlist2.user));
  });

  it('should get all playlists', async () => {
    const playlist = await Playlist.create({
      name: 'playlist',
      levels: [],
      user: user1._id,
    });

    const res = await request(app)
      .get('/api/playlists/')
      .set('Authorization', jwt1);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);

    expect(res.body[0]._id).toBe(playlist.id);
    expect(res.body[0].name).toBe(playlist.name);
    expect(res.body[0].levels.length).toEqual(0);
  });

  it('should create a playlist', async () => {
    const playlist = {
      name: 'playlist',
      levels: [],
    };

    const res = await request(app)
      .post('/api/playlists/')
      .send({
        name: 'playlist',
        levels: [],
      })
      .set('Authorization', jwt1);
    expect(res.status).toBe(201);

    expect(res.body.name).toBe(playlist.name);
    expect(res.body.levels.length).toEqual(0);
  });

  it('should get a playlist by id', async () => {
    const playlist = {
      name: 'playlist',
      levels: [],
    };

    let res = await request(app)
      .post('/api/playlists/')
      .send({
        name: 'playlist',
        levels: [],
      })
      .set('Authorization', jwt1);

    res = await request(app)
      .get(`/api/playlists/${res.body._id}`)
      .set('Authorization', jwt1);

    expect(res.status).toBe(200);

    expect(res.body.name).toBe(playlist.name);
    expect(res.body.levels.length).toEqual(0);
  });

  it('should update a playlist', async () => {
    const level = await Level.create({
      name: 'name',
      description: 'description',
      votes: 0,
      levelData: 'data',
      user: user1._id,
    });

    const playlistUpdated = {
      name: 'playlist1',
      levels: [level],
    };

    let res = await request(app)
      .post('/api/playlists/')
      .send({
        name: 'playlist',
        levels: [level],
      })
      .set('Authorization', jwt1);

    res = await request(app)
      .put(`/api/playlists/${res.body._id}`)
      .set('Authorization', jwt1)
      .send({
        name: 'playlist1',
        description: 'description1',
        votes: 1,
        playlistData: 'playlistData1',
      });

    expect(res.status).toBe(200);

    expect(res.body.name).toBe(playlistUpdated.name);
    expect(res.body.levels.length).toEqual(1);
    expect(String(res.body.levels[0])).toBe(String(level._id));
  });

  it('should delete a playlist', async () => {
    let res = await request(app)
      .post('/api/playlists/')
      .send({
        name: 'playlist',
        levels: [],
      })
      .set('Authorization', jwt1);

    res = await request(app)
      .delete(`/api/playlists/${res.body._id}`)
      .set('Authorization', jwt1);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Playlist removed');
  });
});
