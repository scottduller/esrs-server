const createServer = require('./src/app.js');
const db = require('./src/config/db');

db.connect();

const PORT = process.env.PORT || 5000;

const server = createServer().listen(PORT, () => {
  const host = server.address().address;
  const { port } = server.address();
  console.log('App listening at http://%s:%s', host, port);
});

// fdsdas
