import React from 'react';
import { Sparkles, Shield, Fuel, Zap, Tag, Scale } from 'lucide-react';

const PRESETS = [
  {
    id: 'balanced',
    label: 'Balanced',
    icon: Scale,
    weights: { price: 20, mileage: 30, safety: 25, performance: 15, features: 10 }
  },
  {
    id: 'mileage',
    label: 'Mileage Focused',
    icon: Fuel,
    weights: { price: 10, mileage: 60, safety: 15, performance: 10, features: 5 }
  },
  {
    id: 'safety',
    label: 'Safety Focused',
    icon: Shield,
    weights: { price: 10, mileage: 15, safety: 60, performance: 10, features: 5 }
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: Zap,
    weights: { price: 10, mileage: 10, safety: 10, performance: 60, features: 10 }
  },
  {
    id: 'budget',
    label: 'Budget Value',
    icon: Tag,
    weights: { price: 60, mileage: 15, safety: 10, performance: 10, features: 5 }
  }
];

const PreferencePreset = ({ activePreset, onSelectPreset }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>Quick Preset Profiles</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isActive = activePreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{preset.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PreferencePreset;
