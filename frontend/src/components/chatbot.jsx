import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const chatWindowRef = useRef(null);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userMessage = { role: 'user', content: inputValue };

        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInputValue('');
        setLoading(true);

        try {
            const requestBody = {
                prompt: inputValue,
            };

            const res = await fetch('https://6vtiprdy9b.execute-api.us-west-2.amazonaws.com/full_stack_snacks_api_stage/ask', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            console.log(data.response);

            const assistantMessage = { role: 'assistant', content: data.response };
            setTimeout(() => {
                setMessages((prevMessages) => [...prevMessages, assistantMessage]);
            }, 500);
        } catch (error) {
            console.error('Error fetching completion:', error);
            alert('There was an error fetching the response. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chatbot-container">
            <div className="chat-window" ref={chatWindowRef}> 
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        <span>{msg.content}</span>
                        <strong>{messages.role === 'user' ? 'you' : 'Assistant'}:</strong>
                    </div>
                ))}
            </div>
            <form className="input-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    disabled={loading}
                    required
                />
                <button type="submit" disabled={loading || !inputValue.trim()}>
                    {loading ? 'Sending...' : 'Send'}
                </button>
            </form>
        </div>
    );
};

export default ChatBot;