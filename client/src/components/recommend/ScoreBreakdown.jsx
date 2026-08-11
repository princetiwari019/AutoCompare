import React from 'react';

const ScoreBreakdown = ({ breakdown = {} }) => {
  const items = [
    { label: 'Price Value', value: breakdown.price || 0, color: 'bg-emerald-500' },
    { label: 'Mileage Efficiency', value: breakdown.mileage || 0, color: 'bg-cyan-500' },
    { label: 'Safety Protection', value: breakdown.safety || 0, color: 'bg-blue-500' },
    { label: 'Performance Output', value: breakdown.performance || 0, color: 'bg-amber-500' },
    { label: 'Tech & Equipment', value: breakdown.features || 0, color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-2 pt-2 border-t border-slate-800">
      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
        Score Breakdown (Out of 100)
      </span>
      <div className="space-y-1.5">
        {items.map((item, idx) => (
          <div key={idx} className="space-y-0.5">
            <div className="flex justify-between text-[11px] font-semibold text-slate-300">
              <span>{item.label}</span>
              <span className="text-white">{item.value.toFixed(1)} pts</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
              <div
                className={`h-full rounded-full ${item.color} transition-all duration-500`}
                style={{ width: `${Math.min(100, Math.max(0, (item.value / 35) * 100))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreBreakdown;
