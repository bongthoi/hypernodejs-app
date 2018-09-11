import express from 'express';
import { User, createUser, comparePassword, getUserByEmail, getUserById } from '../services/User';
import passport from 'passport';
import buyer from "../models/buyer";

/** */
let LocalStrategy = require('passport-local').Strategy;
let router =  express.Router();

/**public */
router.get("/",function(req,res){
	res.render('pages/index');	
});

router.get('/users/register', function(req, res){
  	res.render('pages/register');
});

router.get('/users/login', function(req, res){
	res.render('pages/login');
});

router.post('/users/register', function(req, res){
  	let name = req.body.name;
	let email = req.body.email;
	let password = req.body.password;
	let cfm_pwd = req.body.cfm_pwd;

	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Please enter a valid email').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('cfm_pwd', 'Confirm Password is required').notEmpty();
	req.checkBody('cfm_pwd', 'Confirm Password Must Matches With Password').equals(password);

	let errors = req.validationErrors();
	if(errors)
	{
		res.render('pages/register',{errors: errors});
	}
	else
	{
		let user = new buyer(email,password,name);

		createUser(user, function(err, user){
			if(err) throw err;
			else console.log(user);
		});
		req.flash('success_message','You have registered, Now please login');
		res.redirect('login');
	}
});

router.post('/users/login', passport.authenticate('local', {
	failureRedirect: '/users/login', failureFlash: true
	}), 
	function(req, res){
		req.flash('success_message', 'You are now Logged in!!');
  		res.redirect('/users/dashboard');
	}
);

router.get('/users/logout', function(req, res){
	req.logout();
	req.flash('success_message', 'You are logged out');
	res.redirect('/users/login');
});

/**private */
router.get('/users/dashboard', isLoggedIn, function(req, res){
	res.render('dashboard/pages/dashboard');
});

router.get('/users/profile', isLoggedIn, function(req, res){
  res.render('dashboard/pages/profile');
});

/** */
passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback : true
},
	function(req, email, password, done) {
		getUserByEmail(email, function(err, user) {
			if (err) { return done(err); }
	  		if (!user) {
				return done(null, false, req.flash('error_message', 'No email is found'));
	  		}
	  		comparePassword(password, user.buyerPW, function(err, isMatch) {
				if (err) { return done(err); }
				if(isMatch){
		  				return done(null, user, req.flash('success_message', 'You have successfully logged in!!'));
				}
				else{
		  				return done(null, false, req.flash('error_message', 'Incorrect Password'));
				}
	 		});
		});
  	}
));

passport.serializeUser(function(user, done) {
  	done(null, user.buyerID);
});

passport.deserializeUser(function(id, done) {
	getUserByEmail(id, function(err, user) {
		done(err, user);
  	});
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
	  next();
  }
  else{
	  res.redirect("/users/login");
  }
}


/** */
export default router;