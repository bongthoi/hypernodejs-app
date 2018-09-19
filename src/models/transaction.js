'use strict';
import bna_config from "../../config/bna_config.json";

module.exports=class Transaction{
        
    constructor(transactionId,transactionType,participantInvoking,transactionInvoked,transactionTimestamp){
        this.$class=bna_config.namespace+".Transaction";
        this.transactionId=transactionId;
        this.transactionType=transactionType;
        //this.transactionInvoked=transactionInvoked;
        this.from=participantInvoking;
        this.to=transactionInvoked;
        //this.identityUsed=identityUsed
        //this.eventsEmitted=eventsEmitted
        this.transactionTimestamp=transactionTimestamp
    };

};