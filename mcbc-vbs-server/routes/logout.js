var express = require('express');
var router = express.Router();

// TODO: Should phase this out and turn it into a POST request instead, which the client can respond to and route by itself
router.post('/', function (req, res) {
    req.logout(); // assumes the use of passport
    res.redirect('/');
});

module.exports = router;