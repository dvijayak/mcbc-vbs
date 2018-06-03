const express = require('express');
const router = express.Router();

const Status = require('./api/helper').helper.Status;

// Inform the client whether the user's session is still valid
router.post('/', function (req, res) {
    if (req.isAuthenticated()) {
        return res.respond(Status.ok);
    }

    return res.respond(Status.unauthorized);
});

module.exports = router;
