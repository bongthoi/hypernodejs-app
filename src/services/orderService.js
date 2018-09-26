'use strict';
import OrderRepo from "../repositories/orderRepo";
import ProductRepo from '../repositories/productRepo';
import Order from '../models/order';
import Product from '../models/product';
/** */
var orderRepo = new OrderRepo();
var productRepo = new ProductRepo();
var Cart = require('../services/cart');


export const getOrderByUserID = (req, callback) => {
    orderRepo.getOrderByUserID(req.session["passport"]["user"])
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

export const addOrder = async (req, callback) => {
    let method = "addOrder/orderService";
    console.log(method);
    let cart = new Cart(req.session.cart);
    let items = cart.getItems();
    let companyName = (req.session.user).companyName;
    let product_arr = [];
    let items_arr = [];
    for (let item of items) {
        let temp = {};
        temp.id = item.item.id;
        temp.title = item.item.title;
        temp.description = item.item.description;
        temp.price = item.item.price;
        temp.quantity = item.quantity;
        temp.subtotal = item.subtotal;
        items_arr.push(temp);

        //update database
        let temp2 = await productRepo.getAAById(item.item.id);
        temp2[0].quantity = temp2[0].quantity - item.quantity;
        product_arr.push(temp2[0]);

        let product = new Product(temp2[0].id, temp2[0].title, temp2[0].description, temp2[0].quantity, temp2[0].price, temp2[0].owner);
        await productRepo.update(product, function (err, data) {
            if (err) { return console.log(err); }
            console.log("Upadate success!!!");
        });

        let prod = await productRepo.getByTitleandOwner(item.item.title, companyName);


        if (prod.length > 0) {
            //update quantity if exist
            prod[0].quantity = prod[0].quantity + item.quantity;
            let product = new Product(prod[0].id, prod[0].title, prod[0].description, prod[0].quantity, prod[0].price, prod[0].owner);
            await productRepo.update(product, function (err, data) {
                if (err) { return console.log(err); }
                console.log("Upadate success!!!");
            });
        } else {
            //insert new product to database        
            let product1 = new Product(temp.id, temp.title, temp.description, temp.quantity, temp.price, companyName);
            await productRepo.insert(product1, function (err, data) {
                if (err) { return console.log(err); }
                console.log("insert success!!!");
            });
        }



    }
    //addOrder
    let order = new Order();
    order.buyer = req.session["passport"]["user"];
    order.seller = items[0].item.owner;
    order.provider = "unknown";
    order.shipper = "unknown";
    order.financeCo = "unknown";

    order.items = items_arr;

    await orderRepo.addOrder(order)
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

export const deleteOrder = (_orderNumber, callback) => {
    orderRepo.deleteOrder(_orderNumber)
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
