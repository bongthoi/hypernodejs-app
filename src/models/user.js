'use strict';
import bna_config from "../../config/bna_config.json";

module.exports=class User{
        
    constructor(email,password,companyName){
        this.$class=bna_config.namespace+".User";
        this.email=email;
        this.password=password;
        this.name=companyName;
    };
};