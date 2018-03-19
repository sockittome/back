'use strict';

const mongoose = require('mongoose');
const Auth = require('./auth');

const Profile = mongoose.Schema({
  firstName: {type: String, required: true},
  games: [],
  authId: {type: mongoose.Schema.Types.ObjectId, ref: 'auth', required: true},
});

module.exports = mongoose.model('profile', Profile);

