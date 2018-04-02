let express = require('express');
let router = express.Router({ strict: true });
let userModel = require('../models/users');
let groupModel = require('../models/groups');
let dateFormat = require('dateformat');
let md5 = require('md5');
// let redis = require("redis");
// let client = redis.createClient();

/**
 * Index
 */
router.get('/', function (req, res) {
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
            permission: req.session.user.permission.users,
            url: req.originalUrl
        });
        return res.end();
    });
});

/**
 * Data
 */
router.post('/data', function (req, res) {
    let _id = req.body._id;
    if(_id !== undefined){
        userModel.findOne({_id: _id, removed: false}, '_id fullname username phone email gender address group', function (err, item) {
            if(err){
                return res.json({status: 0, message: err.message});
            }
            return res.json({status: 1, item: item});
        });
    } else{
        // console.log(req.body);
        let filter = {removed:false};
        userModel.count(filter, function(err, count){
            if(!err){
                // if(req.body.id !== undefined && req.body.id !== ''){
                //     filter.id = req.body.id;
                // }
                if(req.body.fullname !== undefined && req.body.fullname !== ''){
                    filter.fullname = {$regex: req.body.fullname, $options: 'i'};
                }
                if(req.body.username !== undefined && req.body.username !== ''){
                    filter.username = req.body.username;
                }
                if(req.body.phone !== undefined && req.body.phone !== ''){
                    filter.phone = {$regex: req.body.phone, $options: 'i'};
                }
                if(req.body.email !== undefined && req.body.email !== ''){
                    filter.email = {$regex: req.body.email, $options: 'i'};
                }
                if(req.body.gender !== undefined && req.body.gender !== ''){
                    filter.gender = {$regex: req.body.gender, $options: 'i'};
                }
                if(req.body.address !== undefined && req.body.address !== ''){
                    filter.address = {$regex: req.body.address, $options: 'i'};
                }
                if(req.body.group !== undefined && req.body.group !== ''){
                    filter.group = {$regex: req.body.group, $options: 'i'};
                }
                userModel.find(filter, '_id fullname username phone email gender address group', {sort: {_id: 'asc'}}, function (err, docs) {
                    if(err){
                        return res.json({status: 0, data: []});
                    }
                    let set = [];
                    let index = 0;
                    docs.forEach(function (item) {
                        set.push([null, item._id, ++index, item.fullname, item.username, item.phone,
                            item.email, item.gender, item.address, item.group
                        ]);
                    });
                    return res.json({status: 1, data: set, draw: req.body.draw, recordsTotal: count, recordsFiltered: index});
                });
            } else{
                return res.json({status: 1, data: [], draw: 1, recordsTotal: 0, recordsFiltered: 0});
            }
        });
    }
});

/**
 * Remove
 */
router.post('/remove', function (req, res) {
    let list = req.body.list;
    if(list === undefined){
        return res.json({status: 0, message: 'Chưa chọn dòng để xóa!'});
    }
    return new Promise(function(resolve, reject){
        let set = {
            modified: dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss"),
            removed: 1
        };
        userModel.update({ '_id': {$in: list.split(',')} }, { $set: set }, { multi: true }, function (err, result) {
            if (err) {
                return reject(new Error(err.message));
            }
            return resolve(result._id);
        });
    }).then(function(message){
        return res.json({status: 1, message: message});
    }).catch((err) => { return res.json({status: 1, message: err.message}); });
});

/**
 * Save
 */
router.post('/save', function (req, res) {
    req = req.body;
    userModel.count({ username: req.username, removed: false }, function (err, counter) {
        if (err) {
            return res.json({status: 0, message: err.message});
        } else {
            if (counter > 0) {
                if(req._id !== ''){
                    return new Promise(function(resolve, reject){
                        let set = {
                            modified: dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss"),
                            fullname: req.fullname,
                            phone: req.phone,
                            email: req.email,
                            address: req.address,
                            gender: req.gender,
                            group: req.group
                        };
                        if(req.avatar !== ''){
                            set.avatar = req.avatar;
                        }
                        if(req.password !== ''){
                            set.password = md5(req.password);
                        }
                        userModel.update({ '_id': req._id }, { $set: set }, function (err, result) {
                            if (err) {
                                return reject(new Error(err.message));
                            }
                            return resolve(result._id);
                        });1
                    }).then(function(message){
                        return res.json({status: 1, message: message});
                    }).catch((err) => { return res.send(err.message) });
                } else{
                    return res.json({status: 0, message: 'Tài khoản bị trùng!'});
                }
            } else {
                return new Promise(function(resolve, reject){
                    let user = new userModel();
                    user.fullname = req.fullname;
                    user.username = req.username;
                    user.password = md5(req.password);
                    user.phone = req.phone;
                    user.email = req.email;
                    user.address = req.address;
                    user.gender = req.gender;
                    user.avatar = req.avatar;
                    user.group = req.group;
                    user.save(function (err, result) {
                        if (err) {
                            return reject(new Error(err.message));
                        }
                        return resolve(result._id);
                    });
                }).then(function(message){
                    return res.json({status: 1, message: message});
                }).catch((err) => { return res.send(err.message) });
            }
        }
    });
});

module.exports = router;