import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

const ProsConsComparison = ({ vehicles = [] }) => {
  if (!vehicles || vehicles.length === 0) return null;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-xl font-bold text-white">Pros & Cons Comparison</h3>
        <p className="text-xs text-slate-400 mt-1">Side-by-side breakdown of verified advantages and trade-offs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {vehicles.map((v) => (
          <div key={v._id} className="space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-sm font-bold text-cyan-400 border-b border-slate-800 pb-2 truncate">
              {v.name}
            </h4>

            {/* Pros */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Advantages</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                {v.pros && v.pros.length > 0 ? (
                  v.pros.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span className="leading-relaxed">{p}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500 italic">No specific pros.</li>
                )}
              </ul>
            </div>

            {/* Cons */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>Disadvantages</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                {v.cons && v.cons.length > 0 ? (
                  v.cons.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">•</span>
                      <span className="leading-relaxed">{c}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500 italic">No major cons.</li>
                )}
              </ul>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ProsConsComparison;
