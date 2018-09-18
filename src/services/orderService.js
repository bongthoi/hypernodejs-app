'use strict';
import OrderRepo from "../repositories/orderRepo";

/** */
var orderRepo=new OrderRepo();

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
