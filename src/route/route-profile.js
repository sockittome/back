'use strict';

import Profile from '../model/profile';
import {log} from '../lib/utils';

const errorHandler = require('../middleware/error-handler');
const bearerAuth = require('../middleware/bearer-auth');

module.exports = function(router) {
  router.route('/profile/:_id')
    .get(bearerAuth, (request, response) => {
      log('__ROUTE__ GET PROFILE');

      return Profile.findById(request.params._id)
        .then(profile => response.status(200).json(profile))
        .catch(error => errorHandler(error, response));
    });
};
