'use strict';

const superagent = require('superagent');
const faker = require('faker');
const server = require('../../lib/http-server');
const mocks = require('../lib/mocks');
require('jest');

const PORT = process.env.PORT;
const ENDPOINT_PROFILE = `:${PORT}/api/v1/truthyfalsy`;

describe('POST /api/v1/truthyfalsy', function() {
  beforeAll(server.start);
  afterAll(server.stop);

  describe('Valid route', () => {
    it('Should return a status code of 201', () => {
      mocks.truthyfalsy.createOne().then(mock => this.mockGame = mock)
        .then(createdGame => {
          return superagent.post(ENDPOINT_PROFILE)
            .set('Authorization', `Bearer ${this.mockGame.user.token}`)
            .send(this.mockGame)
            .then(res => {
              this.response = res;
            });
          expect(this.response.status).toBe(201);
        });
    });
  });
});
