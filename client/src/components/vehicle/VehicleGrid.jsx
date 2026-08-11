import React from 'react';
import VehicleCard from './VehicleCard';
import { SearchX } from 'lucide-react';

const VehicleGrid = ({ vehicles = [], loading = false, recommendations = null }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="glass-card rounded-2xl h-96 p-5 space-y-4 animate-pulse border border-slate-800"
          >
            <div className="h-44 bg-slate-800 rounded-xl w-full" />
            <div className="h-4 bg-slate-800 rounded w-1/3" />
            <div className="h-6 bg-slate-800 rounded w-2/3" />
            <div className="h-12 bg-slate-800 rounded-xl w-full" />
          </div>
        ))}
      </div>
    );
  }

  // If rendering recommendation objects ({ vehicle, matchScore, matchReasons })
  if (recommendations && recommendations.length > 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          <VehicleCard
            key={rec.vehicle._id}
            vehicle={rec.vehicle}
            matchScore={rec.matchScore}
            matchReasons={rec.matchReasons}
          />
        ))}
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center space-y-4 border border-slate-800 max-w-lg mx-auto my-8">
        <div className="w-16 h-16 rounded-full bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white">No Vehicles Found</h3>
        <p className="text-slate-400 text-sm">
          We couldn't find any vehicles matching your filter criteria. Try adjusting your price range or clearing active filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle._id} vehicle={vehicle} />
      ))}
    </div>
  );
};

export default VehicleGrid;
