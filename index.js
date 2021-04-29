const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('./config/passport');
const connectDB = require('./config/db');

require('dotenv').config({ path: './config/config.env' });

require('./models/Level');
require('./models/User');
require('./models/Playlist');

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

if (process.env.NODE_ENV === 'production') {
  app.use(
    morgan('tiny', {
      skip(req, res) {
        return res.statusCode < 400;
      },
    }),
  );
}

app.use(session({
  secret: process.env.EXPRESS_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/levels', require('./routes/levelRoutes'));
app.use('/api/playlists', require('./routes/playlistRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SUCCESS ... Listening on port ${PORT}`);
});
