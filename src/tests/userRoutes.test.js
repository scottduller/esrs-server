/* eslint-disable no-underscore-dangle */
const request = require('supertest');
const createServer = require('../app');
const setupDB = require('./setup');

describe('User endpoints', () => {
  let cookie1;
  let user1;
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
    cookie1 = res.headers['set-cookie'];
  });

  it('should get all users', async () => {
    const res = await request(app)
      .get('/api/users/')
      .set('cookie', cookie1);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(2);

    expect(String(res.body[0]._id)).toBe(user1._id);
    expect(res.body[0].username).toBe(user1.username);
    expect(res.body[0].name).toBe(user1.name);

    expect(String(res.body[1]._id)).toBe(user2._id);
    expect(res.body[1].username).toBe(user2.username);
    expect(res.body[1].name).toBe(user2.name);
  });

  it('should get a user by id', async () => {
    const res = await request(app)
      .get(`/api/users/${user1._id}`)
      .set('cookie', cookie1);

    expect(res.status).toBe(200);

    expect(String(res.body._id)).toBe(user1._id);
    expect(res.body.username).toBe(user1.username);
    expect(res.body.name).toBe(user1.name);
  });
});
