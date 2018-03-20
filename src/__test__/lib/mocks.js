'use strict';

const faker = require('faker');
require('jest');

const Auth = require('../../model/auth');
const Profile = require('../../model/profile');

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

mocks.profile = {};
mocks.profile.createOne = () => {
  let result = {};

  return mocks.auth.createOne()
    .then(user => result.user = user)
    .then(user => {
      return new Profile({
        firstName: faker.name.firstName(),
        games: ['dog', 'tim', 'webstorm'],
        authId: user.user._id,
      }).save();
    })
    .then(profile => {
      result.profile = profile;
      return result;
    });
};

// sgc - Delete all auths (users), If songs were created delete those first
mocks.auth.removeAll = () => Promise.all([Auth.remove()]);
mocks.profile.removeAll = () => Promise.all([Profile.remove()]);
