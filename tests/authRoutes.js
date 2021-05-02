const request = require('supertest');
const app = require('..');
const User = require('../models/User');
const Level = require('../models/Level');
const Playlist = require('../models/Playlist');

describe('Auth endpoints', () => {
  beforeAll(async () => {
    await User.deleteMany({});
    await Level.deleteMany({});
    await Playlist.deleteMany({});
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'username',
        password: 'password',
        name: 'name',
        favourites: [],
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toEqual(true);
    expect(res.body.message).toEqual('User registered');
  });

  it('should login a user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'username',
        password: 'password',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.message).toEqual('User logged in');
  });

  it('should logout a user', async () => {
    const res = await request(app).get('/api/auth/logout');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.message).toEqual('User logged out');
  });
});
