import React from 'react';
import { Tag, Fuel, Shield, Zap, Sparkles, CheckCircle2, AlertCircle, Plus, Minus } from 'lucide-react';

const FIELDS = [
  { key: 'price', label: 'Price Value (Lower is better)', icon: Tag, color: 'text-emerald-400' },
  { key: 'mileage', label: 'Fuel Efficiency (Mileage)', icon: Fuel, color: 'text-cyan-400' },
  { key: 'safety', label: 'Safety Protection', icon: Shield, color: 'text-blue-400' },
  { key: 'performance', label: 'Performance Output', icon: Zap, color: 'text-amber-400' },
  { key: 'features', label: 'Tech & Equipment Features', icon: Sparkles, color: 'text-purple-400' }
];

const PreferenceControls = ({ weights, onChangeWeight, totalWeight }) => {
  const isValid = totalWeight === 100;

  const handleAdjust = (key, delta) => {
    const current = weights[key] || 0;
    const nextVal = Math.max(0, Math.min(100, current + delta));
    onChangeWeight(key, nextVal);
  };

  return (
    <div className="space-y-4 glass-panel p-5 rounded-2xl border border-slate-800">
      
      {/* Total Weight Status Indicator */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          3. Customize Preference Weights
        </label>

        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold border ${
          isValid
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse'
        }`}>
          {isValid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
          <span>Total: {totalWeight}%</span>
        </div>
      </div>

      {!isValid && (
        <div className="text-[11px] font-semibold text-rose-400 bg-rose-950/20 border border-rose-500/20 p-2.5 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Preferences must total exactly 100%. Adjust weights using the sliders or +/- controls below.</span>
        </div>
      )}

      {/* Sliders & +/- Controls */}
      <div className="space-y-3">
        {FIELDS.map((field) => {
          const Icon = field.icon;
          const val = weights[field.key] || 0;
          return (
            <div key={field.key} className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-medium text-slate-200">
                  <Icon className={`w-4 h-4 ${field.color}`} />
                  <span>{field.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAdjust(field.key, -5)}
                    className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center border border-slate-700"
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  <span className="font-extrabold text-cyan-400 min-w-[36px] text-center">
                    {val}%
                  </span>

                  <button
                    type="button"
                    onClick={() => handleAdjust(field.key, 5)}
                    className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center border border-slate-700"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={val}
                onChange={(e) => onChangeWeight(field.key, Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer bg-slate-800 rounded-lg h-1.5"
              />
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default PreferenceControls;
