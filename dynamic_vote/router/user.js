const express = require('express');
const session = require('express-session');
const router = express.Router();

const mysql = require('mysql2');
const bcrypt = require('bcrypt');
// 라우터 설정
router.get('/', function (req, res, next) {
    const studentId = req.session.studentId;

    if (!studentId) {
        res.render('user')
    } else {

    }
    res.redirect('/user/vote_auth');
});

router.get('/vote_auth', function (req, res, next) {
    res.render('user', { title: '로그인' });
});

router.get('/vote_list', function (req, res, next) {
    res.render('vote_list', { title: '로그인' });
});

router.post('/vote_auth', function (req, res, next) {
    const stdId = req.body.std_id; // 입력된 학번

    const connection = mysql.createConnection({
        database: 'dynamic_vote',
        host: 'localhost',
        user: 'root',
        password: 'indexroot7&'
    })

    console.log(stdId)
    connection.query('SELECT * FROM student WHERE studentId = ?', [stdId], (err, results) => {
        if (err) {
            console.error('로그인 오류:', err);
            res.send('로그인 실패');
            return;
        }

        if (results.length === 0) {
            res.send('사용자를 찾을 수 없습니다.');
            return;
        }

        const user = results[0];

        // 비밀번호 일치 여부 확인
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error('비밀번호 비교 오류:', err);
                res.send('로그인 실패');
                return;
            }

            if (result) {
                // 세션에 로그인 정보 저장
                req.session.studentId = studentId;
                res.send('로그인 성공');
            } else {
                res.send('비밀번호가 일치하지 않습니다.');
            }
        });
    });


});

module.exports = router;
