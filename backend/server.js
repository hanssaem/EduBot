const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const User = require('./models/User');  // ✅ User 모델 추가
const Note = require('./models/Note');  // ✅ Note 모델 추가

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB 연결
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/notesDB';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB 연결 성공'))
    .catch(err => console.error('❌ MongoDB 연결 실패:', err));

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
// 📌 사용자 추가 (Google 로그인 후 최초 1회)
app.post('/api/users', async (req, res) => {
    try {
        const { id, email } = req.body;
        if (!id || !email) return res.status(400).json({ error: 'ID와 Email이 필요합니다.' });

        // 기존 유저가 있는지 확인
        let user = await User.findOne({ id });
        if (!user) {
            user = new User({ id, email });
            await user.save();
        }

        res.status(201).json({ message: '사용자 등록 성공', user });
    } catch (error) {
        console.error('사용자 저장 중 오류 발생:', error);
        res.status(500).json({ error: '사용자 저장 실패' });
    }
});

// 📌 사용자 정보 가져오기
app.get('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ id });

        if (!user) return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });

        res.status(200).json(user);
    } catch (error) {
        console.error('사용자 조회 중 오류 발생:', error);
        res.status(500).json({ error: '사용자 조회 실패' });
    }
});

/* ✅ 노트 관련 API */
// 📌 노트 추가
app.post('/api/notes', async (req, res) => {
    try {
        const { userId, title, content } = req.body;
        if (!userId || !title || !content) return res.status(400).json({ error: '모든 필드를 입력해주세요.' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });

        const newNote = new Note({ userId, title, content });
        await newNote.save();

        res.status(201).json({ message: '노트 저장 성공', note: newNote });
    } catch (error) {
        console.error('노트 저장 중 오류 발생:', error);
        res.status(500).json({ error: '노트 저장 실패' });
    }
});

// 📌 특정 사용자의 노트 목록 가져오기
app.get('/api/notes/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const notes = await Note.find({ userId });

        res.status(200).json(notes);
    } catch (error) {
        console.error('노트 조회 중 오류 발생:', error);
        res.status(500).json({ error: '노트 조회 실패' });
    }
});

// 📌 노트 삭제
app.delete('/api/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Note.findByIdAndDelete(id);
        res.status(200).json({ message: '노트 삭제 완료' });
    } catch (error) {
        console.error('노트 삭제 중 오류 발생:', error);
        res.status(500).json({ error: '노트 삭제 실패' });
    }
});

// 서버 실행
app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
});
