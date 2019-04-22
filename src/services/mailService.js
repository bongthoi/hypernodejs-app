import MailRepo from "../repositories/mailRepo";

var mailRepo=new MailRepo();

class MailService{
    constructor(){};

    sendMail(_email){
        let method="mailService/sendMail";
        console.log(method+"-->start");
        try {
            let result=mailRepo.sendMail(_email);
            
            console.log(method+"-->success");
            return result;
        } catch (error) {
            console.log(method+"-->fail");
            return error;
        }
    };
}

module.exports=MailService;