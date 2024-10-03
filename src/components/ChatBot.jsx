import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './ChatBot.css';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const { ipcRenderer } = window.require('electron');

function ChatBot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    loadInteractions();
    scrollToBottom();
  }, [messages]);

  // Function to load previous interactions from the State directory
  const loadInteractions = async () => {
    const interactions = await ipcRenderer.invoke('get-interactions');
    setMessages(interactions);
  };

  // Function to save the current interaction
  const saveInteraction = (message) => {
    ipcRenderer.send('save-interaction', message);
  };

  // Handle user input and send message to the chatbot
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, user: true, timestamp: Date.now() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    saveInteraction(userMessage);
    setInput('');

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(input);
      const response = await result.response;
      const text = response.text();

      const botMessage = { text, user: false, timestamp: Date.now() };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      saveInteraction(botMessage);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { text: 'Sorry, an error occurred.', user: false, timestamp: Date.now() };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      saveInteraction(errorMessage);
    }
  };

  return (
    <div className="chatbot">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.user ? 'user' : 'bot'}`}>
            <div className="message-bubble">{message.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button type="submit" className="chat-send-button">Send</button>
      </form>
    </div>
  );
}

export default ChatBot;
