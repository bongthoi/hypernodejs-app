import express from 'express';
let router =  express.Router();

router.get('/', isLoggedIn, function(req, res){
  	res.render('pages/dashboard');
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
        next();
	}
	else{
        res.redirect("/users/");
    }
}

export default router;