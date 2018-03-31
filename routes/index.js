var express = require('express');
var router = express.Router();

/* Home page. */
router.get('/', function (req, res) {
    return res.redirect('/frontend/');
});

module.exports = router;
