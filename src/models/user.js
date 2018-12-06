'use strict';
import bna_config from "../../config/bna_config.json";

module.exports=class User{
        
    constructor(userID,userPW,userWL,companyName,type){
        this.$class=bna_config.namespace+"."+type;
        this.userID=userID;
        this.userPW=userPW;
        this.userWL=userWL;
        this.companyName=companyName;
    };
};