import rq   from    'request-promise';
import gateway_payment_config from '../../config/gateway_payment_config';


class   EtherRepo{
    constructor(){};
    getBalance(_address){
        let method="etherRepo/getBalance";
        console.log(method+" -->start");

        const options={
            method:"POST",
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            uri:gateway_payment_config.gateway_ip+":"+gateway_payment_config.gateway_port+gateway_payment_config.gateway_api_url+"getBalance",
            body: {
                "address": _address                
            },
            json:true
        };

        return new Promise((resolve,reject)=>{
            rq(options,function(error,result){
                if(error){
                    console.log(method+" -->failed");
                    return reject(new Error(error));
                }else{
                    console.log(method+" -->success");
                    return resolve(result.body);
                }
            });
        });

    }
}

module.exports=EtherRepo;