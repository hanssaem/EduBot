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
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="메시지를 입력하세요..."
            />
            <button type="submit">전송</button>
        </form>
    );
};

export default Input;
