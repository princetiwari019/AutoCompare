import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ComparisonHeader from '../components/compare/ComparisonHeader';
import ComparisonTable from '../components/compare/ComparisonTable';
import RadarComparisonChart from '../components/compare/RadarComparisonChart';
import FeatureComparison from '../components/compare/FeatureComparison';
import ProsConsComparison from '../components/compare/ProsConsComparison';
import AiComparisonSummary from '../components/compare/AiComparisonSummary';

import { useCompare } from '../context/CompareContext';
import { fetchVehiclesForCompare, fetchVehicles } from '../services/vehicleService';
import { getImageUrl } from '../utils/formatters';
import { Scale, Plus, Search, ArrowRight, Layers } from 'lucide-react';

const ComparePage = () => {
  const { selectedIds, addToCompare, maxLimit } = useCompare();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allAvailable, setAllAvailable] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch vehicles in comparison queue
  useEffect(() => {
    if (selectedIds.length === 0) {
      setVehicles([]);
      return;
    }

    setLoading(true);
    fetchVehiclesForCompare(selectedIds)
      .then((res) => {
        if (res.success) {
          setVehicles(res.data);
        }
      })
      .catch((err) => console.error('Error loading compare vehicles', err))
      .finally(() => setLoading(false));
  }, [selectedIds]);

  // Fetch all vehicles for autocomplete picker dropdown
  useEffect(() => {
    fetchVehicles({ limit: 50 })
      .then((res) => {
        if (res.success) {
          setAllAvailable(res.data);
        }
      })
      .catch((err) => console.error('Error loading available vehicles for picker', err));
  }, []);

  const filteredAvailable = allAvailable.filter(
    (v) =>
      !selectedIds.includes(v._id) &&
      (v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.model.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Comparison Header */}
      <ComparisonHeader count={vehicles.length} />

      {/* Autocomplete Vehicle Picker Bar */}
      {selectedIds.length < maxLimit && (
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 relative z-30 space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Add Vehicle to Comparison ({selectedIds.length}/{maxLimit})
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search & select a car or bike to add to comparison..."
              value={searchQuery}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />

            {/* Dropdown Options */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-h-60 overflow-y-auto z-50 divide-y divide-slate-800/60">
                {filteredAvailable.length > 0 ? (
                  filteredAvailable.map((v) => (
                    <button
                      key={v._id}
                      onClick={() => {
                        addToCompare(v._id);
                        setSearchQuery('');
                        setIsDropdownOpen(false);
                      }}
                      className="w-full p-3 text-left hover:bg-slate-800/80 flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(v.images?.thumbnail || v.exteriorImages?.[0])}
                          alt={v.name}
                          className="w-8 h-8 rounded-lg object-cover bg-slate-800"
                        />
                        <div>
                          <span className="font-bold text-white block">{v.name}</span>
                          <span className="text-[10px] text-slate-400 uppercase">{v.brand} • {v.type} • {v.category}</span>
                        </div>
                      </div>
                      <span className="font-bold text-cyan-400">₹{(v.price / 100000).toFixed(2)} Lakh</span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-xs text-slate-400 text-center italic">
                    No matching vehicles available to add.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* State Renderers */}
      {selectedIds.length === 0 ? (
        /* Empty State 0 Vehicles */
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4 max-w-lg mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
            <Scale className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Select Vehicles to Compare</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Browse through our vehicle catalog and click <strong>Add to Compare</strong> on any vehicle card, or use the search box above to compare up to 4 vehicles side-by-side.
          </p>
          <Link
            to="/vehicles"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/25"
          >
            <Layers className="w-4 h-4" />
            <span>Explore Vehicles Catalog</span>
          </Link>
        </div>
      ) : selectedIds.length === 1 ? (
        /* Single Vehicle State (Prompt to add 2nd) */
        <div className="space-y-8">
          <div className="glass-panel p-8 rounded-3xl border border-amber-500/20 bg-amber-950/10 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto font-bold text-lg">
              1/4
            </div>
            <h3 className="text-xl font-bold text-white">Select at Least 1 More Vehicle</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              You currently have <strong>{vehicles[0]?.name || '1 vehicle'}</strong> selected. Add at least one more vehicle to generate the side-by-side comparison matrix.
            </p>
            <Link
              to="/vehicles"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl text-xs font-bold border border-slate-700"
            >
              <span>Explore Vehicles Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Show top column preview for single vehicle */}
          <div className="max-w-xs mx-auto">
            <ComparisonTable vehicles={vehicles} />
          </div>
        </div>
      ) : loading ? (
        /* Loading Skeleton */
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400 font-semibold">Building side-by-side matrix...</p>
        </div>
      ) : (
        /* Full Comparison Views for 2 to 4 Vehicles */
        <div className="space-y-12">
          {/* Main Specifications Table with Best-Value Highlights */}
          <ComparisonTable vehicles={vehicles} />

          {/* Radar Chart Overlay (Recharts) */}
          <RadarComparisonChart vehicles={vehicles} />

          {/* Features Checklist Comparison */}
          <FeatureComparison vehicles={vehicles} />

          {/* Side-by-Side Pros & Cons */}
          <ProsConsComparison vehicles={vehicles} />

          {/* AI Comparison Summary Section */}
          <AiComparisonSummary selectedIds={selectedIds} />
        </div>
      )}

    </div>
  );
};

export default ComparePage;
