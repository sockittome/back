'use strict';

// -- setting up server -- //
const express = require('express');
const app = express();
const httpServer = require('http').Server(app);
require('dotenv').config();

// -- setting up socket -- //
const ioServer = require('socket.io')(httpServer);
const events = require('./events');

ioServer.on('connection', socket => {
  console.log('connection', socket.id);

  socket.on(events.SEND_QUESTION, question => {
    console.log('socket event', events.SEND_QUESTION);
    socket.emit(events.RECEIVE_QUESTION, 'You sent a question!');
    ioServer.emit(events.RECEIVE_QUESTION, {
      ...question,
    });
  });

  socket.on(events.SEND_ANSWER, answer => {
    console.log('socket event', events.SEND_ANSWER);
    socket.emit(events.RECEIVE_ANSWER, 'You sent an answer!');
    ioServer.emit(events.RECEIVE_ANSWER, {
      ...answer,
    });
    console.log('ioServer answer', answer);
    console.log('answer from: ', socket.id);
  });
});

ioServer.on('disconnect', () => {
  console.log('LEFT', ioServer.id);
});

ioServer.on('error', error => {
  console.error('ERROR', error);
});

httpServer.listen(process.env.PORT, () => {
  console.log('SERVER UP', process.env.PORT);
});
