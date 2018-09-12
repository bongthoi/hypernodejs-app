import express from 'express';
import moment from 'moment';
import { createUser, comparePassword, getUserById } from '../services/User';
import {getAllTransaction} from '../services/transactionService';
import passport from 'passport';
import User from '../models/user';


/** */
let LocalStrategy = require('passport-local').Strategy;
let router = express.Router();
let userModel = {};
//let TransactionService = new transactionService();

/**public */
router.get("/", function (req, res) {
	res.redirect("/transactions");
	//res.render('pages/index');
});

router.get("/transactions", function (req, res) {
	getAllTransaction(function (err, data) {
		if(err){throw err}		
		res.render("pages/transactions",{Trans:data,moment:moment});				
	});
	
});

router.get('/users/register', function (req, res) {
	res.render('pages/register');
});

router.get('/users/login', function (req, res) {
	res.render('pages/login');
});

router.post('/users/register', function (req, res) {
	let cpn_name = req.body.cpn_name;
	let email = req.body.email;
	let password = req.body.password;
	let cfm_pwd = req.body.cfm_pwd;
	let userType = req.body.user_type;

	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Please enter a valid email').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('cfm_pwd', 'Confirm Password is required').notEmpty();
	req.checkBody('cfm_pwd', 'Confirm Password Must Matches With Password').equals(password);
	req.checkBody('cpn_name', 'Company Name is required').notEmpty();

	let errors = req.validationErrors();
	if (errors) {
		res.render('pages/register', { errors: errors });
	}
	else {

		if (userType.trim() === "Buyer".trim()) {
			userModel = new User(email, password, cpn_name, userType);
		} else {
			userModel = new User(email, password, cpn_name, userType);
		}

		createUser(userModel, function (err, user) {
			if (err) throw err;
			else console.log(user);
		});
		req.flash('success_message', 'You have registered, Now please login');
		res.redirect('login');
	}
});

router.post('/users/login', passport.authenticate('local', {
	failureRedirect: '/users/login', failureFlash: true
}),
	function (req, res) {
		req.flash('success_message', 'You are now Logged in!!');
		res.redirect('/users/dashboard');
	}
);

router.get('/users/logout', function (req, res) {
	req.logout();
	req.flash('success_message', 'You are logged out');
	res.redirect('/users/login');
});

/**private */
router.get('/users/dashboard', isLoggedIn, function (req, res) {
	res.render('dashboard/pages/dashboard');
});

router.get('/users/profile', isLoggedIn, function (req, res) {
	res.render('dashboard/pages/profile');
});

router.get("/users/transactions",isLoggedIn, function (req, res) {
	getAllTransaction(function (err, data) {
		if(err){throw err}		
		res.render("dashboard/pages/transactions",{Trans:data,moment:moment});				
	});
	
});
/** */
passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
},
	function (req, email, password, done) {
		getUserById(email, function (err, user) {

			if (err) { return done(err); }
			if (!user) {
				return done(null, false, req.flash('error_message', 'No email is found'));
			}
			comparePassword(password, user.userPW, function (err, isMatch) {
				if (err) { return done(err); }
				if (isMatch) {
					return done(null, user, req.flash('success_message', 'You have successfully logged in!!'));
				}
				else {
					return done(null, false, req.flash('error_message', 'Incorrect Password'));
				}
			});
		});
	}
));

passport.serializeUser(function (user, done) {
	done(null, user.userID);
});

passport.deserializeUser(function (id, done) {
	getUserById(id, function (err, user) {
		done(err, user);
	});
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	}
	else {
		res.redirect("/users/login");
	}
}


/** */
export default router;