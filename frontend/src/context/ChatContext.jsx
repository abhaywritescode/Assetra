import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const toggleChat = () => setIsOpen(prev => !prev);
    const openChat = () => setIsOpen(true);
    const closeChat = () => setIsOpen(false);

    const sendMessage = async (text) => {
        if (!text.trim()) return;
        
        const newMessages = [...messages, { role: 'user', content: text }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const response = await api.post('/api/chat/query', {
                messages: newMessages
            });
            
            if (response.data && response.data.content) {
                setMessages([...newMessages, { role: 'assistant', content: response.data.content }]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages([...newMessages, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ChatContext.Provider value={{ messages, isOpen, isLoading, toggleChat, openChat, closeChat, sendMessage }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
