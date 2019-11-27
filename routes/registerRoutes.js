'use strict';
module.exports = function(app) {
  var registration = require('../controllers/registerController');


app.route('/')
   .get(registration.login);
   

app.route('/signup')
   .get(registration.signUp)
   .post(registration.createUser);

app.route('/home')
   .get(registration.home)
   .post(registration.checklogin);
app.route('/checkin')
   .get(registration.checkin)
   .post(registration.send_entry_detail);

app.route('/view')
   .get(registration.view)
   .post(registration.CheckoutUser);

app.route('/logout')
   .get(registration.logout);

};