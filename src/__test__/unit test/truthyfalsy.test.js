'use strict';

const TruthyFalsy = require('../../model/truthyfalsy');
require('jest');

describe('TruthyFalsy Model', function() {
  let game = new TruthyFalsy();
  describe('TruthyFalsy schema', () => {
    it('should create an object', () => {
      expect(game).toBeInstanceOf(Object);
    });
    it('Should have the necessary properities', () => {
      expect(game).toHaveProperty('name');
      expect(game).toHaveProperty('questions');
      expect(game).toHaveProperty('authId');
    });
  });
});
