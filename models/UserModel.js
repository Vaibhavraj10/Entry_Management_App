'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.createConnection("mongodb://localhost/entry"));


/*var AdminSchema = new Schema({
  userName : String,
  password : {
    type: String,
    minlen: 6
  }
});
*/

var UserSchema = new Schema({
  visitorName: {
    type: String,
    required: 'Please enter the name'
  },
  visitorEmail: {
    type: String,
    required: 'enter the email'
  },
  visitorPhone: {
    type: String,
    maxlen: 10,
    minlen: 10
  },
  visitorCheckin: {
    type: String
  },
  visitorCheckout: {
    type: String
  },

  hostName: {
    type: String,
    required: 'Please enter the name'
  },
  hostEmail: {
    type: String,
    required: 'enter the email'
  },
  hostPhone: {
    type: String,
    maxlen: 10,
    minlen: 10
  },
  isCheckout: Boolean,
  //timestamps: true,


});
/*
var HostSchema = new Schema({
  name: {
    type: String,
    required: 'Please enter the name'
  },
  email: {
    type: String,
    required: 'enter the email'
  },
  phone: {
    type: String,
    maxlen: 10,
    minlen: 10
  }

  timestamps: true


});
*/

UserSchema.plugin(autoIncrement.plugin, {
  model: 'Users',
  field: '_id',
  startAt: 1,
  incrementBy: 1

  });
module.exports = mongoose.model('Users', UserSchema);
//module.exports = mongoose.model('Hosts', HostSchema);

