import bcrypt from 'bcryptjs';
import buyerRepo from "../repositories/buyerRepo";


export var User = new buyerRepo();

export const createUser = (newUser, callback) => {
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(newUser.buyerPW, salt, function(err, hash) {
			newUser.buyerPW = hash;
			User.insert(newUser,callback);
		});
	});
}

export const getUserByEmail = (email, callback) => {

	User.getByID(email)
	.then(data=>{
		return callback(null,data);
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
/*
export const getUserById = (id, callback) => {
	console.log("getUserById="+id);
	  //User.getByID(id, callback);
	  return callback(null,{"$class":"org.acme.Z2BTestNetwork.Buyer","buyerID":"ffff@gmail.com","buyerPW":"$2a$10$RDJ.8BSILEiMCngVGNhiX.fEtLeYMO0gcJyrRLsueUcLpEUtl5vYa","companyName":"ffff"})
}
*/