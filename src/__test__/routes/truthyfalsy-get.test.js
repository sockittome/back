'use strict';

const superagent = require('superagent');
const faker = require('faker');
const server = require('../../lib/http-server');
const mocks = require('../lib/mocks');
require('jest');

const PORT = process.env.PORT;
const GAME_ENDPOINT = `:${PORT}/api/v1/truthyfalsy`;

describe('GET /api/v1/truthyfalsy', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mocks.auth.removeAll);
  afterAll(mocks.profile.removeAll);
  afterAll(mocks.truthyfalsy.removeAll);

  describe('Valid', () => {
    it('should return a 200 status and all truthyfalsy', () => {
      let mockArr = [];
      return mocks.truthyfalsy.createOne()
        .then(mock0 => {
          mockArr.push(mock0.truthyfalsy);
          return mocks.truthyfalsy.createOne()
        })
        .then(mock1 => {
          mockArr.push(mock1.truthyfalsy);
          return superagent.get(`${GAME_ENDPOINT}`)
            .set('Authorization', `Bearer ${mock1.profile.user.token}`)
            .send();
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveLength(2);
          expect(res.body[0]).toHaveProperty('_id');
          expect(res.body[0]).toHaveProperty('authId');
          expect(res.body[0].name).toEqual(mockArr[0].name);
          expect(res.body[0].questions[0]).toEqual(mockArr[0].questions[0]);
          expect(res.body[0].questions[1]).toEqual(mockArr[0].questions[1]);
          expect(res.body[1]).toHaveProperty('_id');
          expect(res.body[1]).toHaveProperty('authId');
          expect(res.body[1].name).toEqual(mockArr[1].name);
          expect(res.body[0].questions[0]).toEqual(mockArr[0].questions[0]);
          expect(res.body[0].questions[1]).toEqual(mockArr[0].questions[1]);
        });
    });
    it('should return a 200 status and one truthyfalsy', () => {
      let mockCompare;
      return mocks.truthyfalsy.createOne()
        .then(() => mocks.truthyfalsy.createOne())
        .then(mock => {
          mockCompare = mock;
          return superagent.get(`${GAME_ENDPOINT}/${mock.truthyfalsy._id}`)
            .set('Authorization', `Bearer ${mock.profile.user.token}`)
            .send();
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('_id');
          expect(res.body).toHaveProperty('authId');
          expect(res.body.name).toEqual(mockCompare.truthyfalsy.name);
          expect(res.body.questions[0]).toEqual(mockCompare.truthyfalsy.questions[0]);
          expect(res.body.questions[1]).toEqual(mockCompare.truthyfalsy.questions[1]);
        });
    });
  });
  describe('Invalid auth', () => {
    it('should respond with a 401 not authorized', () => {
      return mocks.truthyfalsy.createOne()
      .then(() => mocks.truthyfalsy.createOne())
      .then(mock => {
        mock.truthyfalsy.questions = [];
        return superagent.get(`${GAME_ENDPOINT}/${mock.truthyfalsy._id}`)
          .send();
      })
      .then(response => console.log('error did not throw: res:', response))
      .catch(err => expect(err.status).toBe(401));
    });
  });
  describe('Invalid auth', () => {
    it('should respond with a 401 not authorized', () => {
      return mocks.truthyfalsy.createOne()
      .then(mock => {
        mock.truthyfalsy.questions = [];
        return superagent.get(`${GAME_ENDPOINT}/${mock.truthyfalsy._id}`)
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
        return superagent.get(`${GAME_ENDPOINT}/${mock.truthyfalsy._id}nope`)
          .set('Authorization', `Bearer ${mock.profile.user.token}`)
          .send();
      })
      .then(response => console.log('error did not throw: res:', response))
      .catch(err => expect(err.status).toBe(404));
    });
  });
  describe('Invalid route', () => {
    it('should respond with a 404 not found', () => {
      return mocks.truthyfalsy.createOne()
      .then(mock => {
        return superagent.get(`${GAME_ENDPOINT}//}`)
          .set('Authorization', `Bearer ${mock.profile.user.token}`)
          .send();
      })
      .then(response => console.log('error did not throw: res:', response))
      .catch(err => expect(err.status).toBe(404));
    });
  });
});
