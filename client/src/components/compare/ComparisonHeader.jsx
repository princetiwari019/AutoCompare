import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Trash2, ArrowLeft } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';

const ComparisonHeader = ({ count = 0 }) => {
  const { clearCompare, maxLimit } = useCompare();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Scale className="w-4 h-4" />
          <span>Side-by-Side Matrix</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mt-1">
          Compare Vehicles <span className="text-slate-500 font-medium text-lg">({count}/{maxLimit})</span>
        </h1>
      </div>

      <div className="flex items-center gap-3 self-start sm:self-auto">
        <Link
          to="/vehicles"
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Catalog</span>
        </Link>

        {count > 0 && (
          <button
            onClick={clearCompare}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ComparisonHeader;
