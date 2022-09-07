import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types'
import './ChatBubble.css';


function ChatBubble(props) {
    const [newMessage, setNewMessage] = useState('')
    const bottomRef = useRef(null);

    
    const messages = props.messages;
    const chatList = getConversations(messages);

    
    useEffect(() => {

        // 👇️ scroll to bottom every time messages change
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [newMessage]);
    

    function getConversations(messages) {
        if (messages === undefined) {
            return;
        }

        const listItems = messages.map((message, index) => {
            let bubbleClass = 'me';
            let bubbleDirection = '';

            if (message.type === 0) {
                bubbleClass = 'you';
                bubbleDirection = "bubble-direction-reverse";
            }
            return (
                <div className={`bubble-container ${bubbleDirection}`} key={index}>
                    <img className={`img-circle`} src={message.image} />
                    <div className={`bubble ${bubbleClass}`}>{message.text}</div>
                </div>
            );
        });
        return listItems;
    }

    const handleSubmit = e => {
        e.preventDefault()

        const onNewMessage = props.onNewMessage

        if (onNewMessage && newMessage) {
            onNewMessage(newMessage)
        }
        setNewMessage('')
    }

    const handleInputChange = e => setNewMessage(e.target.value)

    return (
        <div className="chats">
            <div className="chat-list">
                {chatList}
                <div ref={bottomRef} />

            </div>
            <form
                className="new-message"
                onSubmit={handleSubmit}
            >
                <input
                    value={newMessage}
                    placeholder="Write a new message"
                    onChange={handleInputChange}
                    className="new-message-input"
                />
            </form>

        </div>
    );

}

ChatBubble.propTypes = {
    messages: PropTypes.array.isRequired,
    onNewMessage: PropTypes.func.isRequired,
};

export default ChatBubble;