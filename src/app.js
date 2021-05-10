require('dotenv').config({ path: './src/config/config.env' });

const express = require('express');
const session = require('cookie-session');
const morgan = require('morgan');

const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const levelRoutes = require('./routes/levelRoutes');
const playlistRoutes = require('./routes/playlistRoutes');

const createServer = () => {
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

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(session({
    secret: process.env.EXPRESS_SECRET,
    resave: false,
    saveUninitialized: true,
  }));

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/levels', levelRoutes);
  app.use('/api/playlists', playlistRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

module.exports = createServer;
