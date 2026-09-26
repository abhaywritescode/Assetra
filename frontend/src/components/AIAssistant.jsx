import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User } from 'lucide-react';

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    
    // Auto-scroll to bottom when messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const quickPrompts = [
        "Summarize recent activity",
        "How do I upload a receipt?",
        "Show my highest value assets"
    ];

    const handleSend = async (text) => {
        if (!text.trim()) return;
        
        // Add user message to state
        const newUserMessage = { id: Date.now(), role: 'user', content: text };
        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsTyping(true);

        // TODO: [BACKEND DEV] Replace this block with actual API fetch to your LLM endpoint
        // Example: 
        // const response = await api.post('/api/chat', { message: text });
        // const aiText = response.data.reply;
        
        // --- START MOCK SIMULATION ---
        setTimeout(() => {
            const mockAiMessage = { 
                id: Date.now() + 1, 
                role: 'assistant', 
                content: `I'm a mock AI response! I received your message: "${text}". My backend LLM brain will be wired up soon.` 
            };
            setMessages(prev => [...prev, mockAiMessage]);
            setIsTyping(false);
        }, 2000);
        // --- END MOCK SIMULATION ---
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!isTyping && inputValue.trim()) {
                handleSend(inputValue);
            }
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 p-4 rounded-full bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-all duration-300 z-50 flex items-center gap-2 group ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100 hover:scale-105'}`}
            >
                <Sparkles className="w-6 h-6 animate-pulse" />
                <span className="font-semibold hidden group-hover:block whitespace-nowrap px-1">Ask AI</span>
            </button>

            {/* Chat Modal */}
            <div 
                className={`fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 origin-bottom-right ${
                    isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90 rounded-t-2xl backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                            <Bot className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-100">Assetra AI</h3>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Online
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-5 scroll-smooth">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                            <div className="w-16 h-16 rounded-full bg-blue-600/10 flex items-center justify-center border border-blue-500/20 mb-2">
                                <Sparkles className="w-8 h-8 text-blue-400" />
                            </div>
                            <h4 className="text-lg font-semibold text-slate-100">How can I help you manage your assets today?</h4>
                            
                            <div className="flex flex-col gap-2 w-full">
                                {quickPrompts.map((prompt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSend(prompt)}
                                        className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 px-4 rounded-xl text-left transition-colors border border-slate-700 hover:border-slate-600"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-auto ${
                                            msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-800 border border-slate-700'
                                        }`}>
                                            {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-blue-400" />}
                                        </div>
                                        <div className={`py-3 px-4 rounded-2xl text-sm ${
                                            msg.role === 'user' 
                                                ? 'bg-blue-600 text-white rounded-br-sm' 
                                                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm'
                                        }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="flex w-full justify-start">
                                    <div className="flex gap-3 max-w-[85%]">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-auto">
                                            <Bot className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <div className="py-4 px-5 rounded-2xl bg-slate-800 border border-slate-700 rounded-bl-sm flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-slate-900 border-t border-slate-800 rounded-b-2xl">
                    <div className="relative flex items-end gap-2 bg-slate-800 border border-slate-700 rounded-xl p-2 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about your assets..."
                            className="flex-1 max-h-32 min-h-[40px] bg-transparent text-slate-100 placeholder-slate-400 text-sm resize-none focus:outline-none p-2"
                            rows={1}
                            disabled={isTyping}
                        />
                        <button 
                            onClick={() => handleSend(inputValue)}
                            disabled={isTyping || !inputValue.trim()}
                            className="p-2 mb-1 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors flex-shrink-0"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-center mt-2">
                        <span className="text-[10px] text-slate-500">Assetra AI can make mistakes. Verify important info.</span>
                    </div>
                </div>
            </div>
        </>
    );
}
