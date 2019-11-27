var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Users = require('./models/UserModel'),
  Admins = require('./models/Admin'), //created model loading here
  bodyParser = require('body-parser'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  config = require('./config/mailer'),
  request = require("request");
// mongoose instance connection url connection
//mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/visitor', {useNewUrlParser: true});
mongoose.connect('mongodb://localhost/visitor', { useMongoClient: true })
//mongoose.connect("mongodb+srv://"+config.MONGO_ID+":"+config.MONGO_PASS+"@cluster0-7xfvn.mongodb.net/visitor", { useNewUrlParser: true });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));



var routes = require('./routes/registerRoutes'); //importing route
routes(app); //register the route


app.listen(port);


console.log('Server started on: ' + port);
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});