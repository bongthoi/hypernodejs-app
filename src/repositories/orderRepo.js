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
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            uri: db_config.api_ip + ":" + db_config.api_port + db_config.api_url + order.$class + ".getOrderByUserID/" + _userID,
            json: true
        };

        return rq(options)
            .then(data => {
                console.log(method + "-->success");
                result = JSON.parse(JSON.stringify(data));
                return result;
            })
            .catch(err => {
                console.log(method + " -->failed");
                return null;
            });
    };

    addOrder(_order) {
        let order = new Order();
        order = _order;
        let result;

        let method = "addOrder/OrderRepo: " + order.buyer;

        const options = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            uri: db_config.api_ip + ":" + db_config.api_port + db_config.api_url + order.$class + ".getOrderByUserID",
            body: {
                "$class": order.$class,
                "buyer": order.buyer,
                "seller": order.seller,
                "provider": order.provider,
                "shipper": order.shipper,
                "financeCo": order.financeCo,
                "items": order.items
            },
            json: true
        };
        return rq(options)
            .then(data => {
                console.log(method + " -->success");
                result = JSON.parse(JSON.stringify(data));
                return result;
            })
            .catch(err => {
                console.log(method + " -->failed");
                return console.log(err);
            });

    };

    deleteOrder(_orderNumber) {
        let order = new Order();
        order.orderNumber=_orderNumber;

        let method = "OrderRepo/deleteOrder/orderNumber: " + order.orderNumber;
        console.log(method);
        

        const options = {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            uri: db_config.api_ip + ":" + db_config.api_port + db_config.api_url + order.$class + "/" + order.orderNumber,
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