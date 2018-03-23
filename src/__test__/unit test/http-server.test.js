'use strict';

import * as db from '../../lib/db';
import * as server from '../../lib/http-server';

afterAll(server.stop);

describe('server and db fail safes', () => {
  test('server should return an error if stopped while already off.', () => {
    return server.stop()
      .then(Promise.reject)
      .catch(error => {
        expect(error.message).toEqual('USAGE ERROR: the server is already off');
      });
  });

  test('db should return an error if you try to disconnect when not connected', () => {
    return db.stop()
      .then(Promise.reject)
      .catch(error => {
        expect(error.message).toEqual('USER ERROR: db is already disconnected');
      });
  });

  test('db should return an error if you try to connect while already connected', () => {
    return db.start(true)
      .then(Promise.reject)
      .catch(error => {
        expect(error.message).toEqual('PromiseReject called on non-object');
      });
  });

  test('server should return an error if you start it while it is already started', () => {
    return server.start(true)
      .then(Promise.reject)
      .catch(error => {
        expect(error.message).toEqual('USER ERROR: db is already connected');
      });
  });
});