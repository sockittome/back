'use strict';

const superagent = require('superagent');
const faker = require('faker');
const server = require('../../lib/http-server');
const mocks = require('../lib/mocks');

const PORT = process.env.PORT;
const ENDPOINT_SIGNIN = `:${PORT}/api/v1/login`;

describe('GET /api/v1/login', function() {
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(() => mocks.auth.removeAll());
  beforeAll(() => {
    return mocks.auth.createOne()
      .then(mockObj => this.mockObj = mockObj)
      .then(mockObj => superagent.get(ENDPOINT_SIGNIN)
        .auth(mockObj.user.username, mockObj.password)
        .then(res => this.response = res));
  });

  describe('Valid Routes', () => {
    it('Should respond with a status code of 200', () => {
      expect(this.response.status).toBe(200);
    });
  });

  describe('Invalid Routes', () => {
    it('Should respond with a status code of 401 if the user cannot be authenticated', () => {
      return superagent.get(ENDPOINT_SIGNIN)
        .auth('fake-user', 'fake-password')
        .catch(err => expect(err.status).toBe(500));
    });
    it('Should respond with an error when given a bad body', () => {
      return superagent.get(ENDPOINT_SIGNIN)
        .send()
        .catch(err => expect(err.status).toBe(500));
    });
    it('Should respond with an error when not provided a username', () => {
      return superagent.get(ENDPOINT_SIGNIN)
        .auth('', this.mockObj.user.password)
        .catch(err => {
          expect(err.response.text).toMatch(/Auth/);
        });
    });
    it('Should respond with an error when not provided a password', () => {
      return superagent.get(ENDPOINT_SIGNIN)
        .auth(this.mockObj.user.username, '')
        .catch(err => {
          expect(err.response.text).toMatch(/Auth/);
        });
    });
    it('Should respond with an error when provided a bad password', () => {
      return superagent.get(ENDPOINT_SIGNIN)
        .auth(this.mockObj.user.username, 'timtimtim')
        .catch(err => {
          expect(err.response.text).toMatch(/Auth/);
        });
    });
  });
});