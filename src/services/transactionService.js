"use strict";
import transactionRepo from "../repositories/transactionRepo";
var TransactionRepo = new transactionRepo();


export const getAllTransaction = (callback) => {
    TransactionRepo.getAll()
        .then(data => {
            if (data != null) {
                return callback(null, data);
            } else {
                return callback(null);
            }
        })
        .catch(err => {
            console.log(err);
            return callback(null);
        });

}