/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const mongoose = require('mongoose');

const getUri = () => {
  let uri;
  switch (process.env.NODE_ENV) {
    case 'development':
      uri = process.env.DEV_MONGO_URI;
      break;
    case 'test':
      uri = process.env.TEST_MONGO_URI;
      break;
    case 'production':
      uri = process.env.PROD_MONGO_URI;
      break;
    default:
      throw new Error('Node environment invalid');
  }
  return uri;
};

module.exports.connect = async () => {
  const uri = getUri();
  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  };
  await mongoose.connect(uri, mongooseOptions);
};

module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

module.exports.clearDatabase = async () => {
  const { collections } = mongoose.connection;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

// const connectDB = async () => {
//   try {
//     const uri = getUri();

//     const conn = await mongoose.connect(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//     });

//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (err) {
//     console.log(err);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
