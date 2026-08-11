import React from 'react';
import { formatINR } from '../../utils/formatters';

const BudgetSelector = ({ minPrice, maxPrice, onChange, type = 'car' }) => {
  const isCar = type === 'car';
  const defaultMin = isCar ? 500000 : 100000;
  const defaultMax = isCar ? 3500000 : 400000;
  const step = isCar ? 50000 : 10000;

  return (
    <div className="space-y-4 glass-panel p-5 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          2. Target Budget Window
        </label>
        <div className="text-xs font-extrabold text-cyan-400">
          {formatINR(minPrice)} – {formatINR(maxPrice)}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Min Price */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-medium text-slate-400">
            <span>Minimum Price</span>
            <span className="text-slate-200 font-bold">{formatINR(minPrice)}</span>
          </div>
          <input
            type="range"
            min={defaultMin}
            max={maxPrice - step}
            step={step}
            value={minPrice}
            onChange={(e) => onChange('minPrice', Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer bg-slate-800 rounded-lg h-2"
          />
        </div>

        {/* Max Price */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-medium text-slate-400">
            <span>Maximum Price</span>
            <span className="text-slate-200 font-bold">{formatINR(maxPrice)}</span>
          </div>
          <input
            type="range"
            min={minPrice + step}
            max={defaultMax}
            step={step}
            value={maxPrice}
            onChange={(e) => onChange('maxPrice', Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer bg-slate-800 rounded-lg h-2"
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetSelector;
