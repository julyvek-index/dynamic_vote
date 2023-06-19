var express = require('express')
var router = express.Router();
const mysql = require('mysql2');


router.get('/', function (req, res, next) {
    res.render('admin', { title: 'Express' });
});

router.post('/auth', function (req, res, next) {
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
        } else {
            req.session.studentId = stdId;
            res.redirect('add_candidate');
        }
    });
});

router.get('/add_candidate', function (req, res, next) {
    if (!req.session.studentId) {
        res.render('admin');
    }
    else {
        res.render('add_candidate');
    }
});


router.get('/edit_candidate', function (req, res, next) {
    if (!req.session.studentId) {
        res.render('admin');
    }
    else {
        res.render('edit_candidate');
    }
});
module.exports = router;