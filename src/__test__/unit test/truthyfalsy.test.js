'use strict';

const TruthyFalsy = require('../../model/truthyfalsy.js');
require('jest');

describe('Truthy Falsy Questions Model', function() {
  let newTfq = new TFQuestion();
  describe('Truthy Falsy Questions schema', () => {
    it('should create an object', () => {
      expect(newTfq).toBeInstanceOf(Object);
    });
    it('Should have the necessary properities', () => {
      expect(newTfq).toHaveProperty('name');
      expect(newTfq).toHaveProperty('questions');
    });
  });
});