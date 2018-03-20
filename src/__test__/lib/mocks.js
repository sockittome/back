'use strict';

const faker = require('faker');
require('jest');

const Auth = require('../../model/auth');

// sgc - Set mocks as an object that will be exported
const mocks = module.exports = {};

mocks.auth = {};
mocks.auth.createOne = () => {
  let result = {};
  result.password = faker.internet.password();

  return new Auth({
    username: faker.internet.userName(),
  })
    .generatePasswordHash(result.password)
    .then(user => result.user = user)
    .then(user => user.generateToken())
    .then(token => result.token = token)
    .then(() => result);
};

// sgc - Delete all auths (users), If songs were created delete those first
mocks.auth.removeAll = () => Promise.all([Auth.remove()]);
