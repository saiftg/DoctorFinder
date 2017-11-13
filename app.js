var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const Auth0Lock = require('auth0-lock');
var auth0 = require('auth0-js');


const strategy = new Auth0Strategy(
  {
    domain: 'smdigitalcrafts.auth0.com',
    clientID: 'Ra_Fi5ZaAbpyRZDRD7x2fLeIaVAWgo0I',
    clientSecret: "TXW4JxXerJCvuGsFS7rwSQVP52vW1h8d-W8texMtpU0FWwlwl3q_T2u5YmsAhJTS",
    callbackURL: 'http://localhost:3000/welcome'
  },


  (accessToken, refreshToken, extraParams, profile, done) => {
    return done(null, profile);
  }

);

// var webAuth = new auth0.WebAuth({
//   domain:       'smdigitalcrafts.auth0.com',
//   clientID:     'Ra_Fi5ZaAbpyRZDRD7x2fLeIaVAWgo0I'
// });

// const lock = new Auth0Lock(
// {
//   domain: 'Ra_Fi5ZaAbpyRZDRD7x2fLeIaVAWgo0I',
//   clientID: 'smdigitalcrafts.auth0.com'
// },

//   {
//     auth: {
//       redirect: false
//     }
//   }
// );



passport.use(strategy);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: 'shhhhhhhhh',
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());




app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/user', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
