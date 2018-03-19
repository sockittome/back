'use strict';

import {Router} from 'express';
import Auth from '../model/auth';
import {log} from '../lib/utils';

const bodyParser = requ('body-parser').json();
const basicAuth = require('../middleware/basic-auth');

export default new Router()
  .post('/signup', bodyParser, (request, response, next) => {
    log('__ROUTE__ POST /signup');
    let pw = request.body.password;
    delete request.body.password;

    let user = new Auth(request.body);

    user.generatePasswordHash(pw)
      .then(newUser => newUser.save())
      .then(userRes => userRes.generateToken())
      .then(token => response.status(201).json(token))
      .catch(next);
  })
  .get('/login', basicAuth, (request, response, next) => {
    log('__ROUTE__ GET /login');
    Auth.findOne({username: request.auth.username})
      .then(user => {
        return user
          ? user.comparePasswordHash(request.auth.password)
          : Promise.reject(new Error('Authorization Failed. User not found.'));
      })
      .then(user => {
        delete request.headers.authorization;
        delete request.auth.password;
        return user;
      })
      .then(user => user.generateToken())
      .then(token => response.status(200).json(token))
      .catch(next);
  });
