import express from 'express';
let router =  express.Router();

router.get('/',  function(req, res){
  	res.render('pages/index');
});


export default router;