const app = require('./src/app.js');
const connectDB = require('./src/config/db');

connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  const host = server.address().address;
  const { port } = server.address();
  console.log('App listening at http://%s:%s', host, port);
});
