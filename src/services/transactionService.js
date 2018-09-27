"use strict";
import Date_utility from '../utilities/date_utility';
import transactionRepo from "../repositories/transactionRepo";
import Transaction from '../models/transaction';
import fs from 'fs';
import path from 'path';
import moment from 'moment';
import ProductService from "../services/productService";

//var productdb = JSON.parse(fs.readFileSync(path.join(path.dirname(require.main.filename), 'data', 'products.json')));
var TransactionRepo = new transactionRepo();
var productService = new ProductService();


export const getAllTransaction = async (callback) => {
    var trans=[];
    
    await productsdb((err,productdb)=>{
    if(err){return console.log("Error: "+err);}  
    
    TransactionRepo.getAll()
        .then(data => {
            if (data != null) {
                for(let tran of data){
                    if((tran.transactionType).includes("CreateOrder")){

                        let products = productdb.filter(function (item) {
                            return !(tran.participantInvoking).includes(item.owner);
                        });
                        //console.log(products[0].owner);
                        trans.push(new Transaction(tran.transactionId,tran.transactionType,(tran.participantInvoking).slice((tran.participantInvoking).indexOf("#")),products[0].owner,tran.transactionTimestamp));
                    }                    
                }
               // console.log(trans);
                return callback(null, trans.sort(sort_desc_date));
            } else {
                return callback(null);
            }
        })
        .catch(err => {
            console.log(err);
            return callback(null);
        });
    });
}

let productsdb= (callback)=>{
   productService.getAll(function (err, data) {
        if(err){return new Error(err);};
		return callback(null,data);
    });
    
}

function sort_desc_date (left, right) {
    return moment.utc(right.transactionTimestamp).diff(moment.utc(left.transactionTimestamp))
}