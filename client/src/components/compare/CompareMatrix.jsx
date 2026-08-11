import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, EyeOff, Eye, ExternalLink } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { formatINR, getImageUrl } from '../../utils/formatters';

const CompareMatrix = ({ vehicles = [] }) => {
  const { removeFromCompare } = useCompare();
  const [highlightDiffs, setHighlightDiffs] = useState(false);

  if (!vehicles || vehicles.length === 0) return null;

  // Spec sections definition
  const rows = [
    { key: 'price', label: 'Price', format: (v) => formatINR(v.price) },
    { key: 'variant', label: 'Variant', format: (v) => v.variant || 'Standard' },
    { key: 'category', label: 'Body Category', format: (v) => v.category },
    { key: 'year', label: 'Model Year', format: (v) => v.year },
    { key: 'displacement', label: 'Engine Displacement', format: (v) => (v.engine || v.specs?.engineDisplacement) ? `${v.engine || v.specs.engineDisplacement} cc` : 'N/A (Electric)' },
    { key: 'power', label: 'Max Power', format: (v) => `${v.power || v.specs?.maxPower} bhp` },
    { key: 'torque', label: 'Max Torque', format: (v) => `${v.torque || v.specs?.maxTorque} Nm` },
    { key: 'mileage', label: 'Mileage / Efficiency', format: (v) => `${v.mileage || v.specs?.mileage} km/l` },
    { key: 'fuelType', label: 'Fuel Type', format: (v) => v.fuelType || v.specs?.fuelType },
    { key: 'transmission', label: 'Transmission', format: (v) => v.transmission || v.specs?.transmission },
    { key: 'seating', label: 'Seating Capacity', format: (v) => `${v.seatingCapacity || v.specs?.seatingCapacity} Seats` },
    { key: 'safetyRating', label: 'Safety Crash Rating', format: (v) => v.safetyRating ? `${v.safetyRating} / 5 Stars` : 'N/A' },
    { key: 'rating', label: 'User Rating', format: (v) => `${v.rating || 4.5} / 5 Stars` },
    // Scores
    { key: 'fuelScore', label: 'Fuel Efficiency Score', format: (v) => `${v.scores?.fuelEfficiency || 5} / 10` },
    { key: 'perfScore', label: 'Performance Score', format: (v) => `${v.scores?.performance || 5} / 10` },
    { key: 'comfortScore', label: 'Comfort Score', format: (v) => `${v.scores?.comfort || 5} / 10` },
    { key: 'safetyScore', label: 'Safety Rating Score', format: (v) => `${v.scores?.safety || 5} / 10` },
    { key: 'valScore', label: 'Value For Money Score', format: (v) => `${v.scores?.valueForMoney || 5} / 10` }
  ];

  const isDifferent = (row) => {
    if (vehicles.length <= 1) return false;
    const firstVal = row.format(vehicles[0]);
    return vehicles.some((v) => row.format(v) !== firstVal);
  };

  const filteredRows = highlightDiffs ? rows.filter(isDifferent) : rows;

  return (
    <div className="space-y-4">
      
      {/* Top Bar Control */}
      <div className="flex items-center justify-between glass-panel px-5 py-3 rounded-2xl border border-slate-800">
        <span className="text-xs text-slate-400 font-medium">
          Comparing <strong className="text-white">{vehicles.length}</strong> vehicles
        </span>

        <button
          onClick={() => setHighlightDiffs(!highlightDiffs)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            highlightDiffs
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          {highlightDiffs ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{highlightDiffs ? 'Showing Differences Only' : 'Highlight Differences'}</span>
        </button>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-2xl glass-panel border border-slate-800">
        <table className="w-full text-left border-collapse min-w-[600px]">
          
          {/* Header Row: Images & Title Cards */}
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80">
              <th className="p-4 w-1/4 text-xs font-bold uppercase tracking-wider text-slate-400">
                Specifications
              </th>
              {vehicles.map((v) => (
                <th key={v._id} className="p-4 w-1/4 align-top">
                  <div className="space-y-3 relative group">
                    <button
                      onClick={() => removeFromCompare(v._id)}
                      className="absolute top-2 right-2 p-1.5 bg-slate-950/80 text-slate-400 hover:text-rose-400 rounded-lg border border-slate-700 backdrop-blur-md"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <img
                      src={getImageUrl(v.images?.thumbnail || v.exteriorImages?.[0])}
                      alt={v.name}
                      className="w-full h-32 object-cover rounded-xl border border-slate-800"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                        {v.brand}
                      </span>
                      <h4 className="text-sm font-bold text-white line-clamp-1">{v.name}</h4>
                      <div className="text-base font-extrabold text-white mt-1">
                        {formatINR(v.price)}
                      </div>
                    </div>
                    <Link
                      to={`/vehicles/${v._id}`}
                      className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 border border-slate-700"
                    >
                      <span>Full Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body Spec Rows */}
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredRows.map((row) => {
              const diff = isDifferent(row);
              return (
                <tr
                  key={row.key}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    diff ? 'bg-cyan-950/20' : ''
                  }`}
                >
                  <td className="p-4 font-semibold text-slate-300 flex items-center gap-2">
                    {diff && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                    <span>{row.label}</span>
                  </td>
                  {vehicles.map((v) => (
                    <td
                      key={v._id}
                      className={`p-4 font-bold ${
                        diff ? 'text-cyan-300 font-extrabold' : 'text-slate-200'
                      }`}
                    >
                      {row.format(v)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default CompareMatrix;
