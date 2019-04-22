import rq from "request-promise";
import mail_api_config from "../../config/mail_api_config.json";


class MailRepo{
    constructor(){};

    /**
     * 
     * @param {*} _from 
     * @param {*} _to 
     * @param {*} _subject 
     * @param {*} _content 
     */
    sendMail(_email){
        let method="mailRepo/sendMail";
        console.log(method+" -->start");

        const options={
            method:"POST",
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            uri:mail_api_config.api_ip+":"+mail_api_config.api_port+mail_api_config.api_url+"sendMail",
            body:{
                from:_email.from,
                to:_email.to,
                subject:_email.subject,
                content:_email.content
            },
            json:true
        };

        return new Promise((resolve,reject)=>{
            rq(options,(error,result)=>{
                if(error){
                    console.log(method+" -->failed");
                    return reject(new Error(error));
                }else{
                    console.log(method+" -->success");
                    return resolve(result.body);
                }
            });
        });
    };
}

module.exports=MailRepo;