var express = require('express');
var path = require('path');

/// Let's begin

var app = express();

/// Development/Production

app.set('env', process.env.NODE_ENV || 'development');

// view engine setup
// note: we still keep some views to fallback if angular or whatever fails
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var favicon = require('serve-favicons');
app.use(favicon({
  '/favicon.ico': path.join(__dirname, 'favicon', 'favicon.ico'),
  '/apple-touch-icon.png': path.join(__dirname, 'favicon', 'apple-touch-icon.png'),
  '/favicon-32x32.png': path.join(__dirname, 'favicon', 'favicon-32x32.png'),
  '/favicon-16x16.png': path.join(__dirname, 'favicon', 'favicon-16x16.png'),
  '/manifest.json': path.join(__dirname, 'favicon', 'manifest.json'),
  '/safari-pinned-tab.svg': path.join(__dirname, 'favicon', 'safari-pinned-tab.svg'),
}));

var logger = require('./logger');
app.use(logger);

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/// Cookies and Sessions

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var session = require('express-session');
app.set('trust proxy', 1); // trust first proxy
app.use(session({
   secret: 'b0nf1y4h'
   , resave: false
   , saveUninitialized: false
   , cookie: {
      // secure is not working as planned...
      //secure: app.get('env') === 'production',
      maxAge: 1 * 60 * 60 * 1000
   }
}));

var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
var flash = require('connect-flash');
app.use(flash());

/// Security

var helmet = require('helmet');
app.use(helmet());

/// Env settings

/// Database

const db = require('./db'); // should never be require'd again!

/// Routes

// Data analysis backend
var login = require('./routes/login');
app.use('/login', login);
var logout = require('./routes/logout');
app.use('/logout', logout);
var admin = require('./routes/admin');
app.use('/admin', admin);
var api = require('./routes/api/api.js');
app.use('/api', api);

// Serve the main angular frontend
app.use(express.static(path.join(__dirname, './ui/dist')));
// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './ui/dist/index.html'));
});


/// Catch-alls

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  return next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // log the error
  console.error(`Error: message: ${err.message}\nstatus: ${err.status}\nstack: ${err.stack}`);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
