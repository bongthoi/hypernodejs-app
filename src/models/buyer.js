'use strict';
import bna_config from "../../config/bna_config.json";

module.exports=class Buyer{
        
    constructor(buyerID,buyerPW,buyerWL,companyName){
        this.$class=bna_config.namespace+".Buyer";
        this.buyerID=buyerID;
        this.buyerPW=buyerPW;
        this.buyerWL=buyerWL;
        this.companyName=companyName;
    };

};