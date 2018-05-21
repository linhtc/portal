let express = require('express');
let router = express.Router({ strict: true });
let productModel = require('../models/products');
let kindModel = require('../models/kinds');
let dateFormat = require('dateformat');
// let md5 = require('md5');
// let redis = require("redis");
// let client = redis.createClient();

/**
 * Index
 */
router.get('/', function (req, res) {
    if (!req.session.user) {
        return res.redirect('/backend/auth?page='+req.originalUrl);
    }
    if(req.session.user.permission.products === undefined || req.session.user.permission.products.view === undefined){
        return res.redirect('/backend/request-access?page='+req.originalUrl);
    }

    kindModel.find({removed:false}, '_id kind name', {sort: {_id: 'asc'}}, function (err, docs) {
        if(err){
            return res.json({status: 0, data: []});
        }
        res.render('backend/products/index.pug', {
            title: 'Sản phẩm',
            user: req.session.user,
            permission: req.session.user.permission.products,
            kinds: docs,
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
        productModel.findOne({_id: _id, removed: false}, '_id name kind icon price quantity status', function (err, item) {
            if(err){
                return res.json({status: 0, message: err.message});
            }
            return res.json({status: 1, item: item});
        });
    } else{
        // console.log(req.body);
        let filter = {removed:false};
        productModel.count(filter, function(err, count){
            if(!err){
                // if(req.body.id !== undefined && req.body.id !== ''){
                //     filter.id = req.body.id;
                // }
                if(req.body.name !== undefined && req.body.name !== ''){
                    filter.name = {$regex: req.body.name, $options: 'i'};
                }
                if(req.body.kind !== undefined && req.body.kind !== ''){
                    filter.kind = {$regex: req.body.kind, $options: 'i'};
                }
                if(req.body.price !== undefined && req.body.price !== ''){
                    filter.price = req.body.price;
                }
                if(req.body.quantity !== undefined && req.body.quantity !== ''){
                    filter.quantity = {$regex: req.body.quantity, $options: 'i'};
                }
                if(req.body.status !== undefined && req.body.status !== ''){
                    filter.status = {$regex: req.body.status, $options: 'i'};
                }
                if(req.body.modified !== undefined && req.body.modified !== ''){
                    filter.modified = {$regex: req.body.modified, $options: 'i'};
                }

                productModel.count(filter, function (err, filtered) {
                    if(err){
                        return res.json({status: 0, data: []});
                    }
                    try{
                        let maps = ['_id', '_id', '_id', 'name', 'kind', 'price', 'quantity', 'status', 'modified'];
                        let order = parseInt(req.body['order[0][column]']);
                        let dir = req.body['order[0][dir]'];
                        let sort = {};
                        sort[maps[order] !== undefined ? maps[order] : _id] = dir;
                        let start = parseInt(req.body.start);
                        let length = parseInt(req.body.length);
                        let query = productModel.find(filter, '_id name kind price quantity status modified')
                            .sort(sort)
                            .skip(start).limit(length)
                        ;
                        query.exec(function (err, docs) {
                            if(err){
                                return res.json({status: 0, data: []});
                            }
                            let set = [];
                            let index =  dir === 'desc' ? (start === 0 ? filtered + 1 : filtered - start + 1) : start;
                            docs.forEach(function (item) {
                                index +=  dir === 'desc' ? -1 : 1;
                                set.push([null, item._id, index, item.name, item.kind, item.price, item.quantity,
                                    item.status, dateFormat(item.modified, "HH:MM dd/mm/yy")
                                ]);
                            });
                            return res.json({status: 1, data: set, draw: req.body.draw, recordsTotal: count, recordsFiltered: filtered});
                        });
                    } catch (e) {
                        return res.json({status: 0, data: []});
                    }
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
        productModel.update({ '_id': {$in: list.split(',')} }, { $set: set }, { multi: true }, function (err, result) {
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
    // req = req.body;
    let filter = { name: req.body.name, removed: false };
    if(req.body._id !== ''){
        filter._id = {$ne: req.body._id};
    }
    productModel.count(filter, function (err, counter) {
        if (err) {
            return res.json({status: 0, message: err.message});
        } else {
            if (counter > 0 && req.body._id !== '') {
                return res.json({status: 0, message: 'Sản phẩm bị trùng!'});
            } else if(req.body._id !== ''){
                return new Promise(function(resolve, reject){
                    let set = {
                        modified: dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss"),
                        name: req.body.name,
                        kind: req.body.kind,
                        price: req.body.price,
                        quantity: req.body.quantity,
                        status: req.body.status
                    };
                    if(req.icon !== ''){
                        set.icon = req.body.icon;
                    }
                    productModel.update({ '_id': req.body._id }, { $set: set }, function (err, result) {
                        if (err) {
                            return reject(new Error(err.message));
                        }
                        return resolve(result._id);
                    });
                }).then(function(message){
                    return res.json({status: 1, message: message});
                }).catch((err) => { return res.send(err.message) });
            } else {
                return new Promise(function(resolve, reject){
                    let product = new productModel();
                    product.name = req.body.name;
                    product.kind = req.body.kind;
                    product.icon = req.body.icon;
                    product.price = req.body.price;
                    product.quantity = req.body.quantity;
                    product.status = req.body.status;
                    product.save(function (err, result) {
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