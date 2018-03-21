// -- setting up dependencies -- //
import { log, logError } from './utils.js';
import randomString from 'randomstring';
import Room from './room';

export default (ioServer) => {
  ioServer.on('connection', socket => {
    log('__CLIENT_CONNECTED__', socket.id);


    // ==================== CREATE ROOM ==================== //
    socket.on('CREATE_ROOM', (game, instance) => {
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
      //creating new room with code generated
      log('__ROOM_CREATED__', roomCode);
      ioServer.all[roomCode] = new Room(socket, roomCode);
      let room = ioServer.all[roomCode];

      // set keys and values on the room object created
      room.game = game;
      room.instance = instance;

      // sets roomHost variable on socket
      socket.roomHost = roomCode;

      // set max player limits for each game
      switch (game) {
        case 'truthyfalsy':
          room.maxPlayers = 30;
          break;
      }

      let data = { 'roomCode': roomCode, 'game': game, 'maxPlayers': room.maxPlayers, 'roomHost': socket.id };
      ioServer.emit('SEND_ROOM', JSON.stringify(data));
    });


    // ==================== JOIN ROOM ==================== //
    socket.on('JOIN_ROOM', (roomCode, nickname) => {
      let room = ioServer.all[roomCode];
      if (room) {
        // if game has already started in the room, can't join
        if (room.closed) {
          socket.emit('ERROR_JOIN_ROOM', `A game has already started in this room or the room is at capacity.`);
          return;
        }

        // if nickname is already in the room, can't join
        let duplicateNick = false;
        room.players.forEach(player => {
          if (player.nickname === nickname) duplicateNick = true;
        });
        if (duplicateNick) {
          socket.emit('ERROR_JOIN_ROOM', `This nickname is already being used in the room.`);
          return;
        }

        console.log(`${nickname} joined ${roomCode}`);

        // setting variables on socket
        socket.nickname = nickname;
        socket.roomJoined = roomCode;
        socket.join(roomCode);

        // pushes socket into the players array in room
        room.players.push(socket);
        let numPlayers = room.players.length;

        // closing the room if the max players is met
        if (numPlayers >= room.maxPlayers) room.closed = true;

        // sending number of players in the waiting room back to front end
        socket.emit('JOINED_ROOM', room.game, room.instance, room.maxPlayers);
        let playerNames = room.players.map(player => player.nickname);
        ioServer.in(roomCode).emit('TRACK_PLAYERS', numPlayers, playerNames);
      }
      else {
        // if room doesn't exist
        socket.emit('ERROR_JOIN_ROOM', `This room does not exist.`);
      }
    });


    // ==================== REDIRECT PLAYERS ==================== //
    // when host starts game
    socket.on('REDIRECT_PLAYERS', (roomCode, path) => {
      socket.broadcast.to(roomCode).emit('REDIRECT', path);
    });


    // ==================== START GAME ==================== //
    // socket.on('UPDATE_PLAYERARRAY', (playerIDs, roomCode) => {
    //   console.log('UPDATEPLAYERARRAY IDs', playerIDs);
    //   let room = ioServer.all[roomCode];
    //   playerIDs.forEach(id => {
    //     let playerSocket = ioServer.sockets.connected[id];
    //     room.players.push(playerSocket);
    //   });
    // });

    socket.on('START_GAME', data => {
      let {game, instance, roomCode} = data;
      let room = ioServer.all[roomCode];

      // start the game with the host socket
      room.startGame(game, roomCode, socket, ioServer, instance.questions);
      log(`__GAME_STARTED__: [${game}: ${roomCode}]`);
    });


    // ==================== END GAME ==================== //
    socket.on('END_GAME', socket => {
      let roomCode = socket.room;
      let room = ioServer.all[roomCode];
      room.players.map(player => {
        let destination = process.env.CLIENT_URL;
        player.emit('REDIRECT', destination);
        player.leave(roomCode);
      });
      let destination = `${process.env.CLIENT_URL}/choosegame`;
      socket.emit('REDIRECT', destination);
      socket.leave(roomCode);
      delete ioServer.all.roomCode;
    });


    // ==================== LEAVE ROOM ==================== //
    socket.on('LEAVE_ROOM', roomCode => {
      let room = ioServer.all[roomCode];
      room.players = room.players.filter(player => player.id !== socket.id);
      let playerNames = room.players.map(player => player.nickname);
      socket.broadcast.to(roomCode).emit('TRACK_PLAYERS', room.players.length, playerNames);
      socket.leave(roomCode);
    });


    // ==================== DISCONNECT ==================== //
    socket.on('disconnect', () => {
      if (socket.roomJoined) {
        let roomCode = socket.roomJoined;
        let room = ioServer.all[roomCode];
        room.players = room.players.filter(player => player.id !== socket.id);
        let playerNames = room.players.map(player => player.nickname);
        socket.broadcast.to(roomCode).emit('TRACK_PLAYERS', room.players.length, playerNames);
        socket.leave(roomCode);
      }
      if (socket.roomHost) {
        let roomCode = socket.roomHost;
        let room = ioServer.all[roomCode];
        room.players.forEach(player => {
          player.emit('REDIRECT_DISCONNECT');
          player.leave(roomCode);
        });
        socket.leave(roomCode);
        delete ioServer.all.roomCode;
      }
      console.log('__CLIENT_DISCONNECTED__', socket.id);
    });




    // ==================== TRUTHY FALSY GAME ==================== //
    // listening for answers from front end
    socket.on('TRUTHYFALSY_SEND_ANSWER', (isCorrect, id, roomCode) => {
      let room = ioServer.all[roomCode];
      console.log(socket.nickname, 'emitting answer to host', room.host.id);
      socket.broadcast.to(room.host.id).emit('TRUTHYFALSY_HOST_PASS_ANSWER', isCorrect, id, roomCode);
    });

    socket.on('TRUTHYFALSY_HOST_RECEIVE_ANSWER', (isCorrect, id, roomCode) => {
      let room = ioServer.all[roomCode];
      // console.log('socket.id, socket.roomHost, playerId: ', socket.id, socket.roomHost, id);

      console.log('host receive answer room.players', room.players);
      // let player = room.players.filter(player => player.id === id)[0];
      // console.log('Answer received: ', player.nickname);
      // if (isCorrect) {
      //   player.score += 10;
      //   console.log('Correct answer: ', player.nickname, player.score);
      //   player.emit('CORRECT_ANSWER', player.nickname, player.score);
      // }
      // else {
      //   console.log('Wrong answer: ', player.nickname, player.score);
      //   player.emit('WRONG_ANSWER', player.nickname, player.score);
      // }
    });
  });

  ioServer.on('disconnect', () => {
    log('__SERVER_DISCONNECTED__', ioServer.id);
  });

  ioServer.on('error', error => {
    logError('ERROR', error);
  });
};
