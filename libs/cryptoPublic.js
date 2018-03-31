var express = require("express");
var cryptoPublic = express();

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'starhub';

cryptoPublic.encrypt = function (text) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

cryptoPublic.decrypt = function (text) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

module.exports = cryptoPublic;