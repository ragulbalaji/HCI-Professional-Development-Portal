var express = require('express');
var passport = require('passport');
var users = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log('/ : ' + req.isAuthenticated());
	var user = "";
	if(req.user) user = req.user.username;
	else user = "none";
  res.render('index', { title: 'HCI Profession Development Portal', username: user});
});

router.get('/chat', function(req, res, next) {
	console.log('/chat : ' + req.isAuthenticated());
  res.render('chat', { title: 'Chat' });
});

router.get('/login', function(req, res, next) {
	console.log('/char : ' + req.isAuthenticated());
  res.render('login', { title: 'Login' });
});
router.post('/login', passport.authenticate('local',{
									successRedirect: '/',
                                    failureRedirect: '/login'}));

passport.use(new LocalStrategy(users.login));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

//passport.deserializeUser(users.getById);
passport.deserializeUser(function(id, done) {
	done(null, {username: 'admin', id: 'abcdefg' });
});

module.exports = router;
