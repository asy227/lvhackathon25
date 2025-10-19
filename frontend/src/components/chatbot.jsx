import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const chatWindowRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // file change handler
    const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
    }
    if (file.size > 8 * 1024 * 1024) { // 8MB limit
        alert('File is too large (max 8MB).');
        return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    // optionally auto-upload or set to be sent after sending message
    // uploadImage();
    };

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
             // Call your backend which connects to AWS Bedrock
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ 
                    message: inputValue,
                    conversationHistory: messages // Send conversation history for context
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: \${response.status}`);
            }

            const data = await response.json();
            console.log('Bedrock response:', data);

            // Extract the message from Bedrock response
            const assistantMessage = { 
                role: 'assistant', 
                content: data.message || data.response 
            };
            
            setTimeout(() => {
                setMessages((prevMessages) => [...prevMessages, assistantMessage]);
            }, 500);

        } catch (error) {
            console.error('Error fetching completion:', error);
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    
    async function sendMessage(message) {
    const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    });
    
    const data = await response.json();
        return data.reply;
    }



    return (
        <div className="chatbot-container">
            {/* Header */}
            <div className="chatbot-header">
                <h1>Nutribot</h1>
            </div>

            {/* Chat Window - Responses appear here */}
            <div className="chat-window" ref={chatWindowRef}>
                {messages.length === 0 ? (
                    <div className="message assistant">
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.role}`}>
                            <span>{msg.content}</span>
                        </div>
                    ))
                )}
                {loading && <div className="loading">Thinking...</div>}
            </div>

            {/* Input Area */}
            <div className="input-area">
                <form className="input-form" onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="Caclulate your nutrient intake!"
                            disabled={loading}
                            required
                        />
                        
                        {/* File Upload */}
                        <input
                            id="chat-file-input"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        
                        <label htmlFor="chat-file-input" className="attach-btn" title="Attach photo">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21.44 11.05L12.7 19.79a4.5 4.5 0 0 1-6.36-6.36l7.78-7.78a3.5 3.5 0 0 1 4.95 4.95l-7.07 7.07" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </label>
                    </div>

                    <button type="submit" disabled={loading || !inputValue.trim()}>
                        {loading ? '...' : 'Send'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatBot;