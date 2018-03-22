'use strict';

const superagent = require('superagent');
const faker = require('faker');
const server = require('../../lib/http-server');
const mocks = require('../lib/mocks');
require('jest');

const PORT = process.env.PORT;
const GAME_ENDPOINT = `:${PORT}/api/v1/truthyfalsy`;

describe('POST /api/v1/truthyfalsy', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mocks.auth.removeAll);
  afterAll(mocks.profile.removeAll);
  afterAll(mocks.truthyfalsy.removeAll);

  describe('Valid', () => {
    it('should return a 201 status (CREATED)', () => {
      return mocks.profile.createOne()
        .then(mock => {
          return superagent.post(`${GAME_ENDPOINT}`)
            .set('Authorization', `Bearer ${mock.user.token}`)
            .send({
              name: 'testing',
              questions: [1, 2, 3],
              authId: mock.user._id,
            });
        })
        .then(res => {
          expect(res.status).toEqual(201);
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('questions');
          expect(res.body).toHaveProperty('authId');
          expect(res.body).toHaveProperty('_id');
        });
    });
  });
  describe('Invalid route', () => {
    it('should respond with a 404 not found', () => {
      return superagent.post(`:${PORT}/api/v1/this is wrong`)
        .then(response => console.log('error did not throw: res:', response))
        .catch(err => expect(err.status).toBe(404));
    });
  });
});
