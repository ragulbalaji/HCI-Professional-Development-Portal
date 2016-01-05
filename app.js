var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus = require('stylus');
var session = require('express-session');
var compression = require('compression');
var passport = require('passport');
var nib = require('nib');
var serveIndex = require('serve-index');
var morganDebug = require('morgan-debug');
var debug = require('debug')('HCIPDP:server');
var debugio = require('debug')('HCIPDP:socket.io');
//set up socket.io code
var io = require('socket.io')();

//Routes go here
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
app.io = io;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//set up middleware sessions
var expresssession = session({
  secret: 'hcipdp',
  saveUninitialized: false,
  resave: true,
  cookie:{maxAge:6000000}
});
function styluscompile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .use(nib())
    .import('nib');
}


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morganDebug('HCIPDP:log','dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expresssession);
app.use(passport.initialize());
app.use(passport.session());
app.use(compression());
app.use(stylus.middleware({
	src: path.join(__dirname, 'public'),
	compile: styluscompile
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads',serveIndex('uploads', {'icons': true}));
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


io.use(function(socket, next){
        // Wrap the express middleware
        expresssession(socket.request, {}, next);
});
var pinit = passport.initialize();
io.use(function(socket, next){
		pinit(socket.request, {}, next);
});
var psess = passport.session();
io.use(function(socket, next){
		psess(socket.request, {}, next);
});
io.on('connection',function(socket) {
	var user;
	if(socket.request.isAuthenticated())user = socket.request.user.username;
	else user = 'none';
	debugio(socket.request.user);
    debugio("New Connection " + socket.id + " from : " + socket.request.connection.remoteAddress + ' User: ' + user);
});

module.exports = app;
