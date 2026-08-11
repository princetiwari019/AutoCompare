import React from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';

const SUGGESTIONS = [
  { label: 'Family Car', text: 'Bhai family ke liye best car kaunsi hai?' },
  { label: 'Under ₹10 Lakh', text: '₹10 lakh ke andar best car?' },
  { label: 'Swift vs Nexon', text: 'Swift aur Nexon mein kya difference hai?' },
  { label: 'Highway Option', text: 'Highway driving ke liye best option?' },
  { label: 'Best Mileage Car', text: 'Best mileage wali car kaunsi hai?' },
  { label: 'Performance Bike', text: 'Performance ke liye best bike?' }
];

const ChatSuggestedQuestions = ({ onSelectQuestion }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>Suggested Questions (Click to Ask)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectQuestion(item.text)}
            className="p-3 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 rounded-2xl text-xs font-medium border border-slate-800/80 hover:border-cyan-500/40 transition-all flex items-start gap-2.5 text-left group shadow-sm hover:shadow-md hover:shadow-cyan-950/20"
          >
            <div className="w-6 h-6 rounded-lg bg-slate-800 group-hover:bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">{item.label}</span>
              <span className="font-semibold text-slate-200 group-hover:text-white line-clamp-2">{item.text}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatSuggestedQuestions;
