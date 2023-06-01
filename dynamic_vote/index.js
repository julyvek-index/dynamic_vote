const http = require('http');
const express = require('express');
const ejs = require('ejs');
const path = require('path');

const authRouter = require('./router/auth');
const userRouter = require('./router/user');
const adminauthRouter = require('./router/admin-auth');
const adminRouter = require('./router/admin');
const sessionsRouter = require('./router/sessions');
const { copyFileSync } = require('fs');

const app = express();
const server = http.createServer(app);

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
});

module.exports = app;