'use strict';

const superagent = require('superagent');

const mocks = require('../lib/mocks');
const server = require('../../lib/http-server');
require('jest');

const PORT = process.env.PORT;
const PROFILE_ENDPOINT = `:${PORT}/api/v1/profile`;

describe('DELETE /api/v1/profile', function() {
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mocks.auth.removeAll);
  afterAll(mocks.profile.removeAll);
  afterAll(mocks.truthyfalsy.removeAll);

  describe('Valid route', () => {
    beforeAll(() => {
      return mocks.profile.createOne()
        .then(profile => this.mockProfile = profile);
    });
    it('should delete a profile', () => {
      return superagent.delete(`${PROFILE_ENDPOINT}/${this.mockProfile.profile._id}`)
        .set('Authorization', `Bearer ${this.mockProfile.user.token}`)
        .then(res => expect(res.status).toEqual(204));
    });
  });
  describe('Invalid route', () => {
    it('should return 404 not found', () => {
      return superagent.delete(`:${PORT}/api/v1/not my profile`)
        .catch(err => expect(err.status).toEqual(404));
    });
    it('should return 401 not authorized', () => {
      return mocks.profile.createOne()
        .then(mockProfile => {
          return superagent.delete(`${PROFILE_ENDPOINT}/${mockProfile._id}`)
            .set('Authorization', `Bearer BAD_TOKEN`)
            .catch(err => expect(err.status).toEqual(401));
        });
    });
  });
});
