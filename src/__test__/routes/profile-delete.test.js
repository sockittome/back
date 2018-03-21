'use strict';

const superagent = require('superagent');
const faker = require('faker');
const server = require('../../lib/http-server');
const mocks = require('../lib/mocks');

const PORT = process.env.PORT;
const ENDPOINT_PROFILE = `:${PORT}/api/v1/profile`;

describe('DELETE /api/v1/profile/:id', function() {
  beforeAll(server.start);
  afterAll(server.stop);

  describe('Valid Routes', () => {
    it('Should respond with a status code of 204', () => {
      mocks.profile.createOne().then(data => this.mockProfile = data)
        .then(newProfile => {
          return superagent.delete(`${ENDPOINT_PROFILE}/${newProfile._id}`)
            .set('Authorization', `Bearer ${newProfile.user.token}`)
            .then(res => {
              expect(res.status).toEqual(204);
            });
        });
    });
  });

  describe('Invalid Routes', () => {
    it('Should respond with an authorization error', () => {
      mocks.profile.createOne().then(data => this.mockProfile = data)
        .then(newProfile => {
          return superagent.delete(`${ENDPOINT_PROFILE}/${newProfile._id}`)
            .catch(err => {
              this.error = err;
              expect(err.response.text).toMatch(/Auth/);
            });
        });
    });
    it('Should respond with a status code of 404 when given a bad path', () => {
      mocks.profile.createOne().then(data => this.mockProfile = data)
        .then(newProfile => {
          return superagent.delete(`${ENDPOINT_PROFILE}/tim`)
            .catch(err => {
              this.error = err;
              expect(err.status).toBe(404);
            });
        });
    });
  });

});
