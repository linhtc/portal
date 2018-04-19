let express = require('express');
let router = express.Router({ strict: true });
let articalModel = require('../models/artical');
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

router.post('/artical/data', function (req, res) {
    let _id = req.body._id;
    if(_id !== undefined){
        articalModel.findOne({_id: _id, removed: false}, '_id title created public group', function (err, item) {
            if(err){
                return res.json({status: 0, message: err.message});
            }
            return res.json({status: 1, item: item});
        });
    } else{
        // console.log(req.body);
        let filter = {removed:false};
        articalModel.count(filter, function(err, count){
            if(!err){
                var public = ['drafts', 'public'];
                var group = ['No Select', 'Artical', 'Photo', 'Video'];
                // if(req.body.id !== undefined && req.body.id !== ''){
                //     filter.id = req.body.id;
                // }
                if(req.body.title !== undefined && req.body.title !== ''){
                    filter.title = {$regex: req.body.title, $options: 'i'};
                }
                if(req.body.public !== undefined && req.body.public !== ''){
                    let id_search = req.body.public;
                    for (var i=0; i<public.length; i++)
                        if (public[i] === req.body.public)
                            id_search = i;

                    filter.public = id_search;
                }
                if(req.body.group !== undefined && req.body.group !== ''){
                    let id_search = req.body.public;
                    for (var i=0; i<group.length; i++)
                        if (group[i] === req.body.group)
                            id_search = i;

                    filter.group = id_search;
                }
                articalModel.find(filter, '_id title created public group', {sort: {_id: 'asc'}}, function (err, docs) {
                    if(err){
                        return res.json({status: 0, data: []});
                    }
                    let set = [];
                    let index = 0;
                    docs.forEach(function (item) {
                        set.push([null, item._id, ++index, item.title, item.created, public[item.public], group[item.group]]);
                    });
                    return res.json({status: 1, data: set, draw: req.body.draw, recordsTotal: count, recordsFiltered: index});
                });
            } else{
                return res.json({status: 1, data: [], draw: 1, recordsTotal: 0, recordsFiltered: 0});
            }
        });
    }
});



router.get('/artical/created', function (req, res) {
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
        res.render('backend/articals/created.pug', {
            title: 'Thêm Bài Viết',
            user: req.session.user,
            groups: docs,
            permission: req.session.user.permission.users,
            url: req.originalUrl
        });
        return res.end();
    });

});
router.get('/artical/edit/:id', function (req, res) {
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
        let id = req.params.id;
        var query = articalModel.findOne({_id : id}, '_id title created public group content thumbnail');
        query.exec(function (err, data) {
            console.log(data)
            if (err) return handleError(err);
            res.render('backend/articals/edit.pug', {
                title: 'Sửa Bài Viết',
                user: req.session.user,
                data: data,
                groups: docs,
                permission: req.session.user.permission.users,
                url: req.originalUrl
            });
        });
    });
});
router.post('/artical/save', function (req, res) {
    req = req.body;
    if(req._id !== ''){
        let set = {
            modified: dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss"),
            title: req.title,
            slug: req.title,
            thumbnail: req.thumbnail,
            summary: '',
            content: req.content,
            seo: '',
            public: req.public,
            group: req.group
        };
        articalModel.update({ '_id': req._id }, { $set: set }, function (err, result) {
            if (err) {
                return res.json({status: 0, message: err.message});
            }else{
                return res.json({status: 0, message: 'Đã lưu thông tin'});
            }
        });
    }else{
        let artical = new articalModel();
        artical.created = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss"),
        artical.modified = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss"),
        artical.title = req.title,
        artical.slug = req.title,
        artical.thumbnail = req.thumbnail,
        artical.summary = '',
        artical.content = req.content,
        artical.seo = '',
        artical.public = req.public,
        artical.group = req.group
        artical.save(function (err, result) {
            if (err) {
                return res.json({status: 0, message: err.message});
            }else{
                return res.json({status: 0, message: 'Đã lưu thông tin'});
            }
        });
    }
    
});

module.exports = router;