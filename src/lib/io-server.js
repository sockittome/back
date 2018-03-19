// -- setting up dependencies -- //
import { log, logError } from './utils.js';
import randomString from 'randomstring';
import Room from './room';
import booleanGame from '../model/boolean';

export default (server) => {
  // -- setting up socket -- //
  const ioServer = require('socket.io')(server);
  const events = require('./events');

  ioServer.all = {};

  ioServer.on('connection', socket => {
    log('__CLIENT_CONNECTED__', socket.id);

    socket.on('CREATE_ROOM', () => {
      // generating room code for users
      const roomCode = randomString.generate({
        charset: 'alphabetic',
        length: 5,
      }).toUpperCase();
      log('__ROOM_CREATED__', roomCode);

      socket.broadcast.to(socket.id).emit(events.CREATE_ROOM, 'You created a room');
      ioServer.all[roomCode] = new Room(socket, roomCode);
      socket.room = roomCode;
    });

    socket.on('JOIN_ROOM', (roomCode, nickname) => {
      const room = ioServer.all[roomCode];
      socket.roomJoined = roomCode;
      if (room) {
        socket.nickname = nickname;
        room.players.push(socket);
        socket.join(roomCode);
        socket.broadcast.to(roomCode).emit(`${nickname} has joined the room.`);
      }
    });

    socket.on('START_GAME', () => {
      const roomCode = socket.room;
      const room = ioServer.all[roomCode];
      room.startGame('boolean', socket, ioServer);
      log('__GAME_STARTED__', 'boolean');
    });

    socket.on('END_GAME', socket => {
      const roomCode = socket.room;
      const room = ioServer.all[roomCode];
      const destination = process.env.CLIENT_URL;
      room.players.map(player => {
        player.emit('REDIRECT', destination);
        player.leave(roomCode);
        socket.broadcast.to(player.id).emit(`You have left the game.`);
      });
      socket.emit('REDIRECT', destination);
      socket.leave(roomCode);
      socket.broadcast.to(socket.id).emit('You have ended the game.');
      delete ioServer.all[roomCode];
    });

    socket.on('LEAVE_ROOM', socket => {
      const roomCode = socket.roomJoined;
      const room = ioServer.all[roomCode];
      room.players = room.players.filter(player => player.id !== socket.id);
      const destination = process.env.CLIENT_URL;
      socket.emit('REDIRECT', destination);
      socket.broadcast.to(roomCode).emit(`${socket.nickname} has left the room.`);
      socket.leave(roomCode);
    });

    booleanGame(socket, ioServer);
  });

  ioServer.on('disconnect', () => {
    log('__SERVER_DISCONNECTED__', ioServer.id);
  });

  ioServer.on('error', error => {
    logError('ERROR', error);
  });
};
