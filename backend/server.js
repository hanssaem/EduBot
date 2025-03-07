const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());

app.use(express.json());


// OpenAI API 설정
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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
