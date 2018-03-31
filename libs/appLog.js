var fse = require('fs-extra');
var express = require("express");
var applog = express();

applog.write = function (log_name, log_label, log_data, is_log_refix = true) {
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

    var dir = __base + 'public/app_logs/' + yyyy + '/' + folder_mm + '/' + folder_dd + '/';

    fse.ensureDir(dir)
        .then(() => {
            var logfile = 'log_' + log_name + "_" + yyyy + folder_mm + folder_dd;
            var logger = fse.createWriteStream(dir + logfile, {
                flags: 'a' // 'a' means appending (old data will be preserved)
            });
            if (is_log_refix) {
                var logRefix = ' [' + yyyy + '-' + folder_mm + '-' + folder_dd + ' ' + hh + ':' + minute + ':' + ss + '] [' + today.getTime() + '] [' + log_label + '] ';
                logger.end(logRefix + log_data + '\r\n');
            } else {
                logger.end(log_data + '\r\n');
            }
        })
        .catch(err => {
            return false;
        });

    return true;
}

module.exports = applog;