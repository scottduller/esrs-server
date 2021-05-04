/* eslint-disable no-underscore-dangle */
const request = require('supertest');
const createServer = require('../app');
const db = require('../config/mockDb');

describe('Auth endpoints', () => {
  const app = createServer();

  beforeAll(async () => { await db.connect(); });

  afterEach(async () => { await db.clearDatabase(); });

  afterAll(async () => { await db.closeDatabase(); });

  it('should register a new user', async () => {
    const user = {
      username: 'username',
      password: 'password',
      name: 'name',
    };

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'username',
        password: 'password',
        name: 'name',
      });

    expect(res.status).toBe(201);
    expect(res.body.username).toBe(user.username);
    expect(res.body.name).toBe(user.name);
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
    expect(res.body.name).toBe(user.name);
  });

  it('should logout a user', async () => {
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

    const cookie = res.headers['set-cookie'];

    res = await request(app)
      .get('/api/auth/logout')
      .set('cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User logged out');
  });
});
