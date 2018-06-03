const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../../models/user').model;
const ERROR = new Error('Failed to authenticate.'); // we wish to maintain the same error message for both username and password authentication failures for security purposes

passport.use(new LocalStrategy(
   function(username, password, done) {
      User.findOne({username: username}, function (err, user) {
         if (err)
            return done(err);

         // Incorrect username
         if (!user)
            return done(null, false, { message: ERROR });

         // Incorrect password
         if (!user.validPassword(password))
            return done(null, false, { message: ERROR });

         // Authentication successful!
         user.last_login = new Date();
         return done(null, user);
      });
   }
));

passport.serializeUser(function(user, done) {
   done(null, user.username);
});

passport.deserializeUser(function(username, done) {
   User.findByUserName(username)
       .then(user => done(null, user))
       .catch(err => done(err));
});

const Status = require('./helper').helper.Status;
module.exports = function (req, res, next) {
   passport.authenticate('local', function (err, user, info) {
      if (err) { return next(err); }

      // Authentication failed if user was not set
      if (!user) {
         return res.respond(Status.unauthorized)
      }

      // Otherwise, authentication succeeded...
      req.logIn(user, function (err) {
         if (err) { return next(err); }

         return res.respond(Status.ok);
      });
   })(req, res, next);
};