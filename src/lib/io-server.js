// -- setting up dependencies -- //
import { log, logError } from './utils.js';

export default (server) => {
  // -- setting up socket -- //
  const ioServer = require('socket.io')(server);
  const events = require('./events');

  ioServer.on('connection', socket => {
    log('__CLIENT_CONNECTED__', socket.id);

    socket.on(events.SEND_QUESTION, question => {
      console.log('socket event', events.SEND_QUESTION);
      socket.emit(events.RECEIVE_QUESTION, 'You sent a question!');
      ioServer.emit(events.RECEIVE_QUESTION, {
        ...question,
      });
    });
  });

  ioServer.on('disconnect', () => {
    log('__CLIENT_DISCONNECTED__', socket.id);
  });

  ioServer.on('error', error => {
    logError('ERROR', error);
  });
};