import React from 'react';
import { Bot, User, Globe, Sparkles } from 'lucide-react';

const ChatMessageItem = ({ message }) => {
  const isUser = message.role === 'user';

  // Enhanced Markdown text formatter for automotive emphasis
  const formatText = (content) => {
    if (!content) return null;
    const lines = content.split('\n');

    return lines.map((line, lIdx) => {
      // Parse bold **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const raw = part.slice(2, -2);
          return (
            <strong key={pIdx} className="font-extrabold text-cyan-300 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-500/20">
              {raw}
            </strong>
          );
        }
        return part;
      });

      return (
        <React.Fragment key={lIdx}>
          {formattedLine}
          {lIdx < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  const getLangBadgeStyle = (lang) => {
    if (lang === 'hinglish') return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    if (lang === 'hindi') return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
  };

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      
      {/* Avatar Badge */}
      <div
        className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
          isUser
            ? 'bg-slate-800 border border-slate-700 text-cyan-400'
            : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-bold'
        }`}
      >
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>

      {/* Message Bubble */}
      <div
        className={`max-w-2xl rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed border space-y-2 ${
          isUser
            ? 'bg-slate-900 border-slate-800 text-slate-100 rounded-tr-none'
            : 'glass-panel border-cyan-500/30 text-slate-200 rounded-tl-none bg-slate-950/80 shadow-xl shadow-cyan-950/20'
        }`}
      >
        {/* Assistant Header Badge */}
        {!isUser && (
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AutoCompare AI Advisor</span>
            </div>

            {message.detectedLanguage && (
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${getLangBadgeStyle(message.detectedLanguage)}`}>
                <Globe className="w-3 h-3" />
                <span>{message.detectedLanguage}</span>
              </span>
            )}
          </div>
        )}

        <div className="whitespace-pre-line font-medium text-slate-200">
          {formatText(message.content)}
        </div>

        <div className="text-[10px] text-slate-500 text-right pt-1 font-mono">
          {message.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

    </div>
  );
};

export default ChatMessageItem;
