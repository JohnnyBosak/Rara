const express = require('express');
const server = express();
const path = require('path');

server.use(express.static('web'));

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

function keepAlive() {
  server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
}

module.exports = keepAlive;
