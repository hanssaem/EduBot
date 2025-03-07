import React, { useState } from 'react';
import Message from './Message';
import Input from './Input';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);

    const addMessage = (sender, message) => {
        setMessages((prevMessages) => [...prevMessages, { sender, message }]);
    };

    const handleSendMessage = async (message) => {
        addMessage('User', message);

        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: message }),
        });
        const data = await response.json();
        addMessage('Chatbot', data.reply);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* 채팅 메시지 영역 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <Message key={index} sender={msg.sender} message={msg.message} />
                ))}
            </div>

            {/* 입력창 */}
            <Input onSendMessage={handleSendMessage} />
        </div>
    );
};

export default Chatbot;
