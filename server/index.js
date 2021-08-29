const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const io = require("socket.io")(httpServer , {
  cors: {
    origin: "http://localhost:8080",
  },
});
const io = new Server(httpServer);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

httpServer.listen(3000, () => {
  console.log('listening on *:3000');
});