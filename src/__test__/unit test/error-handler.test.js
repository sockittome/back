'use strict';

const errHand = require('../../middleware/error-handler');
require('jest');

describe('error-handler', function() {

  this.res = {status: function(stat){this.statusCode = stat; return this; }, send: function(msg){this.message  = msg; return this;}};

  this.validation = new Error('Validation error');

  this.pathError = new Error('path error');

  this.authorization = new Error('authorization');

  this.objectId = new Error('objectid failed');

  this.duplicate = new Error('duplicate key');

  this.fail = new Error('fail');

  it('should respond with a status of 400', () => {
    let errRes = errHand(this.validation, this.res);
    expect(errRes.statusCode).toEqual(400);
  });
  it('should respond with a status of 401', () => {
    let errRes = errHand(this.authorization, this.res);
    expect(errRes.statusCode).toEqual(401);
  });
  it('should respond with a status of 404', () => {
    let errRes = errHand(this.pathError, this.res);
    expect(errRes.statusCode).toEqual(404);
  });
  it('should respond with a status of 404', () => {
    let errRes = errHand(this.objectId, this.res);
    expect(errRes.statusCode).toEqual(404);
  });
  it('should respond with a status of 409', () => {
    let errRes = errHand(this.duplicate, this.res);
    expect(errRes.statusCode).toEqual(409);
  });
  it('should respond with a status of 500', () => {
    let errRes = errHand(this.fail, this.res);
    expect(errRes.statusCode).toEqual(500);
  });
});
