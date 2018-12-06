"use strict";
import rq from "request-promise";
import db_config from "../../config/db_config.json";
import Buyer from "../models/buyer";

module.exports = class BuyerRepo {
    getAll() {
        let buyer = new Buyer();
        let result;

        let method = "buyerRepo/getAll";
        console.log(method);


        const options = {
            method: 'GET',
            headers : {		
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'                
            },
            uri: db_config.api_ip + ":" + db_config.api_port + db_config.api_url + buyer.$class,
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

    insert(_buyer) {
        let buyer = new Buyer(_buyer.buyerID,_buyer.buyerPW,_buyer.buyerWL, _buyer.companyName);
        let result;

        let method = "buyerRepo/insert/buyerID: " + buyer.buyerID;
        console.log(method);
        
        const options = {
            method: "POST",
            headers : {		
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'                
            },            
            uri: db_config.api_ip + ":" + db_config.api_port + db_config.api_url + buyer.$class,       
            body: {
                "$class": buyer.$class,
                "buyerID": buyer.buyerID,
                "buyerPW":buyer.buyerPW,
                "buyerWL":buyer.buyerWL,
                "companyName": buyer.companyName
            },
            json: true
        };
        return rq(options)
            .then(data => {
                console.log(method + " -->success");
                result=JSON.parse(JSON.stringify(data));
                return result;
            })
            .catch(err => {
                console.log(method + " -->failed");
                return console.log(err);
            });

    };

    getByID(_buyerID) {
        let buyer = new Buyer(_buyerID);
        let result;

        let method = "buyerRepo/getByID/buyerID: " + buyer.buyerID;
        console.log(method);


        const options = {
            method: "GET",
            headers : {		
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'                
            },
            uri: db_config.api_ip + ":" + db_config.api_port + db_config.api_url + buyer.$class + "/" + buyer.buyerID,
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
    update(_buyer) {
        let buyer = new Buyer(_buyer.buyerID,_buyer.buyerPW,_buyer.buyerWL, _buyer.companyName);
        let result;

        let method = "buyerRepo/update/buyerID: " + buyer.buyerID;
        console.log(method);
        
        const options = {
            method: "PUT",
            headers : {		
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'                
            },
            uri: db_config.api_ip + ":" + db_config.api_port + db_config.api_url + buyer.$class + "/" + buyer.buyerID,
            body: {
                "$class": buyer.$class,
                "buyerID": buyer.buyerID,
                "buyerPW":buyer.buyerPW,
                "buyerWL":buyer.buyerWL,
                "companyName": buyer.companyName
            },
            json: true
        };

        return rq(options)
            .then(data => {
                console.log(method + " -->success");
                result=JSON.parse(JSON.stringify(data));
                return result;
            })
            .catch(err => {
                console.log(method + " -->failed");
                return console.log(err);
            });
    };

    delete(_buyerID) {
        let buyer = new Buyer(_buyerID);

        let method = "buyerRepo/delete/buyerID: " + buyer.buyerID;
        console.log(method);


        const options = {
            method: "DELETE",
            headers : {		
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'                
            },
            uri: db_config.api_ip + ":" + db_config.api_port + db_config.api_url + buyer.$class + "/" + buyer.buyerID,
            json: true
        };

        return rq(options)
            .then(data => {
                console.log(method + "-->success");
                
                return data;
            })
            .catch(err => {
                console.log(method + " -->failed");
                return console.log(err);
            });
    };

};