const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');

const app = express();
const port = 3000;

// 정적 파일을 제공하는 미들웨어 추가
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

const jsonFilePath = 'users.json';

// 루트 경로에 대한 처리 추가
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});


// 회원 가입 시 호출되는 부분
app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    // 기존 JSON 파일 읽기
    let users = [];
    try {
        const data = fs.readFileSync(jsonFilePath, 'utf-8');
        users = JSON.parse(data);
    } catch (error) {
        console.error('Error reading JSON file:', error);
    }

    // 새로운 사용자 정보 추가
    const newUser = {
        id: users.length + 1,
        username,
        password,
    };
    users.push(newUser);

    // JSON 파일 쓰기
    try {
        fs.writeFileSync(jsonFilePath, JSON.stringify(users, null, 2), 'utf-8');
        console.log('User added and JSON file updated successfully.');
    } catch (error) {
        console.error('Error writing JSON file:', error);
    }

    res.sendStatus(200);
});

// 로그인 시 호출되는 부분
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 기존 JSON 파일 읽기
    let users = [];
    try {
        const data = fs.readFileSync(jsonFilePath, 'utf-8');
        users = JSON.parse(data);
    } catch (error) {
        console.error('Error reading JSON file:', error);
    }

    // 사용자 인증
    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
        // 로그인 성공 시
        console.log(`Login successful for user: ${username}`);
        req.session.userId = user.id;

        // 클라이언트에게 JSON 응답 보내기
        res.json({ success: true });
    } else {
        // 로그인 실패 시
        console.log(`Login failed for user: ${username}`);
        
        // 클라이언트에게 JSON 응답 보내기
        res.json({ success: false });
    }
});

// 로그아웃 시 호출되는 부분
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});