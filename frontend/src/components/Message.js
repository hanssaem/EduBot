import React from 'react';

const Message = ({ sender, message }) => {
    return (
        <div className="message">
            <strong>{sender}:</strong> {message}
        </div>
    );
};

export default Message;
