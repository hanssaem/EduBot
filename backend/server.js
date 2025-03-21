const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const admin = require('firebase-admin');
require('dotenv').config();

const User = require('./models/User');  // ✅ User 모델 추가
const Note = require('./models/Note');  // ✅ Note 모델 추가

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Firebase Admin SDK 초기화
const serviceAccount = require('./firebase-admin-sdk.json'); // ⚠️ 서비스 계정 JSON 필요!
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// ✅ MongoDB 연결
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/notesDB';
mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB 연결 성공'))
    .catch(err => console.error('❌ MongoDB 연결 실패:', err));

// ✅ Firebase JWT 검증 미들웨어
const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split('Bearer ')[1]; // "Bearer <token>"
    if (!token) return res.status(401).json({ error: '인증 토큰이 필요합니다.' });

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // 요청 객체에 사용자 정보 저장
        next();
    } catch (error) {
        return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
    }
};

const apiKey = process.env.OPENAI_API_KEY;
const apiEndpoint = 'https://api.openai.com/v1/chat/completions';

app.post('/api/chat', async (req, res) => {
    const { prompt } = req.body;

    const requestOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        data: {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.8,
            max_tokens: 1024,
        },
    };

    try {
        const response = await axios.post(apiEndpoint, requestOptions.data, {
            headers: requestOptions.headers,
        });
        const aiResponse = response.data.choices[0].message.content;
        res.json({ reply: aiResponse });
    } catch (error) {
        console.error('OpenAI API 호출 중 오류 발생:', error);
        res.status(500).send('Error from OpenAI API');
    }
});

/* ✅ 사용자 관련 API */
// 📌 사용자 정보 저장 (Google 로그인 후)

app.post("/api/auth/login", async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) return res.status(400).json({ error: "ID 토큰이 필요합니다." });

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        console.log("✅ Firebase 인증 성공:", decodedToken);

        const { uid, email } = decodedToken;

        let user = await User.findOne({ id: uid }); // ✅ id 기준 조회

        if (!user) {
            user = new User({ id: uid, email }); // ✅ id 필드 추가
            await user.save();
        }

        res.json({ message: "✅ 로그인 성공", user });
    } catch (error) {
        console.error("❌ 인증 실패:", error);
        res.status(401).json({ error: "Invalid token" });
    }
});


// 📌 사용자 정보 조회
app.get('/api/users/:id', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.params.id });
        if (!user) return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });

        res.status(200).json(user);
    } catch (error) {
        console.error('사용자 조회 중 오류:', error);
        res.status(500).json({ error: '사용자 조회 실패' });
    }
});

/* ✅ 노트 관련 API */
// 📌 노트 추가 (로그인한 사용자만)
app.post('/api/notes', verifyToken, async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.uid; // Firebase UID

        if (!title || !content) return res.status(400).json({ error: '모든 필드를 입력해주세요.' });

        const newNote = new Note({ userId, title, content });
        await newNote.save();

        res.status(201).json({ message: '노트 저장 성공', note: newNote });
    } catch (error) {
        console.error('노트 저장 중 오류:', error);
        res.status(500).json({ error: '노트 저장 실패' });
    }
});

// 📌 특정 사용자의 노트 조회
app.get('/api/notes', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid; // 로그인한 사용자 ID
        const notes = await Note.find({ userId });

        res.status(200).json(notes);
    } catch (error) {
        console.error('노트 조회 중 오류:', error);
        res.status(500).json({ error: '노트 조회 실패' });
    }
});

// 📌 노트 삭제
app.delete('/api/notes/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note.findById(id);

        if (!note) return res.status(404).json({ error: '노트를 찾을 수 없습니다.' });
        if (note.userId !== req.user.uid) return res.status(403).json({ error: '권한이 없습니다.' });

        await Note.findByIdAndDelete(id);
        res.status(200).json({ message: '노트 삭제 완료' });
    } catch (error) {
        console.error('노트 삭제 중 오류:', error);
        res.status(500).json({ error: '노트 삭제 실패' });
    }
});

// ✅ 서버 실행
app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
});
