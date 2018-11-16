import bna_config from "../../config/bna_config.json";

class EtherAccount{
    constructor(address,ethBalance,tokenBalance){
        this.$class=bna_config.namespace+".Ethereum";
        this.address=address;
        this.ethBalance=ethBalance;
        this.tokenBalance=tokenBalance;
    }
}

module.exports=EtherAccount;