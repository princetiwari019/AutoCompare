import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Scale, X, Trash2, ArrowRight } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { fetchVehiclesForCompare } from '../../services/vehicleService';
import { getImageUrl } from '../../utils/formatters';

const CompareFloatingBar = () => {
  const { selectedIds, removeFromCompare, clearCompare, maxLimit } = useCompare();
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    if (selectedIds.length === 0) {
      setVehicles([]);
      return;
    }

    fetchVehiclesForCompare(selectedIds)
      .then((res) => {
        if (res.success) {
          setVehicles(res.data);
        }
      })
      .catch((err) => console.error('Error fetching floating bar compare vehicles', err));
  }, [selectedIds]);

  if (selectedIds.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-4xl glass-panel p-3 sm:p-4 rounded-2xl shadow-2xl shadow-cyan-950/60 border border-cyan-500/30 flex items-center justify-between gap-4 animate-in slide-in-from-bottom duration-300">
      
      {/* Left: Section Info */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold">
          <Scale className="w-5 h-5" />
        </div>
        <div className="hidden sm:block">
          <h4 className="text-xs sm:text-sm font-semibold text-white">Compare Queue ({selectedIds.length}/{maxLimit})</h4>
          <p className="text-[11px] text-slate-400">Select 2 to 4 vehicles for side-by-side specs</p>
        </div>
      </div>

      {/* Middle: Queued Vehicle Pill Avatars */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin">
        {vehicles.map((v) => (
          <div
            key={v._id}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-slate-200 group shrink-0"
          >
            <img
              src={getImageUrl(v.images?.thumbnail || v.exteriorImages?.[0])}
              alt={v.name}
              className="w-7 h-7 object-cover rounded-lg bg-slate-800"
            />
            <span className="font-medium max-w-[90px] sm:max-w-[120px] truncate">{v.name}</span>
            <button
              onClick={() => removeFromCompare(v._id)}
              className="text-slate-400 hover:text-red-400 p-0.5"
              title="Remove"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={clearCompare}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
          title="Clear all"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <Link
          to="/compare"
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 transition-all duration-200"
        >
          <span>Compare Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};

export default CompareFloatingBar;
