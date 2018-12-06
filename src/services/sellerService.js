'use strict';
import SellerRepo from '../repositories/sellerRepo';
import Seller from '../models/seller';


/** */
var sellerRepo = new SellerRepo();

module.exports = class SellerService {
    constructor() { };
    
    async getAll() {
        let method = "sellerService/getAll";
        console.log(method);

        try {
            let result=await sellerRepo.getAll();
            console.log(method+' -->success');
            return result;    
        } catch (error) {
            console.log(method+' -->fail');
            return {"errCode":500};
        } 
    };


    async getByID(_id) {
        let method = "sellerService/getByID";
        console.log(method);
        try {
            let result=await sellerRepo.getByID(_id);
            console.log(method+' -->success');
            return result;    
        } catch (error) {
            console.log(method+' -->fail');
            return {"errCode":500};
        }
    };

    async update(_seller) {
        let method = "sellerService/update: ";
        console.log(method);

        try {
            let result=await sellerRepo.update(_seller);
            //let companyName=(req.session.user).companyName;
            return result;
        } catch (error) {
            console.log(method+' -->fail');
            return {"errCode":500};
        }

        
        

    };
};