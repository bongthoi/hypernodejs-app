"use strict";
import rq from "request-promise";
import private_auth_api from "../../config/private_auth_api.json";
import User from "../models/user";

module.exports = class AuthRepo {
    

    issueIdentity(_user) {
        let result;
        let method = "AuthRepo/issueIdentity/userID: " + _user.id;
        console.log(_user);
        console.log(private_auth_api.api_ip + ":" + private_auth_api.api_port + private_auth_api.api_url + "issueIdentity");
        console.log(method);
        
        const options = {
            method: "POST",
            headers : {		
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'                
            },            
            uri: private_auth_api.api_ip + ":" + private_auth_api.api_port + private_auth_api.api_url + "issueIdentity",       
            body: {                
                "type": _user.type,
                "id":_user.id
            },
            json: true
        };
        return rq(options)
            .then(data => {
                console.log(method + " -->success");
                result=JSON.parse(JSON.stringify(data));                
                return result;
            })
            .catch(err => {
                console.log(method + " -->failed");
                console.log(err);
                return console.log(err);
            });

    };


    createCard(_user) {
        let result;

        let method = "AuthRepo/createCard/userID: " + _user.id;
        console.log(method);
        
        const options = {
            method: "POST",
            headers : {		
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'                
            },            
            uri: private_auth_api.api_ip + ":" + private_auth_api.api_port + private_auth_api.api_url + "createCard",       
            body: {                
                "secret": _user.secret,
                "id":_user.id
            },
            json: true
        };
        return rq(options)
            .then(data => {
                console.log(method + " -->success");
                result=JSON.parse(JSON.stringify(data));                
                return result;
            })
            .catch(err => {
                console.log(method + " -->failed");
                console.log(err);
                return console.log(err);
            });

    };

    

};