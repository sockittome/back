'use strict';

const truthyfalsy = require('../../game/truthyfalsy');
require('jest');

describe('dummy test', () => {
  it('should be a function', () => {
    expect(typeof truthyfalsy).toBe('function');
    expect(true).toBeTruthy();
  });
});

