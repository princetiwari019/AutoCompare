import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

const ProsCons = ({ pros = [], cons = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Advantages (Pros) */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/20 bg-emerald-950/10 space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
          <CheckCircle2 className="w-5 h-5" />
          <span>Advantages (Pros)</span>
        </div>
        <ul className="space-y-2 text-xs text-slate-300">
          {pros.length > 0 ? (
            pros.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold mt-0.5">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))
          ) : (
            <li className="text-slate-500 italic">No specific pros listed.</li>
          )}
        </ul>
      </div>

      {/* Disadvantages (Cons) */}
      <div className="glass-panel p-6 rounded-3xl border border-rose-500/20 bg-rose-950/10 space-y-3">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
          <AlertTriangle className="w-5 h-5" />
          <span>Disadvantages (Cons)</span>
        </div>
        <ul className="space-y-2 text-xs text-slate-300">
          {cons.length > 0 ? (
            cons.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-400 font-bold mt-0.5">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))
          ) : (
            <li className="text-slate-500 italic">No major cons identified.</li>
          )}
        </ul>
      </div>

    </div>
  );
};

export default ProsCons;
