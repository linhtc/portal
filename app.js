let express = require('express');
let path = require('path');
// let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let cons = require('consolidate');
// var socket_io = require("socket.io");
let mongoose = require('mongoose');
let session = require('express-session');

// Mongodb config
let configDB = require('./config/mongodb.js');
mongoose.connect(configDB.url, function(err, db){
    if (err) return console.log('Connect MongoDB error:' + err);
    mongoose.Promise = require('bluebird');
    console.log('Connect MongoDB success!...');
});

let app = express();

// view engine setup
app.enable('strict routing');
app.set('views', path.join(__dirname, 'views'));
app.engine('pug', cons.pug);
// app.engine('ejs', cons.ejs);
app.set('view engine', 'pug');
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public'))); // dang co van de voi nginx cua server
// app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(session({secret: "fd34s@!@dfa453f3DF#$D&W",name: 'mySessionName',resave: true,saveUninitialized: true,proxy: false,cookie: { secure: false, maxAge: 60 * 60 * 1000 }}));

let index = require('./routes/index');
let frontend = require('./modules/frontend/controllers/frontend');
let backend = require('./modules/backend/controllers/backend');
let cdn = require('./modules/backend/controllers/cdn');
let users = require('./modules/backend/controllers/users');
let artical = require('./modules/backend/controllers/artical');
let guarantees = require('./modules/guarantees/controllers/active_guarantee_logs');

app.use('/', index);
app.use('/frontend', frontend);
app.use('/backend', backend);
app.use('/backend/cdn', cdn);
app.all('/backend/users', function(req, res) { res.redirect(301, '/backend/users/'); });
app.use('/backend/users/', users);
app.use('/backend', artical);
app.use('/api/v1/guarantee/', guarantees);

// root folder config
global.__base = __dirname + '/';

// load libs
global.vietnamProvince = require('./libs/vietnamProvince');
global.systemLog = require('./libs/appLog');
global.guaranteeLog = require('./libs/guaranteeLog');
global.cryptoPublic = require('./libs/cryptoPublic');

// socket io
// var io = socket_io();
// app.io = io;
// var socket_game = require('./routes/socket')(io);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  next(err);
});

console.log('Hello world');

module.exports = app;
