'use strict';

import Profile from '../model/profile';
import {log} from '../lib/utils';
import bodyParser from 'body-parser';

const errorHandler = require('../middleware/error-handler');
const bearerAuth = require('../middleware/bearer-auth');

module.exports = function(router) {
  router.route('/profile/:_id')
    .get(bearerAuth, (request, response) => {
      log('__ROUTE__ GET PROFILE');

      return Profile.findById(request.params._id)
        .then(profile => response.status(200).json(profile))
        .catch(error => errorHandler(error, response));
    })

    .put(bearerAuth, bodyParser, (request, response) => {
      Profile.findOne({
        _id: request.params._id,
      })
        .then(profile => {
          if (!profile) return Promise.reject(new Error('Authorization error'));
          return profile.set(request.body).save();
        })
        .then(() => response.sendStatus(204))
        .catch(err => errorHandler(err, response));
    })

    .delete(bearerAuth, (request, response) => {
      return Profile.findById(request.params._id)
        .then(profile => {
          if(profile.authId.toString() === request.user._id.toString()) return profile.remove();
          return errorHandler(new Error('Authorization failed'), response);
        })
        .then(() => response.sendStatus(204))
        .catch(error => errorHandler(error, response));
    });
};
