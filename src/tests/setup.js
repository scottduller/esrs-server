/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
// const { MongoMemoryServer } = require('mongodb-memory-server');

// const mongod = new MongoMemoryServer();

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }

  jest.useFakeTimers();
}

async function dropAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    try {
      await collection.drop();
    } catch (error) {
      if (error.message === 'ns not found') return;
      if (error.message.includes('a background operation is currently running')) return;
      console.log(error.message);
    }
  }
}

module.exports = function setupDB() {
  beforeAll(async () => {
    const mongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    };
    // const uri = await mongod.getUri();
    await mongoose.connect(process.env.TEST_MONGO_URI, mongooseOptions);
  });

  afterEach(async () => {
    await removeAllCollections();
  });

  afterAll(async () => {
    await dropAllCollections();
    await mongoose.connection.close();
  });
};
