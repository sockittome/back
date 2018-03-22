'use strict';

const superagent = require('superagent');
const faker = require('faker');
const server = require('../../lib/http-server');
const mocks = require('../lib/mocks');
require('jest');

const PORT = process.env.PORT;
const GAME_ENDPOINT = `:${PORT}/api/v1/truthyfalsy`;

describe('DELETE /api/v1/truthyfalsy', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mocks.auth.removeAll);
  afterAll(mocks.profile.removeAll);
  afterAll(mocks.truthyfalsy.removeAll);

  describe('Valid', () => {
    it('should return a 204 status (DELETED)', () => {
      return mocks.truthyfalsy.createOne()
        .then(mock => {
          return superagent.delete(`${GAME_ENDPOINT}/${mock.truthyfalsy._id}`)
            .set('Authorization', `Bearer ${mock.profile.user.token}`)
            .send();
        })
        .then(res => {
          expect(res.status).toEqual(204);
          expect(res.body).toEqual({});
          expect(res.body).toMatchObject({});
        });
    });
  });
  describe('Invalid auth', () => {
    it('should respond with a 401 not authorized', () => {
      return mocks.truthyfalsy.createOne()
        .then(mock => {
          return superagent.delete(`${GAME_ENDPOINT}/${mock.truthyfalsy._id}`)
            .send();
        })
        .then(response => console.log('error did not throw: res:', response))
        .catch(err => expect(err.status).toBe(401));
    });
  });
  describe('Invalid route', () => {
    it('should respond with a 404 not found', () => {
      return mocks.truthyfalsy.createOne()
        .then(mock => {
          return superagent.delete(`${GAME_ENDPOINT}/${mock.truthyfalsy._id}nope`)
            .set('Authorization', `Bearer ${mock.profile.user.token}`)
            .send();
        })
        .then(response => console.log('error did not throw: res:', response))
        .catch(err => expect(err.status).toBe(404));
    });
  });
});
