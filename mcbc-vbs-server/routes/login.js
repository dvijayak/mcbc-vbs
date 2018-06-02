var express = require('express');
var router = express.Router();
var path = require('path');

// Authentication
var authenticate = require('./api/auth');
router.post('/', authenticate);

// Serve the angular-based login page
router.use(express.static(path.join(__dirname, '../ui-login/dist')));

module.exports = router;
