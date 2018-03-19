const events = require('../lib/events');

module.exports = (socket, ioServer) => {
  socket.on(events.SEND_QUESTION, question => {
    console.log('socket event', events.SEND_QUESTION);
    socket.emit(events.RECEIVE_QUESTION, 'You sent a question!');
    console.log('host id:', socket.id);
    ioServer.hostId = socket.id;
    ioServer.emit(events.RECEIVE_QUESTION, {
      ...question,
    });
  });

  socket.on(events.SEND_ANSWER, answer => {
    console.log('socket event', events.SEND_ANSWER);
    socket.broadcast.to(ioServer.hostId).emit(events.RECEIVE_ANSWER, `${socket.id} sent you an answer`);

    ioServer.emit(events.RECEIVE_ANSWER, {
      ...answer,
    });

    console.log('ioServer answer', answer);
    console.log('answer from: ', socket.id);
  });
};
