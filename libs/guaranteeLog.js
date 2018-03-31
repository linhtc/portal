var fse = require('fs-extra');
var express = require("express");
var guaranteeLog = express();

guaranteeLog.push = function (imei, log_data) {
    var today = new Date();
    var dd = today.getDate();
    var mm = parseInt(today.getMonth()) + 1;
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var minute = today.getMinutes();
    var ss = today.getSeconds();

    var folder_mm;
    if (mm < 10) {
        var folder_mm = '0' + mm;
    } else {
        var folder_mm = mm;
    }

    var folder_dd;
    if (dd < 10) {
        var folder_dd = '0' + dd;
    } else {
        var folder_dd = dd;
    }

    try {
        var _imei = '' + imei;
        folder_refix = _imei.substring(0, 8);
    } catch (error) {
        var folder_refix = "0000000";
    }

    var dir = __base + 'public/guarantee_logs/' + yyyy + '/' + folder_mm + '/' + folder_dd + '/' + folder_refix + '/';

    fse.ensureDir(dir)
        .then(() => {
            var logfile = 'active_' + imei;
            var logger = fse.createWriteStream(dir + logfile, {
                flags: 'a',
            });
            var logRefix = '[' + yyyy + '-' + folder_mm + '-' + folder_dd + ' ' + hh + ':' + minute + ':' + ss + '] [' + today.getTime() + '] | ';
            logger.end(logRefix + JSON.stringify(log_data) + '\r\n');
        })
        .catch(err => {
            return false;
        });

    return true;
}

module.exports = guaranteeLog;