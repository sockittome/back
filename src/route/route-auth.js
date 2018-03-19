'use strict';

import {Router} from 'express';
import Auth from '../model/auth';
import {log, daysToMilliseconds} from '../lib/utils';

const bodyParser = requ('body-parser').json();
const basicAuth = require('../middleware/basic-auth');

export default new Router()
  .post('/signup', bodyParser, (request, response, next) => {
    log('__ROUTE__ POST /signup');
    let pw = req.body.password;
    delete req.body.password;

    let user = new Auth(req.body);

    user.generatePasswordHash(pw)
      .then(newUser => newUser.save())
      .then(userRes => userRes.generateToken())
      .then(token => res.status(201).json(token))
      .catch(err => errorHandler(err, res));
  })
  .get('/login', basicAuth, (request, response, next) => {
    log('__ROUTE__ GET /login');
    Auth.findOne({username: req.auth.username})
      .then(user => {
        return user
          ? user.comparePasswordHash(req.auth.password)
          : Promise.reject(new Error('Authorization Failed. User not found.'));
      })
      .then(user => {
        delete req.headers.authorization;
        delete req.auth.password;
        return user;
      })
      .then(user => user.generateToken())
      .then(token => res.status(200).json(token))
      .catch(err => errorHandler(err, res));
  });
