import bcrypt from 'bcryptjs';
import bna_config from '../../config/bna_config.json';
import UserModel from '../models/user';
import BuyerModel from '../models/buyer';
import BuyerRepo from '../repositories/buyerRepo';
import SellerModel from '../models/seller';
import SellerRepo from '../repositories/sellerRepo';


/** */
var buyerRepo = new BuyerRepo();
var sellerRepo = new SellerRepo();

/** */
export const  createUser =  (newUser, callback) => {

	if (newUser.$class.trim() === bna_config.namespace + ".Buyer") {
		let buyer = new BuyerModel(newUser.userID, newUser.userPW,newUser.userWL, newUser.companyName);

		bcrypt.genSalt(10, function (err, salt) {
			bcrypt.hash(buyer.buyerPW, salt, function (err, hash) {
				buyer.buyerPW = hash;
				buyerRepo.insert(buyer, callback);
			});
		});

	} else {
		let seller = new SellerModel(newUser.userID, newUser.userPW,newUser.userWL, newUser.companyName);
		bcrypt.genSalt(10, function (err, salt) {
			bcrypt.hash(seller.sellerPW, salt, function (err, hash) {
				seller.sellerPW = hash;
				sellerRepo.insert(seller, callback);
			});
		});
	}
}

export const getUserById = (email, callback) => {

	buyerRepo.getByID(email)
		.then(data => {
			if (data != null) {
				return callback(null, new UserModel(data['buyerID'], data['buyerPW'], data['buyerWL'], data['companyName'], "Buyer"));
			} else {
				sellerRepo.getByID(email)
					.then(data => {
						if (data != null) {
							return callback(null, new UserModel(data['sellerID'], data['sellerPW'], data['sellerWL'], data['companyName'], "Seller"));
						} else {
							return callback(null);
						}

					})
					.catch(err => {
						console.log(err);
						return callback(null);
					});
			}

		})
		.catch(err => {
			console.log(err);
			return callback(null);
		});
}

export const comparePassword = (password, hash, callback) => {
	bcrypt.compare(password, hash, function (err, isMatch) {
		if (err) throw err;
		callback(null, isMatch);
	});
}
