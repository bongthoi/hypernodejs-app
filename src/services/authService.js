'use strict';
import AuthRepo from '../repositories/authRepo';
import User from '../models/user';


/** */
var authRepo = new AuthRepo();

module.exports = class AuthService {
    constructor() { };
    
    async authenticateUser(_user) {
        let method = "AuthService/authenticateUser";
        console.log(method);

        try {
            let data=await authRepo.issueIdentity(_user);
            let userAuth={};
            userAuth.id=_user.id;
            userAuth.type=_user.type;
            userAuth.secret=data.secret;
            console.log(JSON.stringify(userAuth));
            let result=await authRepo.createCard(userAuth);


            console.log(method+' -->success');
            return result;    
        } catch (error) {
            console.log(method+' -->fail');
            return {"errCode":error};
        } 
    };
   

    
};