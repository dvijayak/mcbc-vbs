var express = require('express');
var router = express.Router();

// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MCBC VBS 2017' });
});

module.exports = router;
