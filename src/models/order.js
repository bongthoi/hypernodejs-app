'use strict';
const bna_config = require('../../config/bna_config.json');

module.exports = class Order {
   
    constructor() {
        this.$class = bna_config.namespace + ".Order",
        this.orderNumber = "";
        this.items = [];
        this.status = "";
        this.dispute = "";
        this.resolve = "";
        this.backorder = "";
        this.refund = "";
        this.amount = 0;
        this.created = "";
        this.bought = "";
        this.cancelled = "";
        this.ordered = "";
        this.dateBackordered = "";
        this.requestShipment = "";
        this.delivered = "";
        this.delivering = "";
        this.disputeOpened = "";
        this.disputeResolved = "";
        this.paymentRequested = "";
        this.orderRefunded = "";
        this.approved = "";
        this.paid = "";
        this.provider = "";
        this.shipper = "";
        this.buyer = "";
        this.seller = "";
        this.financeCo = "";


    }; 

    setBuyer(buyer) {   
        this.orderNumber = buyer.replace(/@/, '').replace(/\./, '') + Date.now();        
        this.buyer = buyer;  

        return this;
    };


};


