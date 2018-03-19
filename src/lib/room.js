import {log} from './utils';
import booleanGame from '../model/boolean';

class Room {
  constructor(socket, roomCode) {
    this.host = socket;
    this.room = roomCode;
    this.players = [];
    this.gameStarted = false;

    socket.join(roomCode);
  }

  startGame(game, socket, ioServer) {
    this.gameStarted = true;
    switch(game) {
      case 'boolean':
        booleanGame(socket, ioServer);
        break;
    }
  }

}
