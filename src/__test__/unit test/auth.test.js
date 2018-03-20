'use strict';

const Auth = require('../../model/auth.js');
require('jest');

describe('Auth Model', function() {
  let newUser = new Auth();
  describe('Auth schema', () => {
    it('should create a object', () => {
      expect(newUser).toBeInstanceOf(Object);
    });
    it('should have a property of start date', () =>{
      expect(newUser).toHaveProperty('username');
    });
    
    it('should should fail if no password passed to generatePasswordHash ', () =>{
      return newUser.generatePasswordHash()
        .catch(response => {
          expect(response.message).toMatch(/Authorization failed\. Password required/);
        });
    });
    it('should should fail if no password password to comparePasswordHash', () =>{
      return newUser.comparePasswordHash()
        .catch(response => {
          expect(response.message).toMatch(/data and hash arguments required/);
        });
    });
  });

});