let express = require('express');
let router = express.Router({ strict: true });
let userModel = require('../models/users');
let groupModel = require('../models/groups');
let dateFormat = require('dateformat');
let md5 = require('md5');
// let redis = require("redis");
// let client = redis.createClient();

router.get('/artical/view', function (req, res) {
    if (!req.session.user) {
        return res.redirect('/backend/auth?page='+req.originalUrl);
    }
    if(req.session.user.permission.users === undefined || req.session.user.permission.users.view === undefined){
        return res.redirect('/backend/request-access?page='+req.originalUrl);
    }
    groupModel.find({removed:false}, '_id key name', {sort: {_id: 'asc'}}, function (err, docs) {
        if(err){
            return res.json({status: 0, data: []});
        }
        res.render('backend/articals/view.pug', {
            title: 'Bài Viết',
            user: req.session.user,
            groups: docs,
            permission: req.session.user.permission.users,
            url: req.originalUrl
        });
        return res.end();
    });
});

module.exports = router;