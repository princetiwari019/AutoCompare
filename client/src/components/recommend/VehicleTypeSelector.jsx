import React from 'react';
import { Car, Bike } from 'lucide-react';

const VehicleTypeSelector = ({ selectedType, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
        1. Select Vehicle Category
      </label>
      <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
        <button
          type="button"
          onClick={() => onChange('car')}
          className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            selectedType === 'car'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 scale-[1.02]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Cars</span>
        </button>

        <button
          type="button"
          onClick={() => onChange('bike')}
          className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            selectedType === 'bike'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 scale-[1.02]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Bikes</span>
        </button>
      </div>
    </div>
  );
};

export default VehicleTypeSelector;
