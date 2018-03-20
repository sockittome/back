'use strict';

import Profile from '../model/profile';
import {log} from '../lib/utils';

const errorHandler = require('../middleware/error-handler');

module.exports = function(router) {
  router.get('/profile/:_id', (request, response) => {
    log('__ROUTE__ GET PROFILE');

  });
};
