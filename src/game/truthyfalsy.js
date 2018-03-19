const events = require('../lib/events');

module.exports = (socket, ioServer, questions) => { // eslint-disable-line
  let roomCode = socket.room;
  let room = ioServer.all[roomCode];

  // do these phasing functions go on the front end or back end!?
  function questionPhase(questions) {
    if (room.answerInterval) clearInterval(room.answerInterval);

    // currentQuestion is a question object with the question and answer
    let currentQuestion = questions.shift();

    // 30 seconds to display question and allow players to answer
    room.questionInterval = setInterval(answerPhase, 30000);

    // send the question object to the front end
    socket.broadcast.to(roomCode).emit(events.SEND_QUESTION, currentQuestion);
  }

  function answerPhase(questions) {
    clearInterval(room.questionInterval);

    // this function should receive from/send to the front end the stats for correct/wrong answers?

    if (questions.length) {
      // 15 seconds to display the results screen for the question
      room.answerInterval = setInterval(questionPhase, 15000);
    }
    else {
      // call end game function/screen here
    }
  }

  // socket.on(events.SEND_QUESTION, question => {
  //   console.log('socket event', events.SEND_QUESTION);
  //   socket.emit(events.RECEIVE_QUESTION, 'You sent a question!');
  //   console.log('host id:', socket.id);
  //   ioServer.hostId = socket.id;
  //   ioServer.emit(events.RECEIVE_QUESTION, {
  //     ...question,
  //   });
  // });

  // socket.on(events.SEND_ANSWER, answer => {
  //   console.log('socket event', events.SEND_ANSWER);
  //   socket.broadcast.to(ioServer.hostId).emit(events.RECEIVE_ANSWER, `${socket.id} sent you an answer`);

  //   ioServer.emit(events.RECEIVE_ANSWER, {
  //     ...answer,
  //   });

  //   console.log('ioServer answer', answer);
  //   console.log('answer from: ', socket.id);
  // });
};