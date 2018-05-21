let express = require('express');
let router = express.Router();
let Tools = require('./tools');
let fs = require('fs');
let FileManager = require('../../../public/plugin/filemanager/fileManager');
// let bodyParser = require('body-parser');

// router.get('/', function *(req, res) {
//     console.log('aaa');
//     // this.redirect('files');
//     res.end();
// });
//
// router.get('/files', function *() {
//     this.body = yield render('files');
// });

router.get('/*', function (req, res) {
    let p = global.__fileManager+req.url;//this.request.fPath;
    fs.stat(p, function(err, stats){
        if (err && err.errno === 34) {
            res.body = origFs.createReadStream(p);
            return res.end();
        } else {
            res.json([{"folder":false,"size":41611,"mtime":1524731322079,"name":"22d23deb.docx"},{"folder":true,"size":4096,"mtime":1522632542919,"name":"home"},{"folder":true,"size":4096,"mtime":1522632551571,"name":"icon"},{"folder":true,"size":4096,"mtime":1522632574019,"name":"photo"}]);
        }
    });
});

router.get('/*', Tools.loadRealPath, Tools.checkPathExists, function *() {
    var p = this.request.fPath;
    var stats = yield fs.stat(p);
    if (stats.isDirectory()) {
        this.body = yield * FileManager.list(p);
    }
    else {
        //this.body = yield fs.createReadStream(p);
        this.body = origFs.createReadStream(p);
    }
});

// router.del('/.*', Tools.loadRealPath, Tools.checkPathExists, function *() {
//     var p = this.request.fPath;
//     yield * FileManager.remove(p);
//     this.body = 'Delete Succeed!';
// });

router.put('/.*', Tools.loadRealPath, Tools.checkPathExists, function(){} /*bodyParser()*/, function* () {
    var type = this.query.type;
    var p = this.request.fPath;
    if (!type) {
        this.status = 400;
        this.body = 'Lack Arg Type'
    }
    else if (type === 'MOVE') {
        var src = this.request.body.src;
        if (!src || ! (src instanceof Array)) return this.status = 400;
        var src = src.map(function (relPath) {
            return FilePath(relPath, true);
        });
        yield * FileManager.move(src, p);
        this.body = 'Move Succeed!';
    }
    else if (type === 'RENAME') {
        var target = this.request.body.target;
        if (!target) return this.status = 400;
        yield * FileManager.rename(p, FilePath(target, true));
        this.body = 'Rename Succeed!';
    }
    else {
        this.status = 400;
        this.body = 'Arg Type Error!';
    }
});

router.post('/.*', Tools.loadRealPath, Tools.checkPathNotExists, function(){} /*bodyParser()*/, function *() {
    var type = this.query.type;
    var p = this.request.fPath;
    if (!type) {
        this.status = 400;
        this.body = 'Lack Arg Type!';
    }
    else if (type === 'CREATE_FOLDER') {
        yield * FileManager.mkdirs(p);
        this.body = 'Create Folder Succeed!';
    }
    else if (type === 'UPLOAD_FILE') {
        var formData = yield formParser(this.req);
        if (formData.fieldname === 'upload'){
            var writeStream = origFs.createWriteStream(p);
            formData.pipe(writeStream);
            this.body = 'Upload File Succeed!';
        }
        else {
            this.status = 400;
            this.body = 'Lack Upload File!';
        }
    }
    else if (type === 'CREATE_ARCHIVE') {
        var src = this.request.body.src;
        if (!src) return this.status = 400;
        src = src.map(function(file) {
            return FilePath(file, true);
        })
        var archive = p;
        yield * FileManager.archive(src, archive, C.data.root, !!this.request.body.embedDirs);
        this.body = 'Create Archive Succeed!';
    }
    else {
        this.status = 400;
        this.body = 'Arg Type Error!';
    }
});


module.exports = router;