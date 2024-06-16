import React, { useState, useRef } from 'react';
import './ChatBot.css';
import axios from 'axios';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [micPressed, setMicPressed] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const handleSend = () => {
        if (input.trim()) {
            const newMessage = { text: input, user: 'user', time: new Date().toLocaleTimeString() };
            setMessages([...messages, newMessage]);
            setInput('');

            // Simulate a bot response
            setTimeout(() => {
                const botMessage = {
                    text: '',
                    user: 'bot',
                    time: new Date().toLocaleTimeString(),
                    audio: 'http://localhost:5000/download/output.mp3' // Directly use output.mp3 from backend
                };
                setMessages(prevMessages => [...prevMessages, botMessage]);
            }, 1000);
        }
    };

    const handleMicClick = () => {
        if (!micPressed) {
            // Start recording
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    mediaRecorderRef.current = new MediaRecorder(stream);
                    audioChunksRef.current = [];
                    mediaRecorderRef.current.ondataavailable = event => {
                        audioChunksRef.current.push(event.data);
                    };
                    mediaRecorderRef.current.start();
                    setMicPressed(true);

                    // Add a temporary "Recording..." message
                    const recordingMessage = { text: 'Recording...', user: 'user', time: new Date().toLocaleTimeString(), isRecording: true };
                    setMessages([...messages, recordingMessage]);
                })
        } else {
            // Stop recording
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const formData = new FormData();
                formData.append('file', audioBlob, 'audio.wav');

                // Send audio file to the backend
                try {
                    const response = await axios.post('http://localhost:5000/speech_to_text', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    
                    }
                )
                console.log(response);

                    // Remove the "Recording..." message
                    setMessages(prevMessages => prevMessages.filter(msg => !msg.isRecording));

                    // Handle backend response
                    const { transcribed_text, message } = response.data;
                    const userMessage = { text: transcribed_text, user: 'user', time: new Date().toLocaleTimeString() };
                    const botMessage = { text: message, user: 'bot', time: new Date().toLocaleTimeString(), audio: 'http://localhost:5000/download/output.mp3' };

                    setMessages(prevMessages => [...prevMessages, userMessage, botMessage]);
                } catch (error) {
                    console.error('Error uploading audio:', error);
                    setMessages(prevMessages => prevMessages.filter(msg => !msg.isRecording));
                } finally {
                    setMicPressed(false);
                }
            };
        }
    };


    return (
        <div className="chat-container">
            <div className="chat-header">Chat</div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.user}`}>
                        <div className="message-content">
                            {msg.text}
                            {msg.audio && (
                                <button className="voice-note-button" onClick={() => new Audio(msg.audio).play()}>
                                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="mic-icon">
                                        <path d="M12 1a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zm1 10V4a1 1 0 1 1 2 0v7a1 1 0 0 1-2 0zm-4 0V4a1 1 0 1 1 2 0v7a1 1 0 0 1-2 0zm4 7.5a5.48 5.48 0 0 1-3-1.001A5.48 5.48 0 0 1 9 15.5v-.5h6v.5a5.48 5.48 0 0 1-1 3.499A5.48 5.48 0 0 1 13 18.5v.5zm-1-4.501V15h2v-.001a4.482 4.482 0 0 0-1 .196 4.482 4.482 0 0 0-1-.196zm3-1.498V15h2v-.5c0-2.492-2.016-4.507-4.5-4.507S7.5 12.008 7.5 14.5V15h2v-.5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5z"/>
                                    </svg>
                                    Voice Note
                                </button>
                            )}
                        </div>
                        <div className="message-time">
                            {msg.time}
                        </div>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
                    placeholder="Type a message..." 
                />
                <button onClick={handleSend}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </button>
                <button onClick={handleMicClick} className={`mic-button ${micPressed ? 'pressed' : ''}`}>
                    {micPressed ? (
                        <svg viewBox="0 0 24 24" width="40" height="18" fill="currentColor">
                            <path d="M12 2a2 2 0 0 0-2 2v6a2 2 0 1 0 4 0V4a2 2 0 0 0-2-2zm0 10.5c-2.485 0-4.5-2.015-4.5-4.5v-7a4.5 4.5 0 1 1 9 0v7c0 2.485-2.015 4.5-4.5 4.5zM10 17v-2.235a4.515 4.515 0 0 0 4 0V17h2a1 1 0 1 1 0 2h-8a1 1 0 1 1 0-2h2z"/>
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" width="40" height="18" fill="currentColor">
                            <path d="M12 14a3.5 3.5 0 0 0 3.5-3.5v-7a3.5 3.5 0 0 0-7 0v7A3.5 3.5 0 0 0 12 14zm4.5-3.5a4.507 4.507 0 0 1-4.125 4.47V18h2.625a1 1 0 0 1 0 2h-7a1 1 0 1 1 0-2h2.625v-3.03A4.507 4.507 0 0 1 7.5 10.5v-7a4.5 4.5 0 1 1 9 0v7z"/>
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ChatBot;
