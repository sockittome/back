'use strict';

const TruthyFalsy = require('../model/truthyfalsy');
const errorHandler = require('../middleware/error-handler');
const bearerAuth = require('../middleware/bearer-auth');

const bodyParser = require('body-parser').json();

const ERROR_MESSAGE = 'Authorization failed';

module.exports = router => {
  router.route('/truthyfalsy/:_id?')
    .post(bearerAuth, bodyParser, (request, response) => {
      request.body.authId = request.user._id;
      // console.log('request body', request.user);
      return new TruthyFalsy(request.body).save()
        .then(createdQuiz => {
          response.status(201).json(createdQuiz);
        })
        .catch(error => errorHandler(error, response));
    })

    .get(bearerAuth, (request, response) => {
      if(request.params._id) {
        return TruthyFalsy.findById(request.params._id)
          .then(quiz => response.status(200).json(quiz))
          .catch(error => errorHandler(error, response));
      }
      return TruthyFalsy.find()
        .then(quizzes => {
          let quizIds = quizzes.map(quiz => quiz._id);
          response.status(200).json(quizIds);
        })
        .catch(error => errorHandler(error, response));
    })

    .put(bearerAuth, bodyParser, (request, response) => {
      TruthyFalsy.findOne({
        _id: request.params._id,
      })
        .then(quiz => {
          if(!quiz) return Promise.reject(new Error(ERROR_MESSAGE));
          return quiz.set(request.body).save();
        })
        .then(() => response.sendStatus(204))
        .catch(error => errorHandler(error, response));
    })

    .delete(bearerAuth, (request, response) => {
      return TruthyFalsy.findById(request.params._id)
        .then(quiz => {
          if(quiz.authId.toString() === request.user._id.toString()) return quiz.remove();
          return errorHandler(new Error(ERROR_MESSAGE), response);
        })
        .then(() => response.sendStatus(204))
        .catch(error => errorHandler(error, response));
    });

};
