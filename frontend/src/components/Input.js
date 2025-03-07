import React, { useState } from 'react';

const Input = ({ onSendMessage }) => {
    const [input, setInput] = useState('');

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (input.trim()) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex p-4 bg-white border-t shadow-md">
            <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="메시지를 입력하세요..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full">
                전송
            </button>
        </form>
    );
};

export default Input;
