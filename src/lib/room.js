import {log} from './utils'; //eslint-disable-line
import truthyfalsyGame from '../game/truthyfalsy';

class Room {
  constructor(socket, roomCode) {
    this.host = socket;
    this.room = roomCode;
    // players is an array of each player's socket
    this.players = [];
    this.gameStarted = false;
    // gameScores object has each player's socket ID as the key and their score as the value
    this.gameScores = {};

    socket.join(roomCode);
  }

  startGame(game, socket, ioServer, instance) {
    this.gameStarted = true;
    switch(game) {
      case 'truthyfalsy':
        truthyfalsyGame(socket, ioServer, instance);
        break;
    }
  }

}
