'use strict';
var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;


var AdminSchema = new Schema({
  username : {
  	type: String,
  	unique: true,
  	required: true,
  	trim: true
  },
  password : {
    type: String,
    required: true,
    minlen: 6
  }
});

AdminSchema.statics.authenticate = function (username, password, callback) {
  Admin.findOne({ username: username })
    .exec(function (err, user) {
      if (err) {
        return callback(err);
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

//hashing a password before saving it to the database
AdminSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});



var Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;