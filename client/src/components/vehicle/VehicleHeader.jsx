import React from 'react';
import { Car, Bike, Scale, Check, Star } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { formatINR } from '../../utils/formatters';

const VehicleHeader = ({ vehicle }) => {
  const { toggleCompare, isInCompare } = useCompare();

  if (!vehicle) return null;

  const inCompare = isInCompare(vehicle._id);
  const isCar = (vehicle.type || vehicle.vehicleType) === 'car';

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
      
      {/* Brand, Model, Variant, Category & Type badges */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
        <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-1 text-slate-200">
          {isCar ? <Car className="w-3.5 h-3.5 text-cyan-400" /> : <Bike className="w-3.5 h-3.5 text-cyan-400" />}
          <span>{vehicle.category || (isCar ? 'Car' : 'Bike')}</span>
        </span>
        <span>•</span>
        <span>{vehicle.brand}</span>
        <span>•</span>
        <span>{vehicle.model}</span>
        {vehicle.variant && (
          <>
            <span>•</span>
            <span className="text-slate-300">{vehicle.variant}</span>
          </>
        )}
      </div>

      {/* Title & Rating */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          {vehicle.name}
        </h1>

        {vehicle.rating && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-xl text-xs font-bold self-start sm:self-auto">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{vehicle.rating} / 5.0</span>
          </div>
        )}
      </div>

      {/* Price & Action Button */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800/80">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Price (Ex-Showroom)</span>
          <div className="text-3xl font-black text-white">
            {formatINR(vehicle.price)}
          </div>
        </div>

        <button
          onClick={() => toggleCompare(vehicle._id)}
          className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            inCompare
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
              : 'bg-slate-900 text-slate-200 hover:text-white border border-slate-800'
          }`}
        >
          {inCompare ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
          <span>{inCompare ? 'Remove from Compare' : 'Add to Compare'}</span>
        </button>
      </div>

    </div>
  );
};

export default VehicleHeader;
