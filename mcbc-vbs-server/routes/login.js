var express = require('express');
var router = express.Router();
var path = require('path');

// Authentication
var authenticate = require('./api/auth');
router.post('/', authenticate);

module.exports = router;
