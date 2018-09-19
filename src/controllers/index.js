import express from 'express';
import moment from 'moment';
import path from 'path';
import fs from 'fs';
import swal from 'sweetalert'
import { createUser, comparePassword, getUserById } from '../services/User';
import { getAllTransaction } from '../services/transactionService';
import { getOrderByUserID, addOrder, deleteOrder } from '../services/orderService';
import passport from 'passport';
import User from '../models/user';


/** */
let LocalStrategy = require('passport-local').Strategy;
let router = express.Router();
let userModel = {};
//let TransactionService = new transactionService();

/** */
var Cart = require('../services/cart');
var productdb = JSON.parse(fs.readFileSync(path.join(path.dirname(require.main.filename), 'data', 'products.json')));


/**public */
router.get("/", function (req, res) {
	res.redirect("/transactions");
	//res.render('pages/index');
});

router.get("/transactions", function (req, res) {
	getAllTransaction(function (err, data) {
		if (err) { throw err }
		res.render("pages/transactions", { title: 'Transactions List', Trans: data, moment: moment });
	});

});

router.get('/users/register', function (req, res) {
	res.render('pages/register', { title: "Register" });
});

router.get('/users/login', function (req, res) {
	res.render('pages/login', { title: "Login User" });
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
		res.render('pages/register', { title: "Register", errors: errors });
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
		res.redirect('/private/dashboard');
	}
);

router.get('/users/logout', function (req, res) {
	req.logout();
	req.flash('success_message', 'You are logged out');
	res.redirect('/users/login');
});

/**private */
router.get('/private/dashboard', isLoggedIn, function (req, res) {
	res.render('dashboard/pages/dashboard');
});

router.get('/private/profile', isLoggedIn, function (req, res) {
	console.log(req.session["passport"]["user"]);
	res.render('dashboard/pages/profile', { title: 'Profile Info' });
});

router.get("/private/transactions", isLoggedIn, function (req, res) {
	getAllTransaction(function (err, data) {
		if (err) { throw err }
		res.render("dashboard/pages/transactions", { title: 'Transactions List', Trans: data, moment: moment });
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

/**cart */
router.get('/private/productlist', isLoggedIn, function (req, res, next) {
	var cart = new Cart(req.session.cart ? req.session.cart : {});
	req.session.cart = cart;

	let products = productdb.filter(function (item) {
		return !(req.session["passport"]["user"]).includes(item.owner);
	});

	res.render('dashboard/pages/productlist', { title: 'Product List', products: products }
	);
});

router.get('/private/add/:id', isLoggedIn, function (req, res, next) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});
	var product = productdb.filter(function (item) {
		return item.id == productId;
	});

	cart.add(product[0], productId);
	req.session.cart = cart;
	res.redirect('/private/productlist');
});

router.get('/private/viewcart', isLoggedIn, function (req, res, next) {
	if (!req.session.cart) {
		return res.render('dashboard/pages/viewcart', {
			products: null
		});
	}
	var cart = new Cart(req.session.cart);

	console.log(cart.getItems());
	res.render('dashboard/pages/viewcart', {
		title: 'View Cart',
		products: cart.getItems(),
		totalPrice: cart.totalPrice
	});
});

router.get('/private/remove/:id', isLoggedIn, function (req, res, next) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.remove(productId);
	req.session.cart = cart;
	res.redirect('/private/viewcart');
});

router.get('/private/deletecart', isLoggedIn, function (req, res, next) {
	var cart = new Cart(false ? req.session.cart : {});
	req.session.cart = cart;
	res.redirect('/private/viewcart');
});

router.get('/private/checkout', isLoggedIn, function (req, res, next) {
	if (!req.session.cart) {
		return res.render('dashboard/pages/viewcart', {
			products: null
		});
	}
	var cart = new Cart(req.session.cart);

	res.render('dashboard/pages/checkout', {
		title: 'Checkout',
		products: cart.getItems(),
		totalPrice: cart.totalPrice
	});
});

router.get("/private/getOrderByUserID", isLoggedIn, function (req, res, next) {
	getOrderByUserID(req, function (err, data) {
		if (err) { throw err }
		res.render("dashboard/pages/myorders", { title: "My Orders", orders: data, moment: moment });
	});

});

router.post("/private/payment", isLoggedIn, function (req, res, next) {

	addOrder(req, function (err, data) {
		if (err) { res.render("/dashboard/pages/payment_success", { title: "Payment fail" }); }
		console.log(data);
		var cart = new Cart(false ? req.session.cart : {});
		req.session.cart = cart;
		res.render("dashboard/pages/payment_success", { title: "Payment success" });
	});
});

router.get('/private/deleteorder/:orderNumber', isLoggedIn, function (req, res, next) {

	var orderNumber = req.params.orderNumber;
	deleteOrder(orderNumber, function (err, data) {
		if (err) { throw err }
		res.redirect('/private/getOrderByUserID');
	});

});

/** */
export default router;