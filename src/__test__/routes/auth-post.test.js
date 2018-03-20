'use strict';

const superagent = require('superagent');
const faker = require('faker');
const {start, stop} = require('../../lib/http-server');
const Auth = require('../../model/auth');

const PORT = process.env.PORT;
const ENDPOINT_SIGNUP = `:${PORT}/api/v1/register`;

describe('POST /api/v1/register', function() {
  this.mockAuth = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
  };
  beforeAll(() => start(), () => console.log(`LISTENING ON ${PORT}`));
  afterAll(stop);

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
});
