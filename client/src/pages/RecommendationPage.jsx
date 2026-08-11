import React, { useState, useEffect } from 'react';
import VehicleTypeSelector from '../components/recommend/VehicleTypeSelector';
import BudgetSelector from '../components/recommend/BudgetSelector';
import PreferencePreset from '../components/recommend/PreferencePreset';
import PreferenceControls from '../components/recommend/PreferenceControls';
import RecommendationResults from '../components/recommend/RecommendationResults';

import { fetchRecommendations } from '../services/vehicleService';
import { Sparkles, SlidersHorizontal } from 'lucide-react';

const RecommendationPage = () => {
  const [vehicleType, setVehicleType] = useState('car');
  const [minPrice, setMinPrice] = useState(600000);
  const [maxPrice, setMaxPrice] = useState(2500000);
  const [activePreset, setActivePreset] = useState('balanced');
  const [weights, setWeights] = useState({
    price: 20,
    mileage: 30,
    safety: 25,
    performance: 15,
    features: 10
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalWeight =
    (weights.price || 0) +
    (weights.mileage || 0) +
    (weights.safety || 0) +
    (weights.performance || 0) +
    (weights.features || 0);

  const isValid = totalWeight === 100;

  // Handle vehicle type change and update default budget bounds accordingly
  const handleTypeChange = (newType) => {
    setVehicleType(newType);
    if (newType === 'car') {
      setMinPrice(600000);
      setMaxPrice(2500000);
    } else {
      setMinPrice(100000);
      setMaxPrice(350000);
    }
  };

  // Handle preset profile click
  const handlePresetSelect = (preset) => {
    setActivePreset(preset.id);
    setWeights(preset.weights);
  };

  // Handle weight change
  const handleWeightChange = (key, value) => {
    setActivePreset('custom');
    setWeights((prev) => ({ ...prev, [key]: value }));
  };

  // Handle budget slider change
  const handleBudgetChange = (field, value) => {
    if (field === 'minPrice') setMinPrice(value);
    if (field === 'maxPrice') setMaxPrice(value);
  };

  // Execute recommendation request via existing vehicleService -> POST /api/recommendations
  const getRecommendations = () => {
    if (!isValid) return;

    setLoading(true);
    setError(null);

    const payload = {
      type: vehicleType,
      minPrice,
      maxPrice,
      weights
    };

    fetchRecommendations(payload)
      .then((res) => {
        if (res.success) {
          setRecommendations(res.data || []);
        } else {
          setError(res.message || 'Failed generating recommendations.');
        }
      })
      .catch((err) => {
        console.error('Error fetching recommendations', err);
        const msg = err.response?.data?.message || 'Network error while reaching recommendation engine.';
        setError(msg);
      })
      .finally(() => setLoading(false));
  };

  // Fetch initial recommendation on mount
  useEffect(() => {
    getRecommendations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Smart Match Scoring</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mt-1">
          Personalized Vehicle Recommendation
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure your target budget and priority weights to generate deterministic match scores against MongoDB catalog.
        </p>
      </div>

      {/* Main Grid: Controls Left, Results Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2 font-bold text-white text-base">
            <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
            <span>Configure Priorities</span>
          </div>

          <VehicleTypeSelector selectedType={vehicleType} onChange={handleTypeChange} />

          <BudgetSelector
            minPrice={minPrice}
            maxPrice={maxPrice}
            onChange={handleBudgetChange}
            type={vehicleType}
          />

          <PreferencePreset activePreset={activePreset} onSelectPreset={handlePresetSelect} />

          <PreferenceControls
            weights={weights}
            onChangeWeight={handleWeightChange}
            totalWeight={totalWeight}
          />

          {/* Primary Action CTA */}
          <button
            type="button"
            disabled={!isValid || loading}
            onClick={getRecommendations}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all duration-200"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Finding the best vehicles...' : 'Find My Vehicle'}</span>
          </button>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7">
          <RecommendationResults
            recommendations={recommendations}
            loading={loading}
            error={error}
            userPreferences={{
              type: vehicleType,
              minPrice,
              maxPrice,
              weights
            }}
            onResetFilters={() => {
              setMinPrice(vehicleType === 'car' ? 500000 : 100000);
              setMaxPrice(vehicleType === 'car' ? 3000000 : 400000);
            }}
          />
        </div>

      </div>

    </div>
  );
};

export default RecommendationPage;
