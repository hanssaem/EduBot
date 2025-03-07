import React, { useState, useEffect } from 'react';
import Message from './Message';
import Input from './Input';
import { SiProbot } from "react-icons/si";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);

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

    useEffect(() => {
        if (messages.length > 0) {
            setIsInitialized(true);
        }
    }, [messages]);

    return (
        <div className="flex items-center justify-center min-h-screen flex-col">
            <div className="w-full p-5 bg-yellow-400 text-white text-center font-bold text-3xl fixed top-0 left-0 z-10 flex items-center justify-center">
                EduBot
                <SiProbot className="ml-2 text-3xl" />
            </div>

            <div className="w-[1000px] bg-white rounded-lg flex flex-col">
                <div className={`p-5 flex-1 overflow-y-auto space-y-3 transition-all ${isInitialized ? 'pt-10' : ''}`}>
                    {messages.length === 0 && (
                        <div className="text-center text-gray-500 text-2xl mb-10">궁금한 것을 무엇이든 물어보세요!</div>
                    )}
                    {messages.map((msg, index) => (
                        <Message key={index} sender={msg.sender} message={msg.message} />
                    ))}
                </div>
                <Input messages={messages} onSendMessage={handleSendMessage} />
            </div>
        </div>
    );


};

export default Chatbot;
