import React from 'react';
import { Link } from 'react-router-dom';
import { X, ExternalLink, Star } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { formatINR, getImageUrl } from '../../utils/formatters';

const ComparisonVehicleHeader = ({ vehicle }) => {
  const { removeFromCompare } = useCompare();

  if (!vehicle) return null;

  const rawThumb = vehicle.images?.thumbnail || vehicle.exteriorImages?.[0];
  const resolvedThumb = getImageUrl(rawThumb) || 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="space-y-3 relative group text-left">
      <button
        onClick={() => removeFromCompare(vehicle._id)}
        className="absolute top-2 right-2 p-1.5 bg-slate-950/80 text-slate-400 hover:text-rose-400 rounded-lg border border-slate-700 backdrop-blur-md z-10 transition-colors"
        title="Remove from comparison"
      >
        <X className="w-4 h-4" />
      </button>

      <img
        src={resolvedThumb}
        alt={vehicle.name}
        className="w-full h-32 object-cover rounded-xl border border-slate-800 bg-slate-900"
      />

      <div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">
          <span className="text-cyan-400">{vehicle.brand}</span>
          {vehicle.rating && (
            <span className="flex items-center gap-0.5 text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{vehicle.rating}</span>
            </span>
          )}
        </div>

        <h4 className="text-sm font-bold text-white line-clamp-1">{vehicle.name}</h4>
        {vehicle.variant && (
          <span className="text-[11px] text-slate-400 block line-clamp-1">{vehicle.variant}</span>
        )}

        <div className="text-base font-black text-white mt-1">
          {formatINR(vehicle.price)}
        </div>
      </div>

      <Link
        to={`/vehicles/${vehicle._id}`}
        className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 border border-slate-700 transition-colors"
      >
        <span>View Specs</span>
        <ExternalLink className="w-3 h-3" />
      </Link>
    </div>
  );
};

export default ComparisonVehicleHeader;
