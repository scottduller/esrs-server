/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies
const request = require('supertest');
const app = require('../app');
const Level = require('../models/Level');
const Playlist = require('../models/Playlist');
const User = require('../models/User');

let cookie;
let user;

describe('User endpoints', () => {
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
      });

    const res1 = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'username',
        password: 'password',
      });
    cookie = res1.headers['set-cookie'];
  });

  it('should get all users', async () => {
    const res = await request(app)
      .get('/api/users/')
      .set('cookie', cookie);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);

    [user] = res.body.payload;
  });

  it('should get a user by id', async () => {
    const res = await request(app)
      .get(`/api/users/${user._id}`)
      .set('cookie', cookie);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.payload).toEqual(user);
  });

  it('should update a user by id', async () => {
    const res = await request(app)
      .put(`/api/users/${user._id}`)
      .set('cookie', cookie)
      .send({ username: 'newUsername', name: 'newName' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.message).toEqual('User updated');

    const { payload } = res.body;
    payload.updatedAt = '';
    user.name = 'newName';
    user.username = 'newUsername';
    user.updatedAt = '';

    expect(payload).toEqual(user);
  });
});
