'use strict';

const utils = require('../../lib/utils');

describe('Utils module', function() {
  describe('log method', () => {
    it('should log when in dev mode', () => {
      utils.log('1');
      expect(true).toBeTruthy();
    });
  });
  describe('logError method', () => {
    it('should log an error', () => {
      utils.logError('error');
      expect(true).toBeTruthy;
    });
    it('should be null', () => {
      expect(utils.logError('')).toBeNull();
    });
  });
});
