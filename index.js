const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('./config/passport');
const { connectDB, resetDB } = require('./config/db');

// require('dotenv').config({ path: './config/config.env' });

require('./models/Level');
require('./models/User');
require('./models/Playlist');

const app = express();

console.log(process.env.EXPRESS_SECRET);
console.log(process.env.DEV_MONGO_URI);
console.log(process.env.TEST_MONGO_URI);
console.log(process.env.PROD_MONGO_URI);

switch (process.env.NODE_ENV) {
  case 'development':
    app.use(morgan('dev'));
    connectDB();
    break;
  case 'test':
    app.use(morgan('dev'));
    resetDB();
    break;
  case 'production':
    app.use(
      morgan('tiny', {
        skip(req, res) {
          return res.statusCode < 400;
        },
      }),
    );
    connectDB();
    break;
  default:
    throw new Error('Node environment invalid');
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.EXPRESS_SECRET,
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
