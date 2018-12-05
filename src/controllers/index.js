import express from "express";
import moment from "moment";
import path from "path";
import fs from "fs";
import swal from "sweetalert";
import wallet_config from '../../config/wallet_config.json';
import passport from "passport";
import Cart from '../services/cart';
import { createUser, comparePassword, getUserById } from "../services/User";
import { getAllTransaction } from "../services/transactionService";
import { getOrderByUserID, addOrder, deleteOrder } from "../services/orderService";
import ProductService from "../services/productService";
import { getProductsByUserID } from "../services/statisticService";
import EtherService from '../services/etherService';
import User from "../models/user";



/**variable declare */
let LocalStrategy = require("passport-local").Strategy;
let router = express.Router();
let userModel = {};
var productService = new ProductService();
var etherService = new EtherService();

/**public */
router.get("/", function (req, res) {
	//res.redirect("/transactions");
	res.render("public/index", { title: "Home" });
});


router.get("/transactions", function (req, res) {
	getAllTransaction(function (err, data) {
		if (err) { throw err }
		res.render("public/transactions", { title: "Transactions List", Trans: data, moment: moment });
	});

});

router.get("/users/register", function (req, res) {
	res.render("public/register", { title: "Register" });
});

router.get("/users/login", function (req, res) {
	res.render("public/login", { title: "Login User" });
});

router.post("/users/register", function (req, res) {
	let cpn_name = req.body.cpn_name;
	let email = req.body.email;
	let password = req.body.password;
	let cfm_pwd = req.body.cfm_pwd;
	let userType = req.body.user_type;

	req.checkBody("email", "Email is required").notEmpty();
	req.checkBody("email", "Please enter a valid email").isEmail();
	req.checkBody("password", "Password is required").notEmpty();
	req.checkBody("cfm_pwd", "Confirm Password is required").notEmpty();
	req.checkBody("cfm_pwd", "Confirm Password Must Matches With Password").equals(password);
	req.checkBody("cpn_name", "Company Name is required").notEmpty();

	let errors = req.validationErrors();
	if (errors) {
		res.render("public/register", { title: "Register", errors: errors });
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
		req.flash("success_message", "You have registered, Now please login");
		res.redirect("login");
	}
});

router.post("/users/login", passport.authenticate("local", {
	failureRedirect: "/users/login", failureFlash: true
}),
	function (req, res) {
		req.flash("success_message", "You are now Logged in!!");
		res.redirect("/private/dashboard");
	}
);

router.get("/users/logout", function (req, res) {
	req.logout();
	req.flash("success_message", "You are logged out");
	res.redirect("/users/login");
});


router.get("/private/dashboard", isLoggedIn, function (req, res) {
	if (((req.session.user).$class).includes("Buyer")) {
		res.render("dashboard/partials/buyer/dashboard");
	} else {
		res.render("dashboard/partials/seller/dashboard");
	}

});


/**passportjs */
passport.use(new LocalStrategy({
	usernameField: "email",
	passwordField: "password",
	passReqToCallback: true
},
	function (req, email, password, done) {
		getUserById(email, function (err, user) {

			if (err) { return done(err); }
			if (!user) {
				return done(null, false, req.flash("error_message", "No email is found"));
			}
			comparePassword(password, user.userPW, function (err, isMatch) {
				if (err) { return done(err); }
				if (isMatch) {
					req.session.user = user;
					return done(null, user, req.flash("success_message", "You have successfully logged in!!"));
				}
				else {
					return done(null, false, req.flash("error_message", "Incorrect Password"));
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

/**BUYER */
router.get("/private/buyer/profile", isLoggedIn, function (req, res) {
	console.log("user passport=" + req.session["passport"]["user"]);
	res.render("dashboard/buyer/profile", { title: "Profile Info" });
});

router.get("/private/buyer/transactions", isLoggedIn, function (req, res) {
	getAllTransaction(function (err, data) {
		if (err) { throw err }
		res.render("dashboard/buyer/transactions", { title: "Transactions List", Trans: data, moment: moment });
	});

});

/**cart */
router.get("/private/buyer/productlist", isLoggedIn, function (req, res, next) {
	var cart = new Cart(req.session.cart ? req.session.cart : {});
	req.session.cart = cart;

	productsdb(function (err, data) {
		if (err) { throw err; }

		let products = data.filter(function (item) {
			return !(req.session["passport"]["user"]).includes(item.owner);
		});
		res.render("dashboard/buyer/productlist", { title: "Product List", products: products ,symbol:wallet_config.symbol});
	});
});

router.get("/private/buyer/add/:id", isLoggedIn, function (req, res, next) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});
	productsdb(function (err, data) {
		if (err) { throw err; }
		let product = data.filter(function (item) {
			return item.id == productId;
		});
		cart.add(product[0], productId);
		req.session.cart = cart;
		res.redirect("/private/buyer/productlist");
	});
});

router.get("/private/buyer/viewcart", isLoggedIn, function (req, res, next) {
	if (!req.session.cart) {
		return res.render("dashboard/buyer/viewcart", {
			products: null
		});
	}
	var cart = new Cart(req.session.cart);

	console.log(cart.getItems());
	res.render("dashboard/buyer/viewcart", {
		title: "View Cart",
		products: cart.getItems(),
		totalPrice: cart.totalPrice,
		symbol:wallet_config.symbol
	});
});

router.get("/private/buyer/remove/:id", isLoggedIn, function (req, res, next) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.remove(productId);
	req.session.cart = cart;
	res.redirect("/private/buyer/viewcart");
});

router.get("/private/buyer/deletecart", isLoggedIn, function (req, res, next) {
	var cart = new Cart(false ? req.session.cart : {});
	req.session.cart = cart;
	res.redirect("/private/buyer/viewcart");
});

router.get("/private/buyer/checkout", isLoggedIn, function (req, res, next) {
	if (!req.session.cart) {
		return res.render("dashboard/buyer/viewcart", {
			products: null
		});
	}
	var cart = new Cart(req.session.cart);

	res.render("dashboard/buyer/checkout", {
		title: "Checkout",
		products: cart.getItems(),
		totalPrice: cart.totalPrice,
		symbol:wallet_config.symbol
	});
});

router.get("/private/buyer/getOrderByUserID", isLoggedIn, function (req, res, next) {
	getOrderByUserID(req, function (err, data) {
		if (err) { throw err }
		res.render("dashboard/buyer/myorders", { title: "My Orders", orders: data,symbol:wallet_config.symbol ,moment: moment });
	});

});

router.post("/private/buyer/payment", isLoggedIn, async function (req, res, next) {

	req.checkBody("vscaddressfrom", "Address is required").notEmpty();
	req.checkBody("vscprivatekey", "Private key is required").notEmpty();
	let errors = req.validationErrors();
	if (errors) {
		var cart = new Cart(req.session.cart);

		res.render("dashboard/buyer/checkout", {
			title: "Checkout",
			products: cart.getItems(),
			totalPrice: cart.totalPrice,
			errors: errors,
			symbol:wallet_config.symbol
		});
	} else {

		let balance = await etherService.getBalance(req.body.vscaddressfrom);
		if (Number(balance.tokenBalance) >= Number(req.session.cart.totalPrice)) {
			try {
				var result = await etherService.transferFrom(req.body.vscaddressfrom, req.body.vscprivatekey, wallet_config.receiverAccount, Number(req.session.cart.totalPrice));
				
				addOrder(req, function (err, data) {
					if (err) { res.render("/dashboard/pages/payment_success", { title: "Payment fail", msg: "Order is failed" }); }
					//console.log(data);
					var cart = new Cart(false ? req.session.cart : {});
					req.session.cart = cart;
					console.log("Gateway Payment=" + JSON.stringify(result));
					res.render("dashboard/buyer/payment_success", { title: "Payment success", msg: ""+ JSON.stringify(result)});
				});
			} catch (error) {
				res.render("dashboard/buyer/payment_success", { title: "Payment fail", msg: "The gateway payment is errors" });
			}

		} else {
			res.render("dashboard/buyer/payment_success", { title: "Payment fail", msg: "You haven't enough token to pay" });

		}
	}

});

router.get("/private/buyer/deleteorder/:orderNumber", isLoggedIn, function (req, res, next) {

	var orderNumber = req.params.orderNumber;
	deleteOrder(orderNumber, function (err, data) {
		if (err) { throw err }
		res.redirect("/private/buyer/getOrderByUserID");
	});

});

router.get("/private/buyer/getProducts_Statistic", isLoggedIn, function (req, res, next) {
	getProductsByUserID(req, function (err, data) {
		if (err) { throw err };
		var chartQtyData = [["statistic", "quyantity"]];
		var chartMoneyData = [["statistic", "money"]];
		for (let item of data) {
			chartQtyData.push([item.title, item.quantity]);
			chartMoneyData.push([item.title, item.subtotal]);
		}
		res.render("dashboard/buyer/products_statistic", { title: "Products Statistic", products: data,symbol:wallet_config.symbol, chartQtyData: JSON.stringify(chartQtyData), chartMoneyData: JSON.stringify(chartMoneyData) });
	});
});

/**SELLER */
router.get("/private/seller/profile", isLoggedIn, function (req, res) {
	console.log("user passport=" + req.session["passport"]["user"]);
	res.render("dashboard/seller/profile", { title: "Profile Info" });
});

router.get("/private/seller/transactions", isLoggedIn, function (req, res) {
	getAllTransaction(function (err, data) {
		if (err) { throw err }
		res.render("dashboard/seller/transactions", { title: "Transactions List", Trans: data, moment: moment });
	});

});
/**products */
router.get("/private/seller/getallproducts", isLoggedIn, function (req, res) {
	productService.getAll(function (err, data) {
		if (err) { throw err; }
		console.log(data);
		res.render("dashboard/seller/productlist", { title: "Product List", products: data,symbol:wallet_config.symbol });
	});

});

router.get("/private/seller/getProductByOwner", isLoggedIn, function (req, res) {
	productService.getByOwner(req, function (err, data) {
		if (err) { throw err; }
		console.log(data);
		res.render("dashboard/seller/productlist", { title: "Product List", products: data ,symbol:wallet_config.symbol});
	});

});

router.post("/private/seller/insertproduct", isLoggedIn, function (req, res) {
	productService.insert(req, function (err, data) {
		if (err) { throw err; }
		res.redirect("/private/seller/getProductByOwner");
	});

});
router.get("/private/seller/getbyid/:id", isLoggedIn, function (req, res) {
	productService.getByID(req, function (err, data) {
		if (err) { throw err; }
		res.render("dashboard/seller/productedit", { title: "Product Edit", product: data });
	});

});
router.post("/private/seller/updateproduct/:id", isLoggedIn, function (req, res) {
	productService.update(req, function (err, data) {
		if (err) { throw err; }
		res.redirect("/private/seller/getProductByOwner");
	});

});
router.get("/private/seller/deleteproduct/:id", isLoggedIn, function (req, res) {
	productService.delete(req, function (err, data) {
		if (err) { throw err; }
		res.redirect("/private/seller/getProductByOwner");
	});

});
/**statistic */
router.get("/private/seller/getProducts_Statistic", isLoggedIn, function (req, res, next) {
	productService.getByOwner(req, function (err, data) {
		if (err) { throw err };
		var chartQtyData = [["statistic", "quyantity"]];
		var chartMoneyData = [["statistic", "money"]];
		for (let item of data) {
			chartQtyData.push([item.title, item.quantity]);
			chartMoneyData.push([item.title, item.quantity * item.price]);
		}
		res.render("dashboard/seller/products_statistic", { title: "Products Statistic", products: data,symbol:wallet_config.symbol ,chartQtyData: JSON.stringify(chartQtyData), chartMoneyData: JSON.stringify(chartMoneyData) });
	});
});

/**database */
function productsdb(callback) {
	productService.getAll(function (err, data) {
		if (err) { throw err; };
		return callback(null, data);
	});
}

/**ETHER GATEWAY PAYMENT */
router.get("/private/buyer/getBalanceForm", isLoggedIn, (req, res) => {
	let etherAccount = null;
	res.render("dashboard/buyer/check_ether_balance", { title: "Check Balance", etherAccount: etherAccount });
});

router.post("/private/buyer/getBalance", isLoggedIn, async (req, res) => {
	let etherAccount = null;
	req.checkBody("address", "Private key is required").notEmpty();
	let errors = req.validationErrors();
	if (errors) {
		res.render("dashboard/buyer/check_ether_balance", { title: "Check Balance", etherAccount: etherAccount, errors: errors });
	} else {
		let error_message="The address is not exist";
		etherAccount = await etherService.getBalance(req.body.address);
		if (etherAccount.errCode == 500) {
			etherAccount=null;
			res.render("dashboard/buyer/check_ether_balance", { title: "Check Balance", etherAccount: etherAccount, error_message:error_message});
		} else {
			res.render("dashboard/buyer/check_ether_balance", { title: "Check Balance", etherAccount: etherAccount,symbol:wallet_config.symbol });
		}
	}
});

/** */
export default router;