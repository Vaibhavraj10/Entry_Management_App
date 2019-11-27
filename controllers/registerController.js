//'use strict';

const express = require('express');
const router = express.Router();
const mailer = require('../misc/mailer');
//const User = require('../models/users');
const Nexmo = require('nexmo');
const config = require('../config/mailer');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const request = require("request");

const app = express();

const accountSid = config.twilio_user;
const authToken = config.twilio_pass;
const client = require('twilio')(accountSid, authToken);






const nexmo = new Nexmo({
  apiKey: config.NEXMO_API_KEY,
  apiSecret: config.NEXMO_API_SECRET,
});




var mongoose = require('mongoose'),
  User = require('../models/UserModel'),
  Admin = require('../models/Admin');
  //Host = mongoose.model('Hosts');

//Admin.plugin(passportLocalMongoose);
//Admin.plugin(findOrCreate);

//GET METHODS
exports.login = function(req, res){
  res.render("login", {isCorrect: 1});
}

exports.signUp = function(req, res) {
  res.render("signup");
}

exports.home = function(req, res) {
 Admin.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return res.render("error");;
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return res.render("error");
        } else {
          return res.render("home");
        }
      }
    });
}

exports.checkin = function(req, res) {
  Admin.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return res.render("error");;
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return res.render("error");
        } else {
          res.render("checkin");
        }
      }
    });


  
}

exports.view = function(req, res) {
 
 Admin.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return res.render("error");;
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return res.render("error");
        } else {
          
           User.find({}, function(err, totalCheckin){
    if(err)
      console.log(err);
    else
    res.render("view-record", {newVisitors: totalCheckin});
  });


        }
      }
    });


  
  
}


//POST Methods 
exports.checklogin = function(req, res) {
    const username= req.body.username;
    const password = req.body.password;

    if(username && password){
      Admin.authenticate(username, password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return res.render("error");
      } else {
        req.session.userId = user._id;
        return res.redirect('/home');
      }
    });
    }
    else {
      var err = new Error('All fields required.');
      err.status = 400;
      return res.render("error");
    }

};

exports.logout= function (req, res) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return res.send("Error");
      } else {
        return res.redirect('/');
      }
    });
  }
};



exports.createUser = function(req,res) {
            

             var userData = {
             username: req.body.username,
             password: req.body.password,
             }

     Admin.create(userData, function (error, user) {
      if (error) {
        return res.render("error");
      } else {
        req.session.userId = user._id;
        return res.redirect('/home');
      }
    });
          
}

exports.CheckoutUser = async function(req, res) {
  var checkedItemId = req.body.id;
  console.log("Received id " + checkedItemId);
  //console.log(User.find({_id: checkedItemId}).visitorName);
  
  var filter = { _id: checkedItemId};
  var update = { isCheckout: true};
  let doc = await User.findOne(filter);
  console.log(" Is the selected item checked? " +doc.isCheckout);
  if(doc.isCheckout == false)
  {
    const html = `Hi ${doc.visitorName},
      <br/>
      Thank you for visiting the office!
      <br/><br/>
      Here are the details of your stay:
      <br/>
      Name: <b>${doc.visitorName}</b>
      <br/>
      Phone number: <b>${doc.hostPhone}</b>
      <br/>
      Checkin Time: <b>${doc.visitorCheckin}</b>
      <br/>
      Checkout Time: <b>${doc.visitorCheckout}</b>
      <br/>
      Host Name: <b>${doc.hostName}</b>
      <br/>
      Address: <b>New Delhi</b>
      <br/>
      Have a pleasant day!` 
     
      console.log("sending email for Checkout");
      // Send email
      await mailer.sendEmail(config.SENDER_EMAIL, doc.visitorEmail, 'Thank you for visiting!', html);
      console.log("Email sent");
  }

  doc = await User.findOneAndUpdate(filter, update);
  res.render("checkout");

}


exports.send_entry_detail = async function(req, res) {
  try {
      var Checkin;
      var Checkout;
     var editCheckin = req.body.visitorCheckin;
     var part = editCheckin.split(':');
     if(parseInt(part[0])==0){
      console.log("in first if of check in");
      Checkin = '12' + ':' + part1[1] + ' AM';

     }
     else if(parseInt(part[0])>12){
      console.log("in 2nd first if of check in");
      var hr = parseInt(part[0])-12;
      Checkin = String(hr) + ':' + part[1] + ' PM';
     }
     else{
      console.log("in last if of check in");
      var hr = part[0];
      Checkin = hr + ':' + part[1] + ' AM';
     }
     
     console.log(Checkin);
     
     var editCheckout = req.body.visitorCheckout;
     var part1 = editCheckout.split(':');
     if(parseInt(part1[0])==0){
      console.log("in first if of check out");
      Checkout = '12' + ':' + part1[1] + ' AM';
     }
     else if(parseInt(part1[0])>12){
      var hr = parseInt(part1[0])-12;
      Checkout = String(hr) + ':' + part1[1] + ' PM';
     }
     else{
      var hr = part1[0];
      Checkout = hr + ':' + part1[1] + ' AM';
     }
  
    console.log(Checkin + "  " + Checkout);



     var user = new User({ visitorName: req.body.visitorName, visitorEmail: req.body.visitorEmail, 
      visitorPhone: req.body.visitorPhone, visitorCheckin: Checkin , visitorCheckout: Checkout,
      hostName: req.body.hostName, hostEmail: req.body.hostEmail, hostPhone: req.body.hostPhone, isCheckout: false });  

     //var host = new Host({ name: req.body.hostName, email: req.body.hostEmail, phone: req.body.hostPhone});  
     console.log("Going to save it");
      user.save(function(err, user) {
      if (err)
      res.send(err);
      else {
         user.nextCount(function(err, count) {
         console.log("Next count is " + count);


      })
    } } );

      /*host.save(function(err, host) {
      if (err)
      res.send(err);
      });
      */
       
     

      // Compose email
      const html = `Hi ${req.body.hostName},
      <br/>
      There is a new visitor in the office!
      <br/><br/>
      Here are the details of the visitor:
      <br/>
      Name: <b>${req.body.visitorName}</b>
      <br/>
      Email: <b>${req.body.visitorEmail}</b>
      <br/>
      Phone number: <b>${req.body.visitorPhone}</b>
      <br/>
      Checkin Time: <b>${Checkin}</b>
      <br/>
      Checkout Time: <b>${Checkout}</b>
      <br/>
      Have a pleasant day!` 

      // Send email

      console.log("sending email for Checkin");
      await mailer.sendEmail(config.SENDER_EMAIL, req.body.hostEmail, 'New visitor!', html);
      console.log("Email sent");

      const from = config.SENDER_NUMBER;
      const to = req.body.hostPhone;
      const text = 'Hi ' + req.body.hostName + 
      '! There is a new visitor in the office!' +
      ' Here are the details of the visitor: ' +
      'Name: ' + req.body.visitorName +
      '   Email: ' + req.body.visitorEmail +
      '   Phone number: ' + req.body.visitorPhone +
      '   Checkin Time: ' + Checkin +
      '   Checkout Time: ' + Checkout +
      '   Have a pleasant day!' ;


      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
      var options = { method: 'GET',
      url: 'https://global.datagenit.com/API/sms-api.php',
      qs: 
      { auth: config.SMS_ID,
        senderid: 'TXTSMS',
        msisdn: to,
        message: text },
        headers: 
      {'cache-control': 'no-cache' } };

request(options, function (error, response, body) {
if (error) throw new Error(error);

console.log(body);
});
      
      /*client.messages.create({
     body: text,
     from: from,
     to: to
   })
  .then(message => console.log(message.sid));
      */
      //nexmo.message.sendSms(from, to, text);
      
      
      //console.log(user.secretToken);
      res.render('thank-you');
    } catch(error) {
      console.log("sms not sent");
      res.send("Error in sending sms!");
    }
  
};



