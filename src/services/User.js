import bcrypt from 'bcryptjs';
import bna_config from '../../config/bna_config.json';
import UserModel from '../models/user';
import BuyerModel from '../models/buyer';
import BuyerRepo from '../repositories/buyerRepo';
import SellerModel from '../models/seller';
import SellerRepo from '../repositories/sellerRepo';


/** */
var buyerRepo=new BuyerRepo();
var sellerRepo=new SellerRepo();

/** */
export const createUser = (newUser, callback) => {
	
	if(newUser.$class.trim()===bna_config.namespace+".Buyer"){
		let buyer=new BuyerModel(newUser.userID,newUser.userPW,newUser.companyName);

		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(buyer.buyerPW, salt, function(err, hash) {
				buyer.buyerPW = hash;			
				buyerRepo.insert(buyer,callback);
			});
		});
		
	}else{
		let seller=new SellerModel(newUser.userID,newUser.userPW,newUser.companyName);
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(seller.sellerPW, salt, function(err, hash) {
				seller.sellerPW = hash;			
				sellerRepo.insert(seller,callback);
			});
		});
	}	
}

export const getUserById = (email,callback) => {
	
	buyerRepo.getByID(email)
	.then(data=>{	
		return callback(null,new UserModel(data['buyerID'],data['buyerPW'],data['companyName'],"Buyer"));
	})
	.catch(err=>{
		console.log(err);
	});

}

export const comparePassword = (password, hash, callback) => {
	bcrypt.compare(password, hash, function(err, isMatch){
		if(err) throw err;
		callback(null, isMatch);
	});
}
