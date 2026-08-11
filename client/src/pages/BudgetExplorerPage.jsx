import React, { useEffect, useState } from 'react';
import VehicleGrid from '../components/vehicle/VehicleGrid';
import { fetchVehicles } from '../services/vehicleService';
import { SlidersHorizontal, Car, Bike } from 'lucide-react';
import { formatINR } from '../utils/formatters';

const BudgetExplorerPage = () => {
  const [budget, setBudget] = useState(1200000); // Default ₹12 Lakh
  const [type, setType] = useState('car');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchVehicles({
      type,
      maxPrice: budget,
      sortBy: 'price_asc',
      limit: 12
    })
      .then((res) => {
        if (res.success) {
          setVehicles(res.data);
        }
      })
      .catch((err) => console.error('Error loading budget vehicles', err))
      .finally(() => setLoading(false));
  }, [budget, type]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-bold">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Budget-Based Discovery Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Find Vehicles Within Your Budget</h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          Set your target budget limit in Indian Rupees (INR) to explore vehicles.
        </p>
      </div>

      {/* Control Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-3xl mx-auto space-y-6">
        
        {/* Type Toggle */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => {
              setType('car');
              setBudget(1200000);
            }}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              type === 'car'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Cars Only</span>
          </button>

          <button
            onClick={() => {
              setType('bike');
              setBudget(250000);
            }}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              type === 'bike'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Bikes Only</span>
          </button>
        </div>

        {/* Budget Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Target Budget Ceiling:
            </span>
            <span className="text-2xl font-black text-cyan-400">
              {formatINR(budget)}
            </span>
          </div>

          <input
            type="range"
            min={type === 'bike' ? 100000 : 500000}
            max={type === 'bike' ? 500000 : 6500000}
            step={type === 'bike' ? 10000 : 50000}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer bg-slate-800 rounded-lg h-3"
          />

          <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
            <span>Min ({type === 'bike' ? '₹1.00 Lakh' : '₹5.00 Lakh'})</span>
            <span>Max ({type === 'bike' ? '₹5.00 Lakh' : '₹65.00 Lakh'})</span>
          </div>
        </div>

      </div>

      {/* Grid View */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">
          Matched Options (Under or near {formatINR(budget)})
        </h2>
        <VehicleGrid vehicles={vehicles} loading={loading} />
      </div>

    </div>
  );
};

export default BudgetExplorerPage;
