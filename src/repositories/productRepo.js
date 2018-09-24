'use strict';
import rq from "request-promise";
import db_config from "../../config/db_config.json";
import Product from '../models/product';


module.exports = class ProductRepo {

    getAll(callback) {
        let method = "productRepo/getAll";
        console.log(method);

        let product = new Product();
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            uri: db_config.api_ip + ":" + db_config.api_port + db_config.api_url + product.$class,
            json: true
        };

        return rq(options, function (err, data) {
            return callback(err, data);
        });
    };

    insert(_product, callback) {
        let method = "productRepo/insert";
        console.log(method);

        let product = new Product(null, _product.title, _product.description, _product.quantity, _product.price, _product.owner);
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            uri: db_config.api_ip + ":" + db_config.api_port + db_config.api_url + product.$class,
            body: {
                "title": product.title,
                "description": product.description,
                "quantity": product.quantity,
                "price": product.price,
                "owner": product.owner
            },
            json: true
        };
        return rq(options, function (err, data) {
            return callback(err, data);
        });
    };

    getByID(_productID, callback) {
        let method = "productRepo/getByID/productID: " + _productID;
        console.log(method);

        let product = new Product();
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            uri: db_config.api_ip + ":" + db_config.api_port + db_config.api_url + product.$class + "/" + _productID,
            json: true
        };

        return rq(options, function (err, data) {
            return callback(err, data);
        });
    };

    getByOwner(_owner, callback) {
        let method = "productRepo/getByOwner/owner: " + _owner;
        console.log(method);

        let product = new Product();
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            uri: db_config.api_ip + ":" + db_config.api_port + db_config.api_url + product.$class + "ByOwner/" + _owner,
            json: true
        };

        return rq(options, function (err, data) {
            return callback(err, data);
        });
    };

    update(_product, callback) {
        let method = "productRepo/update/productID: " + _product;
        console.log(method);

        let product = new Product(_product.id, _product.title, _product.description, _product.quantity, _product.price, _product.owner);
        const options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            uri: db_config.api_ip + ":" + db_config.api_port + db_config.api_url + product.$class+"/"+product.id,
            body: {
                "title": product.title,
                "description": product.description,
                "quantity": product.quantity,
                "price": product.price,
                "owner": product.owner
            },
            json: true
        };
        return rq(options, function (err, data) {
            return callback(err, data);
        });
    };
    delete(_productID, callback) {
        let method = "productRepo/delete/productID: " + _productID;
        console.log(method);

        let product = new Product();
        const options = {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            uri: db_config.api_ip + ":" + db_config.api_port + db_config.api_url + product.$class + "/" + _productID,
            json: true
        };

        return rq(options, function (err, data) {
            return callback(err, data);
        });
    };
}