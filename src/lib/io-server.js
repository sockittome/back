// -- setting up dependencies -- //
import { log, logError } from './utils.js';
import randomString from 'randomstring';
import Room from './room';

export default (server) => {
  // -- setting up socket -- //
  const ioServer = require('socket.io')(server);
  const events = require('./events');

  // ioServer.all is map of all the rooms
  ioServer.all = {};

  ioServer.on('connection', socket => {
    log('__CLIENT_CONNECTED__', socket.id);

    socket.on('CREATE_ROOM', () => {
      // generating room code for users
      let roomCode = randomString.generate({
        charset: 'alphabetic',
        length: 4,
      }).toUpperCase();
      // generate a new room code if it already exists
      while (ioServer.all[roomCode]) {
        roomCode = randomString.generate({
          charset: 'alphabetic',
          length: 4,
        }).toUpperCase();
      }
      log('__ROOM_CREATED__', roomCode);
      socket.broadcast.to(socket.id).emit(events.CREATE_ROOM, 'You created a room.');
      ioServer.all[roomCode] = new Room(socket, roomCode);
      socket.room = roomCode;
    });

    socket.on('JOIN_ROOM', (roomCode, nickname) => {
      let room = ioServer.all[roomCode];
      if (room) {
        if (room.gameStarted) {
          socket.broadcast.to(socket.id).emit(`A game has already started in this room.`);
          return;
        }
        socket.nickname = nickname;
        socket.roomJoined = roomCode;
        room.players.push(socket);
        room.gameScores[socket.id] = 0;
        socket.join(roomCode);
        socket.broadcast.to(roomCode).emit(`${nickname} has joined the room.`);
      }
      else {
        socket.broadcast.to(socket.id).emit(`The room you entered does not exist.`);
      }
    });

    socket.on('START_GAME', (game, instance) => {
      let roomCode = socket.room;
      let room = ioServer.all[roomCode];

      // variables game and instance should be passed in from front end
      game = 'truthyfalsy';
      instance = [
        {'question': 'React is a JS framework.', 'answer': false},
        {'question': 'Node is based off the Chrome v8 engine.', 'answer': true},
        {'question': 'JavaScript is single-threaded.', 'answer': true},
      ];

      // start the game
      room.startGame(game, socket, ioServer, instance);
      log(`__GAME_STARTED__: [${game}: ${roomCode}]`);
    });

    socket.on('END_GAME', socket => {
      let roomCode = socket.room;
      let room = ioServer.all[roomCode];
      room.players.map(player => {
        let destination = process.env.CLIENT_URL;
        player.emit('REDIRECT', destination);
        player.leave(roomCode);
        socket.broadcast.to(player.id).emit(`You have left the game.`);
      });
      let destination = `${process.env.CLIENT_URL}/choosegame`;
      socket.emit('REDIRECT', destination);
      socket.leave(roomCode);
      socket.broadcast.to(socket.id).emit('You have ended the game.');
      delete ioServer.all[roomCode];
    });

    socket.on('LEAVE_ROOM', socket => {
      let roomCode = socket.roomJoined;
      let room = ioServer.all[roomCode];
      room.players = room.players.filter(player => player.id !== socket.id);
      let destination = process.env.CLIENT_URL;
      socket.emit('REDIRECT', destination);
      socket.broadcast.to(roomCode).emit(`${socket.nickname} has left the room.`);
      socket.leave(roomCode);
    });
  });

  ioServer.on('disconnect', () => {
    log('__SERVER_DISCONNECTED__', ioServer.id);
  });

  ioServer.on('error', error => {
    logError('ERROR', error);
  });
};
