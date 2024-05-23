// It is a nodeServer to handle socket io connection
require('dotenv').config();
const io = require('socket.io')(process.env.PORT || 8090, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || 'http://127.0.0.1:5500',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type']
    }
  });
  
  const users = {};
  
  io.on('connection', socket => {
    socket.on('new-user-joined', name => {
      // console.log("New User:", name);
      users[socket.id] = name;
      socket.broadcast.emit('user-joined', name);
    });
  
    socket.on('send', message => {
      socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });
    socket.on('disconnect', message => {
      socket.broadcast.emit('left', users[socket.id]);
      delete users[socket.id];
    });
  
    // Send the user's name back to the client for confirmation
    socket.emit('name-confirmation', users[socket.id]);
  });
  