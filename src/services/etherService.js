import EtherRepo from '../repositories/etherRepo';
import EtherAccount from '../models/etherAccount';

/** */
let etherRepo=new EtherRepo();
let etherAccount=new EtherAccount(null,null,null);

class EtherService{
    constructor(){};

    async getBalance(_address){
        const method='etherService/getBalance';
        console.log(method+' -->start');

        try {
            let balance=await etherRepo.getBalance(_address);

            etherAccount.address=_address;
            etherAccount.ethBalance=balance.ethBalance;
            etherAccount.tokenBalance=balance.tokenBalance;

            console.log(method+' -->success');
            return etherAccount;
        } catch (error) {
            console.log(method+' -->fail');
            return {"errCode":500};
        }
    };
    
    async transferFrom(_addressfrom,_privatekey,_addressto,_value){
        const method='etherService/transferFrom';
        console.log(method+' -->start');

        try {
            let result=await etherRepo.transferFrom(_addressfrom,_privatekey,_addressto,_value);

            console.log(method+' -->success');
            return result;
        } catch (error) {
            console.log(method+' -->fail');
            return {"errCode":500};
        }
    };
};

module.exports=EtherService;