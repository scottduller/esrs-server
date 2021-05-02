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

    if (uri.toString() === 'mongodb+srv://admin:Password321@esrs-db.qj0cl.mongodb.net/testdb?retryWrites=true&w=majority') process.exit(1);

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
