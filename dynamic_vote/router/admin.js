var express = require('express')
var router = express.Router();

const multer = require('multer');

const mysql = require('mysql2');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 파일 저장 경로 설정
        cb(null, 'public/profile/');
    },
    filename: function (req, file, cb) {
        // 파일 이름 설정
        const originalName = file.originalname;
        const extension = originalName.substring(originalName.lastIndexOf('.'));
        const fileName = Date.now() + extension;
        cb(null, fileName);
    }
});


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

router.post('/candidate_endpoint', (req, res, next) => {
    console.log('request to endpoint')
    const connection = mysql.createConnection({
        database: 'dynamic_vote',
        host: 'localhost',
        user: 'root',
        password: 'indexroot7&'
    })
    connection.query('SELECT * FROM candidate', (err, results) => {
        if (err) {
            console.error('오류:', err);
            return res.status(400).send({ message: '동기화 실패.' });
        }

        if (results.length === 0) {
            return res.status(200).send({ message: '후보자가 없습니다.' });
        } else {
            return res.status(200).send({ message: '동기화 성공', data: results });
        }
    });
});


const upload = multer({ storage: storage });

router.post('/submit-candidate', upload.single('input_photo'), (req, res) => {
    const connection = mysql.createConnection({
        database: 'dynamic_vote',
        host: 'localhost',
        user: 'root',
        password: 'indexroot7&'
    })
    // 폼 데이터 및 업로드된 파일 정보 사용 가능
    const { name, hash_tag_1, hash_tag_2, hash_tag_3, explain, message, color, stdnum, promise1, promise2, promise3, promise4, promise5, promise6, voteExpiration, voteExpirationTime } = req.body;
    const photoFileName = req.file.filename;

    console.log(hash_tag_1, hash_tag_2, hash_tag_3)
    if (stdnum.length < 0) {
        return res.status(400).send({ message: '학번 필드를 입력해주세요.' });
    }
    // 필수 입력 필드 확인
    if (!name || !explain || !message) {
        return res.status(400).send({ message: '필수 입력 필드를 모두 채워주세요.' });
    }
    // 최소 1개 이상의 Promise 입력 확인
    if (!promise1 && !promise2 && !promise3 && !promise4 && !promise5 && !promise6) {
        return res.status(400).send({ message: '공약을 최소 1개 이상 입력해주세요.' });
    }
    // 투표 마감 기한 확인
    const currentDateTime = new Date().toISOString();
    const selectedDateTime = new Date(voteExpiration + ' ' + voteExpirationTime).toISOString();
    if (selectedDateTime <= currentDateTime) {
        return res.status(400).send({ message: '유효한 투표 마감 기한을 선택해주세요.' });
    }

    connection.query('SELECT COUNT(*) AS count FROM Candidate WHERE CandidateID = ?', [stdnum], (err, results) => {
        if (err) {
            console.error(err);
            return;
        }

        const count = results[0].count;

        const hash_tag = {
            hash_tag_1: hash_tag_1 || null,
            hash_tag_2: hash_tag_2 || null,
            hash_tag_3: hash_tag_3 || null,
        }

        const promise = {
            promise1: promise1 || null,
            promise2: promise2 || null,
            promise3: promise3 || null,
            promise4: promise4 || null,
            promise5: promise5 || null,
            promise6: promise6 || null
        }

        if (count > 0) {
            return res.send({ message: '이미 등록되어 있는 후보자입니다.' });
        } else {
            // 데이터 삽입 쿼리 실행
            const candidateData = {
                CandidateID: stdnum,
                name: name,
                hash_tag: JSON.stringify(hash_tag),
                promise: JSON.stringify(promise),
                Speech: explain,
                message: message,
                youtube_link: '',
                profile_card: photoFileName,
                profile_card_color: color
            };

            connection.query('INSERT INTO Candidate SET ?', candidateData, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({ message: '서버 오류' });
                }

                return res.status(200).send({ message: '후보자 정보가 등록되었습니다.' });
            });
        }
    });
});


module.exports = router;