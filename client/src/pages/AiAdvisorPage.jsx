import React, { useState, useRef, useEffect } from 'react';
import ChatMessageItem from '../components/ai/ChatMessageItem';
import ChatSuggestedQuestions from '../components/ai/ChatSuggestedQuestions';
import { sendChatMessage } from '../services/aiService';
import { Bot, Send, Trash2, RotateCcw, Sparkles, Globe, ShieldAlert, Cpu } from 'lucide-react';

const INITIAL_WELCOME = {
  role: 'assistant',
  content: `Namaste! Aapka **AutoCompare AI** me swagat hai.\n\nAap मुझसे kisi bhi car ya bike ke baare me puch sakte ho in **English**, **Hindi (हिंदी)**, ya **Hinglish**:\n\n• *"Bhai family ke liye best car kaunsi hai?"*\n• *"Swift aur Nexon mein kya difference hai?"*\n• *"Which car is better for highway driving?"*\n• *"स्विफ्ट की माइलेज कितनी है?"*\n\nNiche diye gaye suggested questions par click karke shuru karein!`,
  detectedLanguage: 'Hinglish',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

const MAX_INPUT_LENGTH = 1000;

const AiAdvisorPage = () => {
  const [messages, setMessages] = useState([INITIAL_WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (customText = null) => {
    const textToSend = customText || input;
    if (!textToSend || textToSend.trim() === '' || loading) return;

    // Input character length check
    if (textToSend.length > MAX_INPUT_LENGTH) {
      setError(`Prompt is too long. Please keep it under ${MAX_INPUT_LENGTH} characters.`);
      return;
    }

    const userMsg = {
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    if (!customText) setInput('');
    setLoading(true);
    setError(null);

    try {
      // Send message along with history turns for context tracking
      const historyPayload = newHistory
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await sendChatMessage({
        message: textToSend.trim(),
        history: historyPayload
      });

      if (res.success) {
        const aiMsg = {
          role: 'assistant',
          content: res.reply,
          detectedLanguage: res.detectedLanguage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setError('AI is temporarily unavailable. Please try again.');
      }
    } catch (err) {
      console.error('Error sending chat message', err);
      setError('AI is temporarily unavailable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([INITIAL_WELCOME]);
    setError(null);
  };

  const isInitialState = messages.length <= 1;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex flex-col h-[calc(100vh-5rem)]">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>Automotive Intelligence Portal</span>
          </div>
          <h1 className="text-3xl font-black text-white mt-0.5 flex items-center gap-2">
            <span>AutoCompare AI</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Your personal car & bike buying assistant
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="px-3.5 py-1.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>English • हिंदी • Hinglish</span>
          </span>

          <button
            onClick={handleClear}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded-xl text-xs border border-slate-800 transition-colors"
            title="Clear conversation thread"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin">
        {messages.map((msg, idx) => (
          <ChatMessageItem key={idx} message={msg} />
        ))}

        {/* Suggested Questions Grid (Only shown when initial welcome state) */}
        {isInitialState && (
          <div className="pt-2">
            <ChatSuggestedQuestions onSelectQuestion={(qText) => handleSend(qText)} />
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center animate-pulse">
              <Bot className="w-5 h-5" />
            </div>
            <div className="glass-panel px-4 py-3 rounded-2xl border border-cyan-500/30 text-xs text-cyan-300 font-semibold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>AutoCompare AI is thinking...</span>
            </div>
          </div>
        )}

        {/* Error State Banner with Try Again Button */}
        {error && (
          <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-2xl text-xs text-rose-300 font-semibold flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => handleSend()}
              className="px-3.5 py-1.5 bg-rose-900/80 hover:bg-rose-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-rose-600 transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Box */}
      <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 shrink-0 relative shadow-2xl">
        <div className="flex items-end gap-2">
          <textarea
            rows={2}
            maxLength={MAX_INPUT_LENGTH}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about cars, bikes, mileage, safety, price..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none font-medium"
          />

          <button
            disabled={!input.trim() || loading}
            onClick={() => handleSend()}
            className="p-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-30 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all shrink-0"
            title="Send message (Enter)"
          >
            <Send className="w-5 h-5 text-slate-950" />
          </button>
        </div>
        <div className="text-[10px] text-slate-500 mt-1.5 flex items-center justify-between px-1 font-mono">
          <span>Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for new line</span>
          <span>{input.length}/{MAX_INPUT_LENGTH}</span>
        </div>
      </div>

    </div>
  );
};

export default AiAdvisorPage;
