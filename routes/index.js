var express = require('express');
var passport = require('passport');
var multer = require('multer')
var upload = multer({ dest: 'tmpuploads/' });
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var users = require('../models/user');
var uploads = require('../models/upload');
var LocalStrategy = require('passport-local').Strategy;

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var user = "";
	if(req.user) user = req.user.username;
	else user = "none";
	res.render('index', { title: 'HCI Profession Development Portal', username: user});
});

router.get('/chat', function(req, res, next) {
  res.render('chat', { title: 'Chat' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});
router.post('/login', passport.authenticate('local',{
									successRedirect: '/',
                                    failureRedirect: '/login'}));

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});


router.get('/upload', function(req, res, next) {
  res.render('upload', { title: 'Upload' });
});


router.post('/upload', upload.single('file'), function(req, res, next) {
	var source = fs.createReadStream(req.file.path);
	var dest = fs.createWriteStream(path.join('uploads',req.file.originalname));

	source.pipe(dest);
	res.end('Uploaded to ' + path.join('uploads',req.file.originalname) + '!');
	source.on('end',function(){
		fs.unlink(req.file.path);
		uploads.addOne(_.pick(req.file,['originalname','mimetype','size']));
	});
});

passport.use(new LocalStrategy(users.login));
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

//passport.deserializeUser(users.getById);
passport.deserializeUser(function(id, done) {
	users.getById(id, done);
});

module.exports = router;
