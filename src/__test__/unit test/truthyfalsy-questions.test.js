'use strict';

const TFQuestion = require('../../model/truthyfalsy-questions.js');
require('jest');

describe('Truthy Falsy Model', function() {
  let newTf = new TruthyFalsy();
  describe('Truthy Falsy schema', () => {
    it('should create an object', () => {
      expect(newTf).toBeInstanceOf(Object);
    });
    it('Should have the necessary properities', () => {
      expect(newTf).toHaveProperty('question');
      expect(newTf).toHaveProperty('answer');
    });
  });
});