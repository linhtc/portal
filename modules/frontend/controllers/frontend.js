var express = require('express');
var router = express.Router();

/**
 * Index frontend
 */
router.get('/', function (req, res, next) {
    res.render('frontend/index.pug', {
        title: 'E-commerce page',
    });
});

module.exports = router;