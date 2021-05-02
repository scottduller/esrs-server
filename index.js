const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('./config/passport');
require('dotenv').config({ path: './config/config.env' });

const connectDB = require('./config/db');

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

connectDB();

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
  const host = server.address().address;
  const { port } = server.address();
  console.log('Example app listening at http://%s:%s', host, port);
});

module.exports = server;
