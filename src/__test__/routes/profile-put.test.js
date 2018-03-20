'use strict';

const superagent = require('superagent');
const faker = require('faker');
const server = require('../../lib/http-server');
const mocks = require('../lib/mocks');

const PORT = process.env.PORT;
const ENDPOINT_PROFILE = `:${PORT}/api/v1/profile`;

describe('PUT /api/v1/profile', function() {
  beforeAll(server.start);
  afterAll(server.stop);

  describe('Valid Routes', () => {
    it('Should respond with a status code of 204, and a valid token', () => {
      mocks.profile.createOne().then(data => this.mockProfile = data)
        .then(newProfile => {
          return superagent.put(`${ENDPOINT_PROFILE}/${newProfile._id}`)
            .set('Authorization', `Bearer ${newProfile.user.token}`)
            .send({
              firstName: 'timothy',
            })
            .then(res => {
              expect(res.status).toEqual(204);
              expect(Array.isArray(res.body)).toBeTruthy();
            });
        });
    });
  });

  describe('Invalid Routes', () => {
    it('Should respond with an authorization error', () => {
      mocks.profile.createOne().then(data => this.mockProfile = data)
        .then(newProfile => {
          return superagent.put(`${ENDPOINT_PROFILE}/${newProfile._id}`)
            .send({
              firstName: 'timothy',
            })
            .catch(err => {
              this.error = err;
              expect(err.response.text).toMatch(/Auth/);
            });
        });
    });
    it('Should respond with a status code of 401 when given a bad path', () => {
      mocks.profile.createOne().then(data => this.mockProfile = data)
        .then(newProfile => {
          return superagent.put(`${ENDPOINT_PROFILE}/${newProfile._id}`)
            .send({
              firstName: 'timothy',
            })
            .catch(err => {
              this.error = err;
              expect(err.status).toBe(401);
            });
        });
    });
  });

});
