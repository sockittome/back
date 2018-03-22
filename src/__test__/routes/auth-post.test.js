'use strict';

const superagent = require('superagent');
const faker = require('faker');
const server = require('../../lib/http-server');
const Auth = require('../../model/auth');

const PORT = process.env.PORT;
const ENDPOINT_SIGNUP = `:${PORT}/api/v1/register`;

describe('POST /api/v1/register', function() {
  this.mockAuth = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
  };
  beforeAll(server.start);
  afterAll(server.stop);

  describe('Valid routes', () => {
    beforeAll(() => {
      return superagent.post(ENDPOINT_SIGNUP)
        .send(this.mockAuth)
        .then(res => this.response = res);
    });
    it('SHOULD RETURN A 201 STATUS', () => {
      expect(this.response.status).toBe(201);
    });
  });

  describe('Invalid routes', () => {
    it('Should return a status code of 500 if no body was provided', () => {
      return superagent.post(ENDPOINT_SIGNUP)
        .catch(err => expect(err.status).toBe(500));
    });
    it('Should respond with a status code of 404 when given a bad path', () => {
      return superagent.post(`${ENDPOINT_SIGNUP}/tim`)
        .send({username: 'tim', password: 'timroolz'})
        .catch(err => expect(err.status).toBe(404));
    });
    it('Should return a status code of 500 if no username is provided', () => {
      return superagent.post(ENDPOINT_SIGNUP)
        .send(new Auth({
          password: faker.internet.password(),
        }))
        .catch(err => expect(err.status).toBe(500));
    });
  });
});
