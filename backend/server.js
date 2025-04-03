const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const admin = require('firebase-admin');
require('dotenv').config();

const User = require('./models/User'); // ✅ User 모델 추가
const Note = require('./models/Note'); // ✅ Note 모델 추가
const Folder = require("./models/Folder");

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
mongoose
  .connect(mongoURI)
  .then(() => console.log('✅ MongoDB 연결 성공'))
  .catch((err) => console.error('❌ MongoDB 연결 실패:', err));

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
  const { messages } = req.body; // 🔥 `prompt` 대신 `messages` 배열 받기

  // 🔥 OpenAI가 이해할 수 있도록 messages 배열을 변환
  const formattedMessages = messages.map((msg) => ({
    role: msg.sender === 'User' ? 'user' : 'assistant',
    content: msg.message,
  }));

  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    data: {
      model: 'gpt-3.5-turbo',
      messages: formattedMessages, // 🔥 전체 히스토리 전달
      temperature: 0.8,
      max_tokens: 2048,
    },
  };

  try {
    const response = await axios.post(apiEndpoint, requestOptions.data, {
      headers: requestOptions.headers,
    });
    const aiResponse = response.data.choices[0].message.content;

    // 🔥 챗봇 응답을 클라이언트에 전달
    res.json({ reply: aiResponse });
  } catch (error) {
    console.error('OpenAI API 호출 중 오류 발생:', error);
    res.status(500).send('Error from OpenAI API');
  }
});

app.post('/api/summarize', async (req, res) => {
  const { messages, prompt, email } = req.body;

  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: '대화 내용이 없습니다.' });
  }

  const formattedMessages = messages.map((msg) => ({
    role: msg.sender === 'User' ? 'user' : 'assistant',
    content: msg.message,
  }));

  // GPT 프롬프트 설정 (요약 + 제목 생성)
  const summaryPrompt = `
    다음 대화를 학습 노트처럼 정리해줘. 핵심 내용을 길고 상세하게 요약하고, 
    가장 적절한 제목도 짧고 직관적으로 제안해줘.
    
    ---
    ${formattedMessages.map((m) => `${m.role}: ${m.content}`).join('\n')}
    
    --- 
    제목: (한 줄로 짧게)
    요약:
    `;

  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    data: {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: summaryPrompt }],
      temperature: 0.7,
      max_tokens: 2048,
    },
  };

  try {
    // OpenAI API 호출
    const response = await axios.post(apiEndpoint, requestOptions.data, {
      headers: requestOptions.headers,
    });

    const aiResponse = response.data.choices[0].message.content;

    // 응답에서 요약과 제목 분리
    const match = aiResponse.match(/제목:\s*(.+)\n요약:\s*(.+)/s);
    if (!match) {
      return res
        .status(500)
        .json({ error: '응답에서 제목과 요약을 추출하지 못했습니다.' });
    }

    const title = match[1].trim();
    const summary = match[2].trim();

    // DB 저장
    await Note.create({
      userId: email,
      title: title,
      content: summary,
      createdAt: new Date(),
    });

    res.json({ message: '요약이 저장되었습니다.', title, summary });
  } catch (error) {
    console.error('OpenAI API 오류:', error);
    res.status(500).json({ error: '요약 생성 중 오류 발생' });
  }
});

/* ✅ 사용자 관련 API */
// 📌 사용자 정보 저장 (Google 로그인 후)
app.post('/api/auth/login', async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) return res.status(400).json({ error: 'ID 토큰이 필요합니다.' });

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('✅ Firebase 인증 성공:', decodedToken);

    const { uid, email } = decodedToken;

    let user = await User.findOne({ id: uid }); // ✅ id 기준 조회

    if (!user) {
      user = new User({ id: uid, email }); // ✅ id 필드 추가
      await user.save();
    }

    res.json({ message: '✅ 로그인 성공', user });
  } catch (error) {
    console.error('❌ 인증 실패:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// 📌 사용자 정보 조회
app.get('/api/users/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.id });
    if (!user)
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });

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

    if (!title || !content)
      return res.status(400).json({ error: '모든 필드를 입력해주세요.' });

    const newNote = new Note({ userId, title, content });
    await newNote.save();

    res.status(201).json({ message: '노트 저장 성공', note: newNote });
  } catch (error) {
    console.error('노트 저장 중 오류:', error);
    res.status(500).json({ error: '노트 저장 실패' });
  }
});

// 📌 특정 사용자의 노트 조회 (이메일 기반)
app.get('/api/notes', verifyToken, async (req, res) => {
  try {
    const userId = req.user.email; // 로그인한 사용자 이메일
    const notes = await Note.find({ userId }); // 이메일로 조회

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

    if (!note)
      return res.status(404).json({ error: '노트를 찾을 수 없습니다.' });
    if (note.userId !== req.user.uid)
      return res.status(403).json({ error: '권한이 없습니다.' });

    await Note.findByIdAndDelete(id);
    res.status(200).json({ message: '노트 삭제 완료' });
  } catch (error) {
    console.error('노트 삭제 중 오류:', error);
    res.status(500).json({ error: '노트 삭제 실패' });
  }
});

// 📌 노트 수정
app.patch('/api/notes/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params; // 📌 URL에서 노트 ID 추출
    const { title, content } = req.body; // 📌 수정할 데이터 가져오기
    const userId = req.user.uid; // 📌 Firebase UID 확인 (로그인한 사용자)

    // 1️⃣ 노트가 존재하는지 확인
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ error: '노트를 찾을 수 없습니다.' });
    }

    // 2️⃣ 노트 작성자와 로그인한 사용자가 일치하는지 확인
    if (note.userId !== userId) {
      return res.status(403).json({ error: '수정 권한이 없습니다.' });
    }

    // 3️⃣ 제목이나 내용이 제공되었는지 확인하고 업데이트
    if (title) note.title = title;
    if (content) note.content = content;
    await note.save(); // MongoDB에 업데이트 저장

    res.status(200).json({ message: '노트 수정 완료', note });
  } catch (error) {
    console.error('노트 수정 중 오류:', error);
    res.status(500).json({ error: '노트 수정 실패' });
  }
});

//특정 폴더에 속한 노트 조회 API
app.get('/api/folders/:folderId/notes', verifyToken, async (req, res) => {
  try {
    const { folderId } = req.params; // 📌 URL에서 폴더 ID 가져오기
    const userId = req.user.uid; // 📌 로그인한 사용자 ID 확인 (Firebase UID)

    // 1️⃣ 폴더 존재 여부 확인
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ error: '폴더를 찾을 수 없습니다.' });
    }

    // 2️⃣ 폴더 소유자가 로그인한 사용자와 일치하는지 확인
    if (folder.userId !== userId) {
      return res.status(403).json({ error: '폴더 접근 권한이 없습니다.' });
    }

    // 3️⃣ 해당 폴더에 속한 노트 조회
    const notes = await Note.find({ folderId, userId });

    res.status(200).json({ message: '폴더 내 노트 조회 성공', notes });
  } catch (error) {
    console.error('폴더별 노트 조회 오류:', error);
    res.status(500).json({ error: '폴더별 노트 조회 실패' });
  }
});

//폴더 이동 api
app.patch('/api/notes/:noteId/move', verifyToken, async (req, res) => {
  try {
    const { noteId } = req.params; // 📌 이동할 노트 ID 가져오기
    const { targetFolderId } = req.body; // 📌 새로운 폴더 ID 가져오기
    const userId = req.user.uid; // 📌 로그인한 사용자 ID 확인 (Firebase UID)

    // 1️⃣ 노트가 존재하는지 확인
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ error: '노트를 찾을 수 없습니다.' });
    }

    // 2️⃣ 노트의 소유자가 로그인한 사용자와 일치하는지 확인
    if (note.userId !== userId) {
      return res.status(403).json({ error: '이동 권한이 없습니다.' });
    }

    // 3️⃣ 대상 폴더가 존재하는지 확인
    if (targetFolderId) {
      const targetFolder = await Folder.findById(targetFolderId);
      if (!targetFolder) {
        return res.status(404).json({ error: '이동할 폴더를 찾을 수 없습니다.' });
      }

      // 4️⃣ 폴더 소유자가 동일한 사용자인지 확인
      if (targetFolder.userId !== userId) {
        return res.status(403).json({ error: '이동할 폴더에 대한 접근 권한이 없습니다.' });
      }
    }

    // 5️⃣ 노트의 folderId 업데이트
    note.folderId = targetFolderId || null; // 📌 null이면 폴더 없음 상태로 이동
    await note.save();

    res.status(200).json({ message: '노트 폴더 이동 완료', note });
  } catch (error) {
    console.error('노트 폴더 이동 중 오류:', error);
    res.status(500).json({ error: '노트 폴더 이동 실패' });
  }
});

// ✅ 서버 실행
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
