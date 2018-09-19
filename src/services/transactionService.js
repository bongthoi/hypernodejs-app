"use strict";
import transactionRepo from "../repositories/transactionRepo";
import Transaction from '../models/transaction';
import fs from 'fs';
import path from 'path';
import moment from 'moment';

var productdb = JSON.parse(fs.readFileSync(path.join(path.dirname(require.main.filename), 'data', 'products.json')));
var TransactionRepo = new transactionRepo();



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

                return callback(null, trans.sort(date_sort_asc));
            } else {
                return callback(null);
            }
        })
        .catch(err => {
            console.log(err);
            return callback(null);
        });

}

var date_sort_asc = function compare(a, b) {
    var dateA = new Date(a.date);
    var dateB = new Date(b.date);
    return dateA - dateB;
  };
  
  var date_sort_desc = function (date1, date2) {
    // This is a comparison function that will result in dates being sorted in
    // DESCENDING order.
    if (date1 > date2) return -1;
    if (date1 < date2) return 1;
    return 0;
  };