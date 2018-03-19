'use strict';

const mongoose = require('mongoose');
const Auth = require('./auth');

const Profile = mongoose.Schema({
  username: {type: String, required: true},
  games: [{type: mongoose.Schema.Types.ObjectId, ref: 'truthyFalsey'}],
  authId: {type: mongoose.Schema.Types.ObjectId, ref: 'auth', required: true},
});

module.exports = mongoose.model('profile', Profile);

