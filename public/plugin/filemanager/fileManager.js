let path = require('path');
let fs = require('fs');

let FileManager = {};

FileManager.getStats = function (p) {
  let stats = fs.statSync(p);
  return {
    folder: stats.isDirectory(),
    size: stats.size,
    mtime: stats.mtime.getTime()
  }
};

FileManager.list = function (dirPath) {
  let files = fs.readdirSync(dirPath);
  let stats = [];
  for (let i in files) {
    if(files.hasOwnProperty(i)){
      let fPath = path.join(dirPath, files[i]);
      let stat = FileManager.getStats(fPath);
      stat.name = files[i];
      stats.push(stat);
    }
  }
  return stats;
};

FileManager.remove = function (p) {
    let stats = fs.statSync(p);
    if(stats.isDirectory()){
        if( fs.existsSync(p) ) {
            fs.readdirSync(p).forEach(function(file, index){
                let curPath = p + "/" + file;
                if(fs.lstatSync(curPath).isDirectory()) { // recurse
                    FileManager.remove(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(p);
        }
    } else if(stats.isFile()){
        fs.unlinkSync(p);
    }
};

FileManager.mkdirs = function (dirPath) {
  fs.mkdirSync(dirPath);
};

FileManager.move = function (srcs, dest) {
  for (let i=0; i<srcs.length; ++i) {
    let src = srcs[i];
    let basename = path.basename(src);
    fs.renameSync(src, dest+'/'+basename);
  }
};

FileManager.rename = function *(src, dest) {
  yield fse.move(src, dest);
};

FileManager.archive = function *(src, archive, dirPath, embedDirs) {
  var zip = new JSZip();
  var baseName = path.basename(archive, '.zip');

  function* addFile(file) {
    var data = yield fs.readFile(file);
    var name;
    if (embedDirs) {
      name = file;
      if (name.indexOf(dirPath) === 0) {
        name = name.substring(dirPath.length);
      }
    } else {
      name = path.basename(file);
    }
    zip.file(name, data);
    C.logger.info('Added ' + name + ' ' + data.length + ' bytes to archive ' + archive);
  }

  function* addDir(dir) {
    var contents = yield fs.readdir(dir);
    for (var file of contents) {
      yield * process(path.join(dir, file));
    }
  }

  function* process(fp) {
    var stat = yield fs.stat(fp);
    if (stat.isDirectory()) {
      yield * addDir(fp);
    } else {
      yield addFile(fp);
    }
  }

  // Add each src.  For directories, do the entire recursive dir.
  for (var file of src) {
    yield * process(file);
  }

  // Generate the zip and store the final.
  var data = yield zip.generateAsync({type:'nodebuffer',compression:'DEFLATE'});
  yield fs.writeFile(archive, data, 'binary');
};

module.exports = FileManager;
