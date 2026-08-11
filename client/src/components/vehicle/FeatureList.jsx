import React from 'react';
import { ShieldCheck } from 'lucide-react';

const FeatureList = ({ features = [] }) => {
  if (!features || features.length === 0) return null;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-cyan-400" />
        <span>Key Features & Equipment</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureList;
