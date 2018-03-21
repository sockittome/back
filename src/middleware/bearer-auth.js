const errorHandler = require('./error-handler');
const Auth = require('../model/auth');
const jsonWebToken = require('jsonwebtoken');
const debug = require('debug')('http:bearer-auth');

import {log} from '../lib/utils';

const ERROR_MESSAGE = 'Authorization Failed';

module.exports = function(req, res, next) {
  let authHeader = req.headers.authorization;
  if(!authHeader) return errorHandler(new Error(ERROR_MESSAGE), res);

  let token = authHeader.split('Bearer ')[1];

  if(!token) return errorHandler(new Error(ERROR_MESSAGE), res);

  return jsonWebToken.verify(token, process.env.SECRET, (error, decodedValue) => {
    if(error) {
      log('verify error', error);
      error.message = ERROR_MESSAGE;
      return errorHandler(error, res);
    }

    return Auth.findOne({compareHash: decodedValue.token})
      .then(user => {
        if(!user) return errorHandler(new Error(ERROR_MESSAGE), res);
        req.user = user;
        next();
      })
      .catch(error => errorHandler(error, res));
  });
};
