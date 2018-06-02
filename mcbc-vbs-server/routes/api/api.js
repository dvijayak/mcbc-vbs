const express = require('express');
const router = express.Router();
const path = require('path');

const ApiHelper = require('./helper');
const Status = ApiHelper.helper.Status;
const respond = ApiHelper.helper.respond;

// We must always be logged in prior to having access to read APIs
router.get('*', function(req, res, next) {
   if (req.isAuthenticated()) {
      [req, res] = ApiHelper.inject(req, res);
      return next();
   }

   respond.call(res, Status.unauthorized);
});

// Update methods don't need username/password authentication but must still only
// come from a valid source using a valid API token
router.put('*', function (req, res, next) {
   if (true) { // CANIMPROVE: authenticate against API token
      [req, res] = ApiHelper.inject(req, res);
      return next();
   }

   respond.call(res, Status.unauthorized);
});

// Resources
const child = require('./child.js');
router.use('/child', child);

const volunteer = require('./volunteer.js');
router.use('/volunteer', volunteer);

// 404 catch-all
router.all('*', function (req, res) {
   res.respond(Status.missing);
});

// Basic error handler
router.use(function(err, req, res, next) {
   console.error(err.message, err.stack);
   respond.call(res, ApiHelper.helper.Status.error, err);
});

module.exports = router;