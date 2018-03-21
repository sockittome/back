module.exports = (socket, ioServer, questions) => {
  // questions is an array of objects containing a question and an answer key

  let roomCode = socket.room;
  let room = ioServer.all[roomCode];

  _questionPhase(questions, room, socket, ioServer);
  // initially call question phase

  // function _answerPhase() {
  //   console.log(roomCode, '__ANSWER_PHASE__');
  //   // this function should receive from/send to the front end the stats for correct/wrong answers?

  //   if (questions.length) {
  //     // 15 seconds to display the results screen for the question
  //     setTimeout(_questionPhase, 15000);
  //   }
  //   else {
  //     // call end game function/screen here
  //   }
  // };



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


function _questionPhase(questions, room, socket, ioServer) {
  console.log(roomCode, '__QUESTION_PHASE__');
  // currentQuestion is a question object with the question and answer
  let currentQuestion = questions.shift();

  // send the question object to the front end
  ioServer.in(roomCode).emit('SEND_QUESTION', currentQuestion);

  // 30 seconds to display question and allow players to answer
  // setTimeout(_answerPhase, 30000);
}