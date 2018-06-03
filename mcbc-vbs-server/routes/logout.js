var express = require('express');
var router = express.Router();

router.post('/', function (req, res) {
    req.logout(); // assumes the use of passport
    res.end();
});

module.exports = router;