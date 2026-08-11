import React from 'react';
import RecommendationCard from './RecommendationCard';
import { SearchX, AlertCircle, Sparkles, RotateCcw } from 'lucide-react';

const RecommendationResults = ({
  recommendations = [],
  loading = false,
  error = null,
  userPreferences = {},
  onResetFilters
}) => {
  if (loading) {
    return (
      <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <h3 className="text-lg font-bold text-white">Finding the best vehicles for you...</h3>
        <p className="text-xs text-slate-400">
          Running mathematical min-max normalization & preference weighting against MongoDB catalog
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-8 text-center rounded-3xl border border-rose-500/20 bg-rose-950/10 space-y-3 max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Recommendation Error</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
      </div>
    );
  }

  if (!loading && recommendations.length === 0) {
    return (
      <div className="glass-panel p-10 text-center rounded-3xl border border-slate-800 space-y-4 max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-white">No Matching Vehicles</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          No vehicles match your selected budget window. Try expanding your price range or adjusting preference weights.
        </p>
        <button
          onClick={onResetFilters}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold rounded-xl border border-slate-700 inline-flex items-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Adjust Budget & Preferences</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>Your Recommended Vehicles</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked using deterministic multi-attribute utility normalization
          </p>
        </div>
        <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-xl">
          Top {recommendations.length} Matches
        </span>
      </div>

      <div className="space-y-6">
        {recommendations.map((rec) => (
          <RecommendationCard
            key={rec.vehicle._id}
            recommendation={rec}
            userPreferences={userPreferences}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendationResults;
