var express = require('express');
var router = express.Router();

// Authentication
var authenticate = require('./api/auth');
router.post('/', authenticate);

module.exports = router;
