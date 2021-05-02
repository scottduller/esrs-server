const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('./config/passport');

// const connectDB = require('./config/db');

require('./models/Level');
require('./models/User');
require('./models/Playlist');

const app = express();

switch (process.env.NODE_ENV) {
  case 'development':
  case 'test':
    app.use(morgan('dev'));
    break;
  case 'production':
    app.use(
      morgan('tiny', {
        skip(req, res) {
          return res.statusCode < 400;
        },
      }),
    );
    break;
  default:
    throw new Error('Node environment invalid');
}

if (!process.env.DEV_MONGO_URI) {
  console.log('DEV_MONGO_URI');
  process.exit(1);
}
if (!process.env.TEST_MONGO_URI) {
  console.log('TEST_MONGO_URI');
  process.exit(1);
}
if (!process.env.PROD_MONGO_URI) {
  console.log('PROD_MONGO_URI');
  process.exit(1);
}
if (!process.env.EXPRESS_SECRET) {
  console.log('EXPRESS_SECRET');
  process.exit(1);
}

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

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const secretStr = process.env.EXPRESS_SECRET;

app.use(session({
  secret: secretStr.toString(),
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/levels', require('./routes/levelRoutes'));
app.use('/api/playlists', require('./routes/playlistRoutes'));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`SUCCESS ... Listening on port ${PORT}`);
});

module.exports = server;
