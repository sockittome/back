'use strict';

const TFQuestion = require('../model/truthyfalsy-questions');
const errorHandler = require('../middleware/error-handler');
const bearerAuth = require('../middleware/bearer-auth');

const bodyParser = require('body-parser').json();

const ERROR_MESSAGE = 'Authorization failed';

module.exports = router => {
  router.route('/tfquestions/:_id?')
    .post(bearerAuth, bodyParser, (request, response) => {
      request.body.authId = request.auth._id;
      return new TFQuestion(request.body).save()
        .then(createdQuestion => response.status(201).json(createdQuestion))
        .catch(error => errorHandler(error, response));
    })

    .get(bearerAuth, (request, response) => {
      if(request.params._id) {
        return TFQuestion.findById(request.params._id)
          .then(question => response.status(200).json(question))
          .catch(error => errorHandler(error, response));
      }
      return TFQuestion.find()
        .then(questions => {
          let questionIds = questions.map(question => question._id);
          response.status(200).json(questionIds);
        })
        .catch(error => errorHandler(error, response));
    })

    .put(bearerAuth, bodyParser, (request, response) => {
      TFQuestion.findOne({
        authId: request.auth._id,
        _id: request.params._id,
      })
        .then(question => {
          if(!question) return Promise.reject(new Error(ERROR_MESSAGE));
          return question.set(request.body).save();
        })
        .then(() => response.sendStatus(204))
        .catch(error => errorHandler(error, response));
    })

    .delete(bearerAuth, (request, response) => {
      return TFQuestion.findById(request.params._id)
        .then(question => {
          if(question.authId.toString() === request.auth._id.toString()) return question.remove();
          return errorHandler(new Error(ERROR_MESSAGE), response);
        })
        .then(() => response.sendStatus(204))
        .catch(error => errorHandler(error, response));
    });
};
