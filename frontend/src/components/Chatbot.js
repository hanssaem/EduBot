import React, { useState } from 'react';
import Message from './Message';
import Input from './Input';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);

    const addMessage = (sender, message) => {
        setMessages((prevMessages) => [{ sender, message }, ...prevMessages]);
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
        <div id="chat-container">
            <div id="chat-messages">
                {messages.map((msg, index) => (
                    <Message key={index} sender={msg.sender} message={msg.message} />
                ))}
            </div>
            <Input onSendMessage={handleSendMessage} />
        </div>
    );
};

export default Chatbot;
