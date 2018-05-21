let express = require('express');
let router = express.Router();
let userModel = require('../models/users');
let groupModel = require('../models/groups');
let md5 = require('md5');

/**
 * Index
 */
router.get('/', function (req, res) {
    if (!req.session.user) {
        return res.redirect('/backend/auth?page='+req.originalUrl);
    }
    if(req.session.user.permission.dashboard.view === undefined){
        return res.redirect('/backend/request-access?page='+req.originalUrl);
    }
    res.render('backend/index.pug', {
        title: 'Dashboard',
        user: req.session.user,
        maps: global.vietnamProvince.map()
    });
});

/**
 * Login
 */
router.get('/auth', function (req, res, next) {
    req.session.destroy();
    let page = req.query.page;
    if(page === undefined){
        page = '/backend/products/';
    }
    res.render('backend/auth.pug', {
        title: 'Auth page',
        page: page
    });
}).post('/auth', function (req, res) {
    userModel.findOne({username: req.body.username, removed: false}, '_id fullname username password email avatar group', function (err, item) {
        if(err){
            res.redirect('/backend/auth?page='+req.body.page);
        } else if(!item){
            res.redirect('/backend/auth?page='+req.body.page);
        } else if(item.password !== md5(req.body.password)){
            res.redirect('/backend/auth?page='+req.body.page);
        } else{
            item = item.toObject();
            groupModel.findOne({key: item.group, removed: false}, '_id permission', function (err, doc) {
                if(err){
                    res.redirect('/backend/auth?page='+req.body.page);
                } else{
                    if(item.avatar === '' || item.avatar === undefined){
                        item.avatar = '/public/backend/images/icon/leon.jpg';
                    }
                    item.permission = doc.permission;
                    req.session.user = item;
                    res.redirect(req.body.page);
                }
            });
        }
    });
});

/**
 * Login
 */
router.get('/request-access', function (req, res, next) {
    // req.session.destroy();
    let page = req.query.page;
    if(page === undefined){
        page = '/backend';
    }
    res.render('backend/request.pug', {
        title: 'Permission denied',
        page: page
    });
});

/**
 * Index
 */
router.get('/filemanager', function (req, res) {
    res.render('backend/includes/_filemanager.ejs', {
        title: 'Dashboard'
    });
});

module.exports = router;