

const mongoose = require('mongoose');
const Profile = require('./profile');

const TruthyFalsy = mongoose.Schema({
  name: {type: String, required: true},
  questions: [],
  authId: {type: mongoose.Schema.Types.ObjectId, ref: 'auth', required: true},
});

TruthyFalsy.pre('save', function(next) {
  Profile.findOne({ authId: this.authId })
    .then(host => {
      host.games = [...new Set(host.games).add(this._id)];
      host.save();
    })
    .then(next)
    .catch(() => next(new Error('Validation Error, failed to save game')));
});

TruthyFalsy.post('remove', function(doc, next) {
  Profile.findById(doc.authId)
    .then(host => {
      host.games = host.games.filter(v => v.toString() !== doc._id.toString());
      host.save();
    })
    .then(next)
    .catch(next);
});

module.exports = mongoose.model('truthyFalsy', TruthyFalsy);
