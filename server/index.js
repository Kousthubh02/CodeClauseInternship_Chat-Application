const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Create a Socket.IO server instance using the 'server' object
const io = socketIO(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());

const users = {};

io.on('connection', socket => {
  socket.on('new-user-joined', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', { message: `${name} joined the chat`, username: name });
  });

  socket.on('send', message => {
    socket.broadcast.emit('receive', { message: message, username: users[socket.id] });
  });
  socket.on('disconnect', message => {
    socket.broadcast.emit('leave', { username: users[socket.id] });
    delete users[socket.id];
  });
});

const port = 8000;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
