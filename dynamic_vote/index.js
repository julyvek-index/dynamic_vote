const http = require('http');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');
const session = require('express-session');

const authRouter = require('./router/auth');
const userRouter = require('./router/user');
const adminauthRouter = require('./router/admin-auth');
const adminRouter = require('./router/admin');
const sessionsRouter = require('./router/sessions');

const app = express();
const server = http.createServer(app);



app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true
}));


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'indexroot7&'
})

const create_database = (db_name) => {
    connection.query('CREATE DATABASE IF NOT EXISTS ' + db_name, (err) => {
        if (err) {
            console.error("데이터베이스 생성 오류: ", err);
            return;
        }
        console.log("데이터베이스가 생성되었습니다.");
    });
};

const createTable = (db_name, table, dtype_query) => {
    connection.query(`USE ${db_name}`, (err) => {
        if (err) {
            console.error("USE 문 오류 : ", err);
        }
    })
    connection.query(`CREATE TABLE IF NOT EXISTS ${table} (${dtype_query})`);
};

create_database("dynamic_vote");

const Table = {
    VOTE: "StudentID VARCHAR(16) PRIMARY KEY, CandidateID VARCHAR(16), VoteDate TIMESTAMP, Rigged_vote tinyint(1), ip VARCHAR(30), environment VARCHAR(500)",
    VOTE_INFO: "StudentID VARCHAR(16) PRIMARY KEY, Vote_session_start TIMESTAMP, Vote_session_end TIMESTAMP, Early_deadline TIMESTAMP",
    Student: "StudentID VARCHAR(16) PRIMARY KEY, Name VARCHAR(16), Authenticated TINYINT(1), isVoted TINYINT(1), DepartmentID VARCHAR(20)",
    Candidate: "CandidateID VARCHAR(16) PRIMARY KEY, name VARCHAR(15), hash_tag VARCHAR(300), promise VARCHAR(1000), Speech VARCHAR(1500), message VARCHAR(5000), youtube_link VARCHAR(100), profile_card VARCHAR(55), profile_card_color VARCHAR(30)"
};

Object.keys(Table).forEach((table) => {
    createTable("dynamic_vote", table, Table[table]);
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/static', express.static(path.join(__dirname, 'public')));

const hostname = 'localhost';
const port = 3000;

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/admin-auth', adminauthRouter);
app.use('/admin', adminRouter);
app.use('/sessions', sessionsRouter);

app.set('view engine', 'ejs');
app.set('views', './views');

// app.get('/', (req, res) => {
//     res.render('index');
// })

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
    console.log("======================================================")
    console.log(`Admin Pages running at http://${hostname}:${port}/admin`)
    console.log("======================================================")
    console.log(`User Pages running at http://${hostname}:${port}/user`)
});

module.exports = app;