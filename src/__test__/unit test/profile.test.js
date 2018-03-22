'use strict';

const Profile = require('../../model/profile.js');
require('jest');

describe('Profile Model', function() {
  let newProfile = new Profile();
  describe('Profile schema', () => {
    it('should create an object', () => {
      expect(newProfile).toBeInstanceOf(Object);
    });
    it('Should have the necessary properities', () => {
      expect(newProfile).toHaveProperty('firstName');
      expect(newProfile).toHaveProperty('games');
      expect(newProfile).toHaveProperty('authId');
    });
  });
});