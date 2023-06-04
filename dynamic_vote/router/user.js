var express = require('express');
var session = require('express-session');
var router = express.Router();

// 라우터 설정
router.get('/', function(req, res, next){
    res.redirect('/user/vote_auth');
});

router.get('/vote_auth', function(req, res, next){
    res.render('user', { title: '로그인' });
});

router.get('/vote_list', function(req, res, next){
    res.render('vote_list', { title: '로그인' });
});

router.post('/vote_auth', function(req, res, next){
    var stdIds = ['2021320001', '2021320008', '2021320036']
    var stdId = req.body.std_id; // 입력된 학번

    // 특정 학번을 확인하여 다음 페이지로 이동
    if (stdIds.includes(stdId)) {
        res.render('user');
        console.log("학번 입력 완료");
    } else if (stdId != '') {
        res.render('user', { title: 'Express', msg: '없는 학번' });
        console.log("없는 학번");
    }
});

module.exports = router;
