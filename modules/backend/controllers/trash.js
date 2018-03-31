let express = require('express');
let router = express.Router({ strict: true });
let userModel = require('../models/users');
let groupModel = require('../models/groups');
let dateFormat = require('dateformat');
let md5 = require('md5');
let redis = require("redis");
let client = redis.createClient();

/**
 * Index
 */
router.get('/', function (req, res) {
    let group = new groupModel();
    group.key = 'admin';
    group.name = 'Admin';
    group.permission = {
        dashboard: {view: true},
        members: {view: true, create: true, edit: true, remove: true, import: true, export: true},
        users: {view: true, create: true, edit: true, remove: true, import: true, export: true, approval: true},
        criteria: {view: true, create: true, edit: true, remove: true}
    };
    group.save(function (err, result) {
        if (err) {
            console.log(err.message);
        }
        console.log(result);
    });

    group = new groupModel();
    group.key = 'quantri';
    group.name = 'Quản trị';
    group.permission = {
        dashboard: {view: true},
        members: {view: true, create: true, edit: true, remove: true, import: true, export: true},
        users: {view: true, create: true, edit: true, remove: true, import: true, export: true, approval: true},
        criteria: {view: true}
    };
    group.save(function (err, result) {
        if (err) {
            console.log(err.message);
        }
        console.log(result);
    });

    group = new groupModel();
    group.key = 'thanhvien';
    group.name = 'Thành viên';
    group.permission = {
        dashboard: {view: true},
        evaluation: {view: true, edit: true}
    };
    group.save(function (err, result) {
        if (err) {
            console.log(err.message);
        }
        console.log(result);
    });

    console.log(req);

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
        res.render('backend/users/index.pug', {
            title: 'Người dùng',
            user: req.session.user,
            groups: docs,
            permission: req.session.user.permission.users
        });
        return res.end();
    });
});

module.exports = router;