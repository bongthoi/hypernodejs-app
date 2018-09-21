'use strict';
import bna_config from "../../config/bna_config.json";

module.exports=class Product{
    constructor(id,title,description,quantity,price,owner){
        this.$class=bna_config.namespace+".Product";
        this.id=id;
        this.title=title;
        this.description=description;
        this.quantity=quantity;
        this.price=price,
        this.owner=owner;
    };
};