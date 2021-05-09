/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
const request = require('supertest');
const createServer = require('../app');
const setupDB = require('./setup');

describe('Auth endpoints', () => {
  const app = createServer();

  setupDB();

  it('should register a new user', async () => {
    const user = {
      username: 'username',
      password: 'password',
    };

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'username',
        password: 'password',
      });

    expect(res.status).toBe(201);
    expect(res.body.username).toBe(user.username);
  });

  it('should login a user', async () => {
    const user = {
      username: 'username',
      password: 'password',
      name: 'name',
    };

    let res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'username',
        password: 'password',
        name: 'name',
      });

    res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'username',
        password: 'password',
      });

    expect(res.status).toBe(200);
    expect(res.body.username).toBe(user.username);
  });
});
