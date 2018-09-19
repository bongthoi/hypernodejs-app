'use strict';
import OrderRepo from "../repositories/orderRepo";
import Order from '../models/order';
/** */
var orderRepo=new OrderRepo();
var Cart = require('../services/cart');


export const getOrderByUserID = (req,callback) => {
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

export const addOrder = (req,callback) => {
    let method="addOrder/orderService";
    console.log(method);
    let cart = new Cart(req.session.cart);
    let items=cart.getItems();
    
    let items_arr=[];
    for(let item of items){
        let temp={};
        temp.id=item.item.id;
        temp.title=item.item.title;
        temp.description=item.item.description;
        temp.price=item.item.price;
        temp.quantity=item.quantity;
        temp.subtotal=item.subtotal;      
        items_arr.push(temp);
    }


    let order=new Order();
    order.buyer=req.session["passport"]["user"];
	order.seller=items[0].item.owner;
	order.provider="unknown";
	order.shipper="unknown";
    order.financeCo="unknown";
    
	order.items=items_arr;
    
   

    orderRepo.addOrder(order)
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

export const deleteOrder = (_orderNumber,callback) => {
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
