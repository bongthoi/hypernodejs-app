'use strict';
import bna_config from "../../config/bna_config.json";

module.exports=class Transaction{
        
    constructor(transactionId,transactionType,transactionInvoked,participantInvoking,identityUsed,eventsEmitted,transactionTimestamp){
        this.$class=bna_config.namespace+".Transaction";
        this.transactionId=transactionId;
        this.transactionType=transactionType;
        this.transactionInvoked=transactionInvoked;
        this.participantInvoking=participantInvoking
        this.identityUsed=identityUsed
        this.eventsEmitted=eventsEmitted
        this.transactionTimestamp=transactionTimestamp
    };

};