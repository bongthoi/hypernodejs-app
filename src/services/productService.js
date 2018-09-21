'use strict';
var ProductRepo = require('../repositories/productRepo');
var Product = require('../models/product');


/** */
var productRepo = new ProductRepo();

module.exports = class ProductService {
    constructor() { };
    getAll(callback) {
        let method = "productService/getAll";
        console.log(method);

        productRepo.getAll(function (err, data) {  
                callback(err,data.body);
        });
    };

    insert(req, callback) {
        let method = "productService/insert";
        console.log(method);

        let product = new Product(null, req.body.title, req.body.description,req.body.quantity, req.body.price, req.body.owner);
        productRepo.insert(product, function (err, data) {
           callback(err,data.body);
        });

    };

    getByID(req, callback) {
        let method = "productService/getByID: " + req.params.id;
        console.log(method);

        productRepo.getByID(req.params.id, function (err, data) {
            callback(err,data.body);
        });

    };

    update(req, callback) {
        let method = "productService/update: " + req.params.id;
        console.log(method);

        let product = new Product(req.params.id, req.body.title, req.body.description,req.body.quantity,req.body.price, req.body.owner);
        productRepo.update(product, function (err, data) {
            callback(err,data.body);
        });

    };

    delete(req, callback) {
        let method = "productService/delete: " + req.params.id;
        console.log(method);

        productRepo.delete(req.params.id, function (err, data) {
            callback(err,data.body);
        });

    };


};