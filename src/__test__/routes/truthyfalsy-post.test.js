'use strict';
require('jest');

describe('Truthy Falsy Post', function() {
  describe('Top Tier Test', () => {
    it('Should be truthy', () => {
      expect(true).toBeTruthy();
    });
  });
});