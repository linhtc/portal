var express = require('express');
var router = express.Router();
var fs = require("fs");
var fse = require('fs-extra');
var request = require('request');
var multer = require('multer');
var excelXLSX = require('xlsx');
let activeGuarantee = require('../models/active_guarantee_log');
var dateFormat = require('dateformat');

/**
 * Index
 */
router.get('/', function (req, res, next) {
    var resource_code = -201;
    var resource_message = "Invalid Parameter";
    var resource = { "code": resource_code, "message": resource_message };
    res.send(resource);
});

/**
 * Check is JSON
 * @param {*JSON data} str 
 */
var isJsonString = function (str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

/**
 * POST
 * Push active 
 * Push raw data từ client app My Mobiistar để kích hoạt bảo hành
 */
router.post('/push-active', function (req, res) {

    // Resource return
    var resource_code = -201;
    var resource_message = "Invalid Parameter";
    var resource = { "code": resource_code, "message": resource_message };

    // console.log(req.body);

    // Query param
    var req_user_name = req.body.user_name;
    var req_user_phone = req.body.user_phone;
    var req_user_email = req.body.user_email;
    var req_user_dob = req.body.user_dob;
    var req_user_location = req.body.user_location;
    var req_model = req.body.model;
    var req_product = req.body.product;
    var req_guarantee = req.body.guarantee;
    var req_client_log = req.body.client_log;

    if (typeof (req_user_name) != "object") return res.send(resource);
    // if (typeof (req_user_phone) != "object") return res.send(resource);
    // if (typeof (req_user_email) != "object") return res.send(resource);
    // if (typeof (req_user_dob) != "undefined") return res.send(resource);
    // if (typeof (req_user_location) != "object") return res.send(resource);
    // if (typeof (req_model) != "object") return res.send(resource);
    // if (typeof (req_product) != "object") return res.send(resource);
    // if (typeof (req_guarantee) != "object") return res.send(resource);
    // if (typeof (req_client_log) != "object") return res.send(resource);

    // req_user_name = JSON.parse(req_user_name);

    // req_user_phone = JSON.parse(req_user_phone);

    // req_user_email = JSON.parse(req_user_email);

    // console.log(req_user_dob);

    var req_user_dob = new Date(req_user_dob);
    if (req_user_dob == "Invalid Date") return res.send({ "code": resource_code, "message": "Invalid Date" });

    // req_user_location = JSON.parse(req_user_location);

    // req_model = JSON.parse(req_model);
    if (typeof (req_model.name) == "undefined" || req_model.cate == "") return res.send({ "code": resource_code, "message": "Invalid Model Name" });

    // req_product = JSON.parse(req_product);
    if (typeof (req_product.imei) == "undefined") return res.send({ "code": resource_code, "message": "Invalid IMEI" });

    // req_guarantee = JSON.parse(req_guarantee);
    if (typeof (req_guarantee.cate) == "undefined" || (req_guarantee.cate != "app" && req_guarantee.cate != "sms")) return res.send({ "code": resource_code, "message": "Invalid Guarantee Category" });
    if (typeof (req_guarantee.label) == "undefined" || (req_guarantee.label != "auto" && req_guarantee.label != "manual")) return res.send({ "code": resource_code, "message": "Invalid Guarantee Label" });
    req_guarantee.date = new Date(req_guarantee.date);
    if (req_guarantee.date == "Invalid Date") return res.send({ "code": resource_code, "message": "Invalid Guarantee Date" });

    // req_client_log = JSON.parse(req_client_log);

    var data_post = {
        user_name: {
            full_name: req_user_name.full_name,
        },
        user_phone: {
            raw_input: req_user_phone.raw_input,
        },
        user_email: {
            raw_input: req_user_email.raw_input,
            home: req_user_email.home ? req_user_email.home : req_user_email.raw_input,
        },
        user_dob: {
            date: req_user_dob,
            yob: req_user_dob.getFullYear(),
        },
        user_location: {
            country: req_user_location.country ? req_user_location.country : "N/A",
            region: req_user_location.region ? req_user_location.region : "N/A",
            area: req_user_location.area ? req_user_location.area : "N/A",
            province: req_user_location.province ? req_user_location.province : "N/A",
            district: req_user_location.district ? req_user_location.district : "N/A",
            ward: req_user_location.ward ? req_user_location.ward : "N/A",
            address: req_user_location.address ? req_user_location.address : "N/A",
        },
        model: {
            name: req_model.name,
            item_code: req_model.item_code ? req_model.item_code : "N/A",
        },
        product: {
            imei: req_product.imei,
            imei_1: req_product.imei_1 ? req_product.imei_1 : req_product.imei,
            imei_2: req_product.imei_2 ? req_product.imei_2 : req_product.imei,
        },
        guarantee: {
            cate: req_guarantee.cate,
            label: req_guarantee.label,
            date: req_guarantee.date,
            date_detail: {
                day: dateFormat(req_guarantee.date, "yyyy-mm-dd"),
                time: dateFormat(req_guarantee.date, "HH:MM:ss"),
            },
            location: {
                country: req_guarantee.location.country,
                language: req_guarantee.location.language,
                current_position: {
                    latitude: req_guarantee.location.current_position.latitude,
                    longitude: req_guarantee.location.current_position.longitude,
                },
            },
            status: req_guarantee.status ? req_guarantee.status : 0,
        },
        client_log: {
            app: {
                name: req_client_log.app.name,
                version: req_client_log.app.version,
                ip: req_client_log.app.ip,
            },
            android: {
                name: req_client_log.android.name,
                version: req_client_log.android.version,
            },
            hardware: {
                version: req_client_log.hardware.version,
            }
        },
    };

    // Push log
    pushGuaranteeLog(data_post.product.imei, data_post);

    var key = dateFormat(Date.now(), "yyyymmdd") + "-" + data_post.product.imei;

    activeGuarantee.count({ 'key': key }, function (err, counter) {
        if (err) {
            return res.send(err);
        } else {
            console.log(counter);
            if (counter > 0) {
                // Push mongoDB
                updateActiveGuarantee(key, data_post)
                    .then((re) => {
                        return res.json({
                            "code": 200,
                            "message": "Success",
                            "data": {
                                "key": cryptoPublic.encrypt(key),
                            }
                        });
                    })
                    .catch((err) => { return res.send(err) });
            } else {
                // Push mongoDB
                createActiveGuarantee(key, data_post)
                    .then((re) => {
                        return res.json({
                            "code": 200,
                            "message": "Success",
                            "data": {
                                "key": cryptoPublic.encrypt(key),
                            }
                        });
                    })
                    .catch((err) => { return res.send(err) });
            }
        }
    });
});

/**
 * POST
 * Push active
 * Push raw data từ client app My Mobiistar để kích hoạt bảo hành
 */
router.post('/active', function (req, res) {

    // Resource return
    let resource_code = -201;
    let resource_message = "Invalid Parameter";
    let resource = { code: resource_code, message: resource_message };

    if (typeof (req.body.imei) !== 'string') return res.send(resource);
    activeGuarantee.count({ 'product.imei': req.body.imei }, function (err, counter) {
        if (err) {
            return res.json({status: 0, message: err.message});
        } else {
            if (counter > 0) {
                resource.code = 123;
                resource.message = 'IMEI này đã kích hoạt rồi!';
                return res.json(resource);
            } else {
                return new Promise(function(resolve, reject){
                    let phone = new activeGuarantee();
                    phone.product.imei = req.body.imei;
                    phone.client_log.android.name = req.body.android_id;
                    phone.user_email.raw_input = req.body.email;
                    phone.guarantee.date = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
                    phone.save(function (err, result) {
                        if (err) {
                            return reject(new Error(err.message));
                        }
                        return resolve(result._id);
                    });
                }).then(function(message){
                    resource.code = 0;
                    resource.message = message;
                    return res.json(resource);
                }).catch((err) => {
                    resource.code = err.code;
                    resource.message = err.message;
                    return res.json(resource);
                });
            }
        }
    });

});

/**
 * pushGuaranteeLog
 * Store lại detail log trong ngày theo key
 */
pushGuaranteeLog = (imei, data_post) => {
    return new Promise((resolve, reject) => {
        guaranteeLog.push(imei, data_post);
        return resolve('ok');
    })
}

/**
 * createActiveGuarantee
 * Tạo mới log trong DB (trong ngày / theo key)
 */
createActiveGuarantee = (key, data_create) => {
    return new Promise((resolve, reject) => {
        console.log('Run createActiveGuarantee ' + key + ' ...');
        var active_guarantee = new activeGuarantee();
        active_guarantee.update_by = 'step-001-create';
        active_guarantee.key = key;
        active_guarantee.user_name = data_create.user_name;
        active_guarantee.user_phone = data_create.user_phone;
        active_guarantee.user_email = data_create.user_email;
        active_guarantee.user_dob = data_create.user_dob;
        active_guarantee.user_location = data_create.user_location;
        active_guarantee.model = data_create.model;
        active_guarantee.product = data_create.product;
        active_guarantee.guarantee = data_create.guarantee;
        active_guarantee.client_log = data_create.client_log;

        active_guarantee.save(function (err, results) {
            console.log(err);
            if (err) {
                return reject(new Error('Error'));
            } else {
                return resolve('ok');
            }
        });
    })
}

/**
 * updateActiveGuarantee
 * Cập nhật log trong ngày vào DB (theo ngày / key)
 */
updateActiveGuarantee = (key, data_update) => {
    return new Promise((resolve, reject) => {
        console.log('Run updateActiveGuarantee ' + key + ' ...');
        activeGuarantee.update({ 'key': key }, {
            $set: {
                modified: dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss"),
                update_by: 'step-001-update',
                user_name: data_update.user_name,
                user_phone: data_update.user_phone,
                user_email: data_update.user_email,
                user_dob: data_update.user_dob,
                user_location: data_update.user_location,
                model: data_update.model,
                product: data_update.product,
                guarantee: data_update.guarantee,
                client_log: data_update.client_log,
            }
        }, function (err) {
            if (err) {
                return reject(new Error('Error'));
            } else {
                return resolve('ok');
            }
        });
    })
}

/**
 * Check theo tin push log active trong DB
 */
router.get('/get-active', function (req, res) {

    // Resource return
    var resource_code = -201;
    var resource_message = "Invalid Parameter";
    var resource = { "code": resource_code, "message": resource_message };

    // Query param
    var req_key = req.query.key;

    if (typeof (req_key) == "undefined" || req_key == "") return res.send(resource);

    if (req_key) {
        var fields = '-_id user_name user_phone user_email user_dob user_location model product guarantee client_log';

        activeGuarantee.findOne({ 'key': cryptoPublic.decrypt(req_key) }, fields, { sort: { created: 'desc' } }, (err, data_log) => {
            if (err) {
                return res.send(resource);
            } else {
                if (data_log) {
                    return res.send({
                        "code": 200,
                        "message": "Ok",
                        "data": {
                            "key": req_key,
                            "data_log": data_log
                        }
                    });
                } else {
                    return res.send(resource);
                }
            }
        });
    } else {
        return res.send(resource);
    }
});

/**
 * Check theo tin push log active trong DB
 */
router.get('/get-all', function (req, res) {
    activeGuarantee.find({}, '', { sort: { _id: 'desc' } }, (err, docs) => {
        if (err) {
            return res.json({status: 0, message: err.message});
        } else {
            return res.json({status: 1, data: docs});
        }
    });
});

/**
 * Get all history log theo ngày
 */
router.get('/get-log-push-active', function (req, res) {
    // Resource return
    var resource_code = -201;
    var resource_message = "Invalid Parameter";
    var resource = { "code": resource_code, "message": resource_message };

    // Query param
    var req_key = req.query.key;

    if (typeof (req_key) == "undefined" || req_key == "") return res.send(resource);

    if (req_key) {
        var key = cryptoPublic.decrypt(req_key);
        var array_key = key.split('-');

        if (array_key.length == 2) {
            var key_folder = '' + array_key[0];
            var imei = '' + array_key[1];

            var dir = __base + 'public/guarantee_logs/' + key_folder.substring(0, 4) + '/' + key_folder.substring(4, 6) + '/' + key_folder.substring(6, 8) + '/' + imei.substring(0, 8) + '/';
            try {
                fse.readFile(dir + 'active_' + imei, 'utf8', function (error_read_log, data_log) {
                    if (error_read_log) {
                        return res.send({ "code": resource_code, "message": 'Not Found' });
                    } else {
                        if (data_log) {
                            var array_data_log = data_log.split('\r\n');
                            var data_log_show = [];
                            for (i = 0; i < array_data_log.length; i++) {
                                if (array_data_log[i] != "") {
                                    data_log_show.unshift(array_data_log[i].split(' | '));
                                }
                            }
                            return res.send({
                                "code": 200,
                                "message": "Ok",
                                "data": {
                                    "key": req_key,
                                    "data_log": data_log_show
                                }
                            });
                        } else {
                            return res.send(resource);
                        }
                    }
                });
            } catch (error) {
                return res.send(resource);
            }
        } else {
            return res.send(resource);
        }
    } else {
        return res.send(resource);
    }
});

// var storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         try {
//             var fieldName = file.fieldname;
//             var fileName = file.originalname;
//             var encoding = file.encoding;
//             var mimeType = file.mimetype;

//             systemLog.write(JSON.stringify(file));
//         } catch (error) {
//             systemLog.write(error);
//         }
//     }
// });

// var upload = multer({ storage: storage }).single('data');

// router.post('/push-data-log', function (req, res) {
//     upload(req, res, (err) => {

//     })
// });

module.exports = router;
