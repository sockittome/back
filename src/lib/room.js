import {log} from './utils'; //eslint-disable-line
import truthyfalsyGame from '../game/truthyfalsy';

module.exports = class Room {
  constructor(socket, roomCode) {
    this.host = socket;
    this.code = roomCode;
    // players is an array of each player's socket
    this.players = [];
    this.closed = false;
    this.game = null;

    socket.join(roomCode);
  }

  startGame(game, roomCode, socket, ioServer, instance) {
    this.closed = true;
    this.players.map(player => player.score = 0);
    switch(game) {
      case 'truthyfalsy':
        truthyfalsyGame(socket, roomCode, ioServer, instance);
        break;
    }
  }
};
