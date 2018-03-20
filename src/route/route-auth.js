

import Auth from '../model/auth';
import Profile from '../model/profile';
import {log} from '../lib/utils';

const bodyParser = require('body-parser').json();
const basicAuth = require('../middleware/basic-auth');
const errorHandler = require('../middleware/error-handler');

module.exports = function(router) {
  router.post('/register', bodyParser, (request, response) => {
    log('__ROUTE__ POST /register');
    let pw = request.body.password;
    delete request.body.password;

    let user = new Auth(request.body);

    return user.generatePasswordHash(pw)
      .then(newUser => newUser.save())
      .then(newProfile => {
        new Profile({
          firstName: '',
          games: [],
          authId: newProfile._id,
        }).save();
        return newProfile;
      })
      .then(userRes => userRes.generateToken())
      .then(token => response.status(201).send(token))
      .catch(err => errorHandler(err, res));
  })

    .get('/login', basicAuth, (request, response, next) => {
      log('__ROUTE__ GET /login');
      Auth.findOne({username: request.auth.username})
        .then(user => {
          console.log('findOne', user);
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
        .then(token => response.status(200).send(token))
        .catch(next);
    });
};
