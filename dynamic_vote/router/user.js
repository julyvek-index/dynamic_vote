var express = require('express')
var router = express.Router();


router.get('/', function(req, res, next){
    res.redirect('/user/vote_auth');
});

router.get('/vote_auth', function(req, res, next){
    res.render('user', { title : 'Express'});
});


module.exports = router;