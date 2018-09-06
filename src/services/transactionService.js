"use strict";
import transactionRepo from "../repositories/transactionRepo";
import Transaction from "../models/transaction";


var TransactionRepo = new transactionRepo();

module.exports = class TransactionService {
    constructor(){};
    getAll(req, res) {
        let method = "transactionService/getAll";


        TransactionRepo.getAll()
            .then(data => {
                console.log(method + " -->success");
                return data;
            })
            .catch(error => {
                console.log(method + " -->failed: " + error.message);
                res.sendStatus(500).json({"result":"failed","error":+error.message});
            });

    };
    
};