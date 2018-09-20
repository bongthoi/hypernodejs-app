'use strict';
import OrderRepo from "../repositories/orderRepo";
/** */
var orderRepo = new OrderRepo();



export const getProductsByUserID = (req, callback) => {
    var method="statistic/statisticService";
    var item_arr = [];
    
    console.log(method);
    orderRepo.getOrderByUserID(req.session["passport"]["user"])
        .then(data => {
            if (data != null) {
                for (let order of data) {
                    for (let item of order.items) {
                        item_arr.push(JSON.parse(item));
                    }
                }
                return callback(null, item_statistic(item_arr));
            } else {
                return callback(null);
            }
        })
        .catch(err => {
            console.log(err);
            return callback(null);
        });

}


var item_statistic = function (item_arr) {
    var arr =[];
    var flag=0;
    var index;

    for (var item of item_arr) {
        for (let j = 0; j <arr.length; j++) {
            if (arr[j].id == item.id) {
                index = j;
                flag=true;
                break;
            } else {
                flag = false;
            }
        }
        if (flag) {
            arr[index].quantity += item.quantity;
            arr[index].subtotal += item.subtotal;
        } else {
            arr.push(item);
        }
    }

    return arr;
}