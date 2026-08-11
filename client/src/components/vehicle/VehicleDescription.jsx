import React from 'react';
import { Info } from 'lucide-react';

const VehicleDescription = ({ description }) => {
  if (!description) return null;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-3">
      <div className="flex items-center gap-2 text-white font-bold text-base">
        <Info className="w-5 h-5 text-cyan-400" />
        <span>Vehicle Overview</span>
      </div>
      <p className="text-xs text-slate-300 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default VehicleDescription;
