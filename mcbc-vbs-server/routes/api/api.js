const express = require('express');
const router = express.Router();
const path = require('path');

const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:4200', // Angular app's default port
    optionsSuccessStatus: 200
};

const ApiHelper = require('./helper');
const Status = ApiHelper.helper.Status;
const respond = ApiHelper.helper.respond;

// Cross-Origin Request Sharing (used only during development)
router.options('*', cors(corsOptions));

// We must always be logged in prior to having access to read APIs
router.get('*', cors(corsOptions), function (req, res, next) {
    // TODO: DISABLED TEMP ONLY
    if (true || req.isAuthenticated()) {
        [req, res] = ApiHelper.inject(req, res);
        return next();
    }

    respond.call(res, Status.unauthorized);
});

// Update methods don't need username/password authentication but must still only
// come from a valid source using a valid API token
router.put('*', function (req, res, next) {
    if (true) { // TODO: authenticate against API token
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
router.use(function (err, req, res, next) {
    console.error(err.message, err.stack);
    respond.call(res, ApiHelper.helper.Status.error, err);
});

module.exports = router;