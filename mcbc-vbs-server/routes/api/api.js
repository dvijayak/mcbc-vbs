const express = require('express');
const router = express.Router();

const Status = require('./helper').helper.Status;

// We must always be logged in prior to having access to read APIs
router.get('*', function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.respond(Status.unauthorized);
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
    res.respond(Status.error, err);
});

module.exports = router;