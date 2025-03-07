import React from 'react';

const Message = ({ sender, message }) => {
    const isUser = sender === 'User';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`px-4 py-2 rounded-lg max-w-xs text-white ${isUser ? 'bg-blue-500' : 'bg-gray-300 text-black'
                    }`}
            >
                <strong className="block text-xs opacity-75">{sender}</strong>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default Message;
