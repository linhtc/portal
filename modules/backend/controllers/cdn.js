let express = require('express');
let router = express.Router();
let path = require('path');
let multer = require('multer');
let storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, path.join(__dirname, '../../../public/backend/uploads')); // set the destination
    },
    filename: function(req, file, callback){
        callback(null, Date.now() + '_' + file.originalname); // set the file name and extension
    }
});
let upload = multer({storage: storage});
let dateFormat = require('dateformat');

/**
 * Upload single file
 */
router.post('/single', upload.single('file'), (req, res) => {
    return res.json({status: 1, path: '/public/backend/uploads/'+req.file.filename});
});

/**
 * Import single file
 */
router.post('/import', upload.single('file'), (req, res) => {
    let collection = req.body.collection;
    let message = '';
    if(collection === undefined){
        return res.json({status: 0, path: null});
    }
    if(collection === 'users'){
        let userModel = require('../models/users');
        let fs = require('fs');
        let parse = require('csv-parse');
        let async = require('async');
        let md5 = require('md5');
        let userBag = [];
        let parser = parse({delimiter: ','}, function (err, data) {
            data.shift();
            async.eachSeries(data, function (line, callback) {
                userModel.count({ username: line[1], removed: false }, function (err, counter) {
                    if(!err && counter < 1){
                        let user = new userModel();
                        user.fullname = line[0];
                        user.username = line[1];
                        user.password = md5(user.username);
                        user.phone = line[3];
                        user.email = line[4];
                        user.address = line[5];
                        user.gender = line[6];
                        userBag.push(user);
                    } else{
                        message += '<br>Bị trùng Tài khoản '+line[1]+';';
                    }
                    callback();
                });
            }, function(err){
                if(err){
                    return res.json({status: 0, message: err.message});
                }
                if(message !== ''){
                    return res.json({status: 0, message: message});
                }
                userModel.collection.insert(userBag, function(err, docs){
                    if(err){
                        return res.json({status: 0, message: err.message});
                    }
                    return res.json({status: 1, message: 'Import thành công!'});
                });
            });
        });
        fs.createReadStream(req.file.path).pipe(parser);
    } else if(collection === 'members'){
        let memberModel = require('../models/members');
        let fs = require('fs');
        let parse = require('csv-parse');
        let async = require('async');
        let memberBag = [];
        let parser = parse({delimiter: ','}, function (err, data) {
            data.shift();
            async.eachSeries(data, function (line, callback) {
                let dob = new Date(line[4]);
                if (dob instanceof Date && !isNaN(dob.valueOf())){
                    memberModel.count({ phone: line[1], removed: false }, function (err, counter) {
                        if(!err && counter < 1){
                            let member = new memberModel();
                            member.fullname = line[0];
                            member.phone = line[1];
                            member.email = line[2];
                            member.gender = line[3];
                            member.dob = dateFormat(dob, "yyyy-mm-dd");
                            member.province = line[5];
                            member.address = line[6];
                            memberBag.push(member);
                        } else{
                            message += '<br>Bị trùng Điện thoại '+line[1]+';';
                        }
                        callback();
                    });
                } else {
                    message += '<br>Ngày sinh không hợp lệ '+line[4]+';';
                    callback();
                }
            }, function(err){
                if(err){
                    return res.json({status: 0, message: err.message});
                }
                if(message !== ''){
                    return res.json({status: 0, message: message});
                }
                memberModel.collection.insert(memberBag, function(err, docs){
                    if(err){
                        return res.json({status: 0, message: err.message});
                    }
                    return res.json({status: 1, message: 'Import thành công!'});
                });
            });
        });
        fs.createReadStream(req.file.path).pipe(parser);
    } else{
        return res.json({status: 0, path: null});
    }
});

module.exports = router;