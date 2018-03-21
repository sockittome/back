module.exports = (socket, roomCode, ioServer, questions) => {
  // questions is an array of objects containing a question and an answer key
  let room = ioServer.all[roomCode];
  // initially call question phase
  // console.log('____ROOMPLAYERS___', room.players);
  _questionPhase(questions, roomCode, socket, ioServer, room.players);
};

function _questionPhase(questions, roomCode, socket, ioServer, roomPlayers) {
  console.log(roomCode, '__QUESTION_PHASE__');

  // currentQuestion is a question object with the question and answer
  let currentQuestion = questions.shift();

  // send the question object to the front end
  ioServer.in(roomCode).emit('SEND_QUESTION', currentQuestion);

  // 30 seconds to display question and allow players to answer
  setTimeout(function() {
    _answerPhase(currentQuestion, questions, roomCode, socket, ioServer, roomPlayers);
  }, 30000);
}

// this function should receive from/send to the front end the stats for correct/wrong answers?
function _answerPhase(currentQuestion, questions, roomCode, socket, ioServer, roomPlayers) {
  console.log(roomCode, '__ANSWER_PHASE__');

  socket.broadcast.to(roomCode).emit('INITIATE_ANSWER_PHASE');

  if (questions.length) {
    // 20 seconds to display the results screen for the question
    setTimeout(function() {
      _questionPhase(questions, roomCode, socket, ioServer, roomPlayers);
    }, 20000);
  }
  else {
    // call end game function/screen here after same amount of setTimeout
    console.log('END GAME');
  }
};