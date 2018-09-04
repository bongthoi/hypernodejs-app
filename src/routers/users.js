import express from 'express';



let router =  express.Router();

router.get('/', function(req, res){
	res.render('pages/users');
});
router.get('/register', function(req, res){
  	res.render('pages/register');
});


router.get('/login', function(req, res){
  	res.render('pages/login');
});







export default router;