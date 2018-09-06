import express from 'express';
let router =  express.Router();
import transactionservice from '../services/transactionService';

var Transaction=new transactionservice();
var t={};
router.get("/",function(req,res){
		
	t=Transaction.getAll(req,res);
	console.log(t);
	res.render('pages/index');
	
	
});


router.get('/dashboard', isLoggedIn, function(req, res){
  	res.render('dashboard/pages/dashboard');
});
router.get('/users/profile', isLoggedIn, function(req, res){
	res.render('dashboard/pages/profile');
});
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
        next();
	}
	else{
        res.redirect("/users/login");
    }
}

export default router;