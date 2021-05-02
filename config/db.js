const mongoose = require('mongoose');

const connectDB = async () => {
  try {
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

    const conn = await mongoose.connect(uri.toString(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
