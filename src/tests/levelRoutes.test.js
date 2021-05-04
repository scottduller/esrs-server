/* eslint-disable no-underscore-dangle */
const request = require('supertest');
const createServer = require('../app');
const db = require('../config/mockDb');
const Level = require('../models/Level');

describe('Level endpoints', () => {
  let cookie1;
  let user1;
  let cookie2;
  let user2;

  const app = createServer();

  beforeAll(async () => { await db.connect(); });

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

    res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'username2',
        password: 'password2',
      });
    cookie2 = res.headers['set-cookie'];
  });

  afterEach(async () => { await db.clearDatabase(); });

  afterAll(async () => { await db.closeDatabase(); });

  it('should get the logged in users levels', async () => {
    const level1 = await Level.create({
      name: 'name1',
      description: 'description1',
      votes: 0,
      levelData: 'data1',
      user: user1._id,
    });

    const level2 = await Level.create({
      name: 'name2',
      description: 'description2',
      votes: 0,
      levelData: 'data2',
      user: user2._id,
    });

    let res = await request(app)
      .get('/api/levels/user')
      .set('cookie', cookie1);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);

    expect(res.body[0]._id).toBe(level1.id);
    expect(res.body[0].name).toBe(level1.name);
    expect(res.body[0].votes).toBe(level1.votes);
    expect(res.body[0].levelData).toBe(level1.levelData);
    expect(String(res.body[0].user)).toBe(String(level1.user));

    res = await request(app)
      .get('/api/levels/user')
      .set('cookie', cookie2);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);

    expect(res.body[0]._id).toBe(level2.id);
    expect(res.body[0].name).toBe(level2.name);
    expect(res.body[0].votes).toBe(level2.votes);
    expect(res.body[0].levelData).toBe(level2.levelData);
    expect(String(res.body[0].user)).toBe(String(level2.user));
  });

  it('should get all levels', async () => {
    const level = await Level.create({
      name: 'name',
      description: 'description',
      votes: 0,
      levelData: 'data',
      user: user1._id,
    });

    const res = await request(app)
      .get('/api/levels/')
      .set('cookie', cookie1);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);

    expect(res.body[0]._id).toBe(level.id);
    expect(res.body[0].name).toBe(level.name);
    expect(res.body[0].description).toBe(level.description);
    expect(res.body[0].votes).toBe(level.votes);
    expect(res.body[0].levelData).toBe(level.levelData);
  });

  it('should create a level', async () => {
    const level = {
      name: 'level', description: 'description', votes: 0, levelData: 'levelData',
    };

    const res = await request(app)
      .post('/api/levels/')
      .send({
        name: 'level',
        description: 'description',
        levelData: 'levelData',
      })
      .set('cookie', cookie1);
    expect(res.status).toBe(201);

    expect(res.body.name).toBe(level.name);
    expect(res.body.description).toBe(level.description);
    expect(res.body.votes).toBe(level.votes);
    expect(res.body.levelData).toBe(level.levelData);
  });

  it('should get a level by id', async () => {
    const level = {
      name: 'level', description: 'description', votes: 0, levelData: 'levelData',
    };

    let res = await request(app)
      .post('/api/levels/')
      .send({
        name: 'level',
        description: 'description',
        levelData: 'levelData',
      })
      .set('cookie', cookie1);

    res = await request(app)
      .get(`/api/levels/${res.body._id}`)
      .set('cookie', cookie1);

    expect(res.status).toBe(200);

    expect(res.body.name).toBe(level.name);
    expect(res.body.description).toBe(level.description);
    expect(res.body.votes).toBe(level.votes);
    expect(res.body.levelData).toBe(level.levelData);
  });

  it('should update a level', async () => {
    const levelUpdated = {
      name: 'level1', description: 'description1', votes: 1, levelData: 'levelData1',
    };

    let res = await request(app)
      .post('/api/levels/')
      .send({
        name: 'level',
        description: 'description',
        levelData: 'levelData',
      })
      .set('cookie', cookie1);

    res = await request(app)
      .put(`/api/levels/${res.body._id}`)
      .set('cookie', cookie1)
      .send({
        name: 'level1',
        description: 'description1',
        votes: 1,
        levelData: 'levelData1',
      });

    expect(res.status).toBe(200);

    expect(res.body.name).toBe(levelUpdated.name);
    expect(res.body.description).toBe(levelUpdated.description);
    expect(res.body.votes).toBe(levelUpdated.votes);
    expect(res.body.levelData).toBe(levelUpdated.levelData);
  });

  it('should delete a level', async () => {
    let res = await request(app)
      .post('/api/levels/')
      .send({
        name: 'level',
        description: 'description',
        levelData: 'levelData',
      })
      .set('cookie', cookie1);

    res = await request(app)
      .delete(`/api/levels/${res.body._id}`)
      .set('cookie', cookie1);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Level removed');
  });
});
