"use strict";
import rq from "request-promise";
import private_api from "../../config/private_api.json";
import Transaction from "../models/transaction";

module.exports = class TransactionRepo {
    getAll() {
        let trans = new Transaction();
        let result;

        let method = "transactionRepo/getAll";
        //console.log(method+"   "+private_api.api_ip + ":" + private_api.api_port + private_api.api_url + trans.$class);


        const options = {
            method: 'GET',
            headers : {		
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'                
            },
            uri: private_api.api_ip + ":" + private_api.api_port + private_api.api_url + trans.$class,
            json: true
        };
        
       return rq(options)
            .then(data => {
                console.log(method + " -->success");
                result=JSON.parse(JSON.stringify(data));
                return result;
            })
            .catch((err) => {
                console.log(method + " -->failed:");
                return console.log(err);
            });    
    };
   

};