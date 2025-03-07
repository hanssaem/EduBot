import React from 'react';

const Message = ({ sender, message }) => {
    const isUser = sender === 'User';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mt-4 mb-10`}>
            <div
                className={`max-w-[80%] p-4 rounded-lg text-xl leading-relaxed ${isUser
                    ? 'bg-yellow-400 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                    }`}
            >
                {message}
            </div>
        </div>
    );
};

export default Message;
