"use strict";
import transactionRepo from "../repositories/transactionRepo";
import Transaction from '../models/transaction';
import fs from 'fs';
import path from 'path';
import moment from 'moment';
import ProductService from "../services/productService";

var productdb = JSON.parse(fs.readFileSync(path.join(path.dirname(require.main.filename), 'data', 'products.json')));
var TransactionRepo = new transactionRepo();
var productService = new ProductService();


export const getAllTransaction = (callback) => {
    var trans=[];
    TransactionRepo.getAll()
        .then(data => {
            if (data != null) {
                
                for(let tran of data){
                    if((tran.transactionType).includes("CreateOrder")){
                        
                        let products = productdb.filter(function (item) {
                            return !(tran.participantInvoking).includes(item.owner);
                        });
                        //console.log(products[0].owner);
                        trans.push(new Transaction(tran.transactionId,tran.transactionType,(tran.participantInvoking).slice((tran.participantInvoking).indexOf("#")),products[0].owner,moment(tran.transactionTimestamp).format("YYYY-MM-DD HH:mm:ss")));
                    }
                    
                }

               // console.log(trans);

                return callback(null, trans);
            } else {
                return callback(null);
            }
        })
        .catch(err => {
            console.log(err);
            return callback(null);
        });

}

/**database */
function productsdb(callback){
	productService.getAll(function (err, data) {
		if(err){throw err;};
		return callback(null,data);
	});
}