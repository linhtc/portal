let express = require('express');
let router = express.Router();
// let Tools = require('./tools');
let fs = require('fs');
let path = require('path');
// let formParser = require('co-busboy');
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
    if(fs.existsSync(p)) {
        let stats = fs.statSync(p);
        if (stats.isDirectory()) {
            let list = FileManager.list(p);
            res.json(list);
            return res.end();
        } else if(stats.isFile()){
            return res.download(p);
        }
    }
    return res.end();
});

router.delete('/*', function (req, res) {
    let p = global.__fileManager+'/'+req.params[0];
    FileManager.remove(p);
    res.send('Delete Succeed!');
    return res.end();
});

router.put('/*', function (req, res) {
    let type = req.query.type;
    let p = global.__fileManager+'/'+req.params[0];
    if (!type) {
        res.send('Lack Arg Type!');
        return res.status(400).end();
    }
    else if (type === 'MOVE') {
        if(fs.existsSync(p)){
            let stats = fs.statSync(p);
            if(stats.isDirectory()){
                let src = req.body.src;
                if (!src || ! (src instanceof Array)) return res.status(400).end();
                src = src.map(function (relPath) {
                    return path.join(global.__fileManager, relPath);
                });
                FileManager.move(src, p);
                res.send('Move Succeed!');
                return res.end();
            } else{
                res.send('Directory not found!');
                return res.status(400).end();
            }
        } else{
            res.send('Directory not found!');
            return res.status(400).end();
        }
    }
    else if (type === 'RENAME') {
        let target = req.body.target;
        if (!target) return this.status = 400;
        FileManager.rename(p, FilePath(target, true));
        this.body = 'Rename Succeed!';
    }
    else {
        res.send('Lack Arg Type!');
        return res.status(400).end();
    }
});

router.post('/*', function (req, res) {
    let type = req.query.type;
    let p = global.__fileManager+'/'+req.params[0];
    if (!type) {
        res.send('Lack Arg Type!');
        return res.status(400).end();
    }
    else if (type === 'CREATE_FOLDER') {
        FileManager.mkdirs(p);
        res.send('Create Folder Succeed!');
        return res.end();
    }
    else if (type === 'UPLOAD_FILE') {
        // let formData = formParser(req.body);
        // console.log(formData);
        if(req.busboy) {
            req.busboy.on("file", function(fieldName, fileStream, fileName, encoding, mimeType) {
                // console.log(fieldName);
                if(fieldName === 'upload'){
                    console.log('Uploading... '+fileName);
                    let fstream = fs.createWriteStream(p);
                    fileStream.pipe(fstream);
                    fstream.on('close', function () {
                        res.send('Upload File Succeed!');
                        return res.end();
                    });
                } else{
                    res.send('Lack Arg Type!');
                    return res.status(400).end();
                }
            });
            return req.pipe(req.busboy);
        } else {
            res.send('Lack Arg Type!');
            return res.status(400).end();
        }
    } else if (type === 'CREATE_ARCHIVE') {
        res.send('Coming soon!');
        return res.status(400).end();
        // let src = this.request.body.src;
        // if (!src) return res.status(400).end();
        // src = src.map(function(file) {
        //     return FilePath(file, true);
        // });
        // let archive = p;
        // FileManager.archive(src, archive, C.data.root, !!this.request.body.embedDirs);
        // this.body = 'Create Archive Succeed!';
    } else {
        res.send('Lack Arg Type!');
        return res.status(400).end();
    }
});


module.exports = router;