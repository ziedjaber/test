'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, Key, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const DEFAULT_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I'm your Gemini AI assistant built with Next.js. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(DEFAULT_API_KEY);
  const [showKeyPrompt, setShowKeyPrompt] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const savedKey = localStorage.getItem('GEMINI_API_KEY');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSaveKey = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem('GEMINI_API_KEY', newKey);
    setShowKeyPrompt(false);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const activeKey = apiKey || DEFAULT_API_KEY;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: userText }]
              }
            ]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, no response received.";

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `⚠️ Error: ${error.message || 'Failed to communicate with AI.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#090d16] text-white p-4 sm:p-6 overflow-hidden">
      {/* Background Animated Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      {/* Main Glass Chat Card */}
      <div className="relative z-10 flex flex-col w-full max-w-4xl h-[88vh] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/20">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 shadow-lg shadow-purple-500/20">
              <Sparkles className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-wide bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Gemini AI Studio
              </h1>
              <p className="text-xs text-gray-400 font-light">Next.js App Router • Gemini 2.5 Flash</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyPrompt(!showKeyPrompt)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-xl bg-white/10 hover:bg-white/15 transition border border-white/10"
              title="Manage API Key"
            >
              <Key className="w-3.5 h-3.5 text-purple-400" />
              <span>API Key</span>
            </button>
            <button
              onClick={() => setMessages([messages[0]])}
              className="p-2 text-xs rounded-xl bg-white/10 hover:bg-white/15 transition border border-white/10 text-gray-400 hover:text-white"
              title="Clear Chat"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* API Key Modal / Banner */}
        {showKeyPrompt && (
          <div className="px-6 py-3 bg-purple-950/40 border-b border-purple-500/30 flex flex-col sm:flex-row items-center gap-3">
            <input
              type="password"
              placeholder="Enter custom Gemini API Key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 w-full px-3 py-1.5 text-xs bg-black/40 border border-white/15 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={() => handleSaveKey(apiKey)}
              className="w-full sm:w-auto px-4 py-1.5 text-xs bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition"
            >
              Save Key
            </button>
          </div>
        )}

        {/* Chat Messages */}
        <main className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-[85%] ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-xl shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-purple-600/30 border border-purple-500/30 text-purple-300'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content */}
              <div
                className={`flex flex-col gap-1 p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-lg shadow-blue-600/10'
                    : 'bg-white/10 backdrop-blur-md border border-white/10 text-gray-100 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span className="text-[10px] text-gray-400 self-end mt-1 font-light opacity-70">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {/* Typing Loading Indicator */}
          {isLoading && (
            <div className="flex items-start gap-3 max-w-[85%]">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl shrink-0 bg-purple-600/30 border border-purple-500/30 text-purple-300">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl rounded-tl-none">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </main>

        {/* Input Bar */}
        <footer className="p-4 bg-black/30 border-t border-white/10">
          <form onSubmit={sendMessage} className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your prompt here..."
              disabled={isLoading}
              className="flex-1 px-5 py-3.5 bg-white/5 hover:bg-white/10 focus:bg-white/10 text-sm text-white placeholder-gray-400 border border-white/15 focus:border-purple-500 rounded-2xl outline-none transition duration-200"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white shadow-lg shadow-purple-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition duration-200 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}
