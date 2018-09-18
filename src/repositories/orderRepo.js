"use strict";
import rq from "request-promise";
import db_config from "../../config/db_config.json";
import Order from '../models/order';


module.exports = class OrderRepo {
    constructor() { };

    getOrderByUserID(_userID) {
        let order = new Order();
        let result;

        let method = "orderRepo/getByID/userID: " + _userID;
        console.log(method);

        
        const options = {
            method: "GET",
            headers : {		
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'                
            },
            uri: db_config.api_ip + ":" + db_config.api_port + db_config.api_url + order.$class + ".getOrderByUserID/" + _userID,
            json: true
        };

        return rq(options)
            .then(data => {
                console.log(method +"-->success");
                result=JSON.parse(JSON.stringify(data));
                return result;
            })
            .catch(err => {
                console.log(method + " -->failed");
                return null;
            });
    };    

};