'use strict';
import bna_config from "../../config/bna_config.json";

module.exports=class Seller{
        
    constructor(sellerID,sellerPW,companyName){
        this.$class=bna_config.namespace+".Seller";
        this.sellerID=sellerID;
        this.sellerPW=sellerPW;
        this.companyName=companyName;
    };

};