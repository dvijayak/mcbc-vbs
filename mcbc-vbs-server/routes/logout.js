var express = require('express');
var router = express.Router();

router.all('/', function (req, res) {
   req.logout(); // assumes the use of passport
   res.redirect('/');
});

module.exports = router;