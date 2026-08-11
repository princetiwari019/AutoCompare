import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Bike, Gauge, Zap, Scale, Check, ArrowRight, Star, ImageOff } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { formatINR, getImageUrl } from '../../utils/formatters';

const VehicleCard = ({ vehicle, matchScore, matchReasons }) => {
  const { toggleCompare, isInCompare } = useCompare();
  const [imageError, setImageError] = useState(false);

  if (!vehicle) return null;

  const inCompare = isInCompare(vehicle._id);
  const isCar = (vehicle.type || vehicle.vehicleType) === 'car';
  const rawImgUrl = vehicle.images?.thumbnail || vehicle.exteriorImages?.[0];
  const resolvedImgUrl = getImageUrl(rawImgUrl);

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full group relative">
      
      {/* Image Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900 flex items-center justify-center">
        {resolvedImgUrl && !imageError ? (
          <img
            src={resolvedImgUrl}
            alt={vehicle.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-center p-4 space-y-1 text-slate-500">
            <ImageOff className="w-8 h-8 mx-auto text-slate-600" />
            <span className="text-[11px] font-semibold text-slate-400 block">Image unavailable</span>
          </div>
        )}

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 bg-slate-950/80 backdrop-blur-md border border-slate-700/80 rounded-lg text-[11px] font-semibold text-slate-200 flex items-center gap-1">
            {isCar ? <Car className="w-3 h-3 text-cyan-400" /> : <Bike className="w-3 h-3 text-cyan-400" />}
            <span>{vehicle.category}</span>
          </span>
          {vehicle.isFeatured && (
            <span className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-lg text-[11px] font-bold uppercase tracking-wider">
              Featured
            </span>
          )}
        </div>

        {/* Compare Toggle Button */}
        <button
          onClick={() => toggleCompare(vehicle._id)}
          className={`absolute top-3 right-3 p-2 rounded-xl border backdrop-blur-md transition-all duration-200 ${
            inCompare
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-lg shadow-cyan-500/40'
              : 'bg-slate-950/70 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-900'
          }`}
          title={inCompare ? 'Remove from comparison' : 'Add to comparison'}
        >
          {inCompare ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
        </button>

        {/* Match Score Badge (Optional for Recommendation View) */}
        {matchScore !== undefined && (
          <div className="absolute bottom-3 right-3 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl shadow-lg text-white font-extrabold text-xs tracking-wider">
            {matchScore}% Match
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-cyan-400">{vehicle.brand}</span>
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{vehicle.rating || 4.5}</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
            {vehicle.name}
          </h3>

          <div className="mt-2 text-2xl font-extrabold text-white">
            {formatINR(vehicle.price)}
          </div>
        </div>

        {/* Key Specs Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2 text-slate-300">
            <Gauge className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Mileage</span>
              <span className="font-semibold">{vehicle.mileage || vehicle.specs?.mileage} {vehicle.fuelType === 'Electric' ? 'km (range)' : 'km/l'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Power</span>
              <span className="font-semibold">{vehicle.power || vehicle.specs?.maxPower} bhp</span>
            </div>
          </div>
        </div>

        {/* Recommendation Match Reasons */}
        {matchReasons && matchReasons.length > 0 && (
          <div className="space-y-1 bg-cyan-950/30 p-2.5 rounded-xl border border-cyan-500/20 text-[11px] text-cyan-200">
            {matchReasons.slice(0, 2).map((reason, idx) => (
              <p key={idx} className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold">•</span>
                <span>{reason}</span>
              </p>
            ))}
          </div>
        )}

        {/* Card Footer Actions */}
        <div className="pt-2 flex items-center gap-2">
          <Link
            to={`/vehicles/${vehicle._id}`}
            className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700/60"
          >
            <span>View Specs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
};

export default VehicleCard;
