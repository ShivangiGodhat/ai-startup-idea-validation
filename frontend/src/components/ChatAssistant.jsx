import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, Bot, Sparkles, User } from 'lucide-react';

export default function ChatAssistant({ reportId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const presets = [
    "How can I counter these competitors?",
    "Which pricing strategy is best for my model?",
    "How should I use the pre-seed funding?",
    "What are the main risks and how to solve them?"
  ];

  useEffect(() => {
    // Initial greetings
    if (messages.length === 0) {
      setMessages([
        {
          sender: 'assistant',
          text: "Hi! I am your AI Startup Advisor. I have analyzed your report. Ask me anything about your business model, GTM strategy, threats, or financials!",
        }
      ]);
    }
  }, [reportId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (!textToSend) setInput('');

    // Append user message
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setLoading(true);

    try {
      const response = await axios.post('/api/chat/message', {
        message: text,
        reportId: reportId
      });

      setMessages(prev => [...prev, { sender: 'assistant', text: response.data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        sender: 'assistant', 
        text: "Sorry, I ran into an issue processing your query. Please try again in a moment." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/30 hover:scale-105 hover:shadow-indigo-500/40 active:scale-95 transition-all duration-200"
        >
          <MessageSquare className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 text-[9px] font-bold text-white items-center justify-center">AI</span>
          </span>
        </button>
      )}

      {/* Chat Box Drawer */}
      {isOpen && (
        <div className="flex h-[550px] w-[380px] flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 transition-all duration-300 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3.5 text-white">
            <div className="flex items-center space-x-2">
              <div className="rounded-lg bg-white/10 p-1.5">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm">StartupSense Advisor</h3>
                <span className="flex items-center text-[10px] text-indigo-100">
                  <Sparkles className="mr-1 h-3 w-3 text-amber-300" /> Co-pilot active
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-indigo-100 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                  {msg.sender === 'user' ? <User className="h-4.5 w-4.5" /> : <Bot className="h-4.5 w-4.5 text-indigo-500" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'rounded-tr-none bg-indigo-600 text-white' 
                    : 'rounded-tl-none bg-white text-slate-800 border border-slate-200/50 dark:border-slate-800/40 dark:bg-slate-800 dark:text-slate-100'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800">
                  <Bot className="h-4.5 w-4.5 text-indigo-500" />
                </div>
                <div className="rounded-2xl rounded-tl-none border border-slate-200/50 bg-white px-4 py-3.5 dark:border-slate-800/40 dark:bg-slate-800">
                  <div className="flex items-center space-x-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Presets */}
          {messages.length === 1 && !loading && (
            <div className="border-t border-slate-100 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Suggested Questions</span>
              <div className="flex flex-wrap gap-1">
                {presets.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(p)}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-indigo-950/20 dark:hover:text-indigo-400 text-left truncate max-w-full transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <div className="border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask advice about your report..."
                className="flex-grow rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-850 dark:bg-slate-950/40 dark:focus:border-indigo-400"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow hover:bg-indigo-500 disabled:bg-slate-300 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:disabled:bg-slate-800"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
