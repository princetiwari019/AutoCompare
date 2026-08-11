import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Bike, Sparkles, Scale, SlidersHorizontal, ArrowRight } from 'lucide-react';
import VehicleCard from '../components/vehicle/VehicleCard';
import { fetchVehicles } from '../services/vehicleService';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('car');

  useEffect(() => {
    fetchVehicles({ limit: 6 })
      .then((res) => {
        if (res.success) {
          setFeaturedVehicles(res.data);
        }
      })
      .catch((err) => console.error('Error loading featured vehicles', err))
      .finally(() => setLoading(false));
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/vehicles?search=${encodeURIComponent(searchQuery)}&type=${activeType}`);
    } else {
      navigate(`/vehicles?type=${activeType}`);
    }
  };

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        
        {/* Top Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-wide shadow-lg shadow-cyan-950/40 animate-in fade-in slide-in-from-top duration-500">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Vehicle Discovery, Comparison & Recommendation Platform</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Discover & Compare <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
              Your Perfect Car or Bike
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Search across top Indian brands, filter by budget in INR, compare side-by-side specs, and get custom recommendations.
          </p>
        </div>

        {/* Hero Quick Search Card */}
        <div className="max-w-2xl mx-auto glass-panel p-4 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
          
          {/* Car vs Bike Selector */}
          <div className="flex justify-center gap-2 border-b border-slate-800/80 pb-3">
            <button
              onClick={() => setActiveType('car')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeType === 'car'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Explore Cars</span>
            </button>
            <button
              onClick={() => setActiveType('bike')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeType === 'bike'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>Explore Bikes</span>
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder={`Search ${activeType === 'car' ? 'cars' : 'bikes'} (e.g. Tata, Nexon, Swift, Apache)...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
            >
              <span>Explore Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Side-by-Side Matrix</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compare up to 3 vehicles directly across prices, power, mileage, safety ratings, and radar score profiles.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Native MongoDB Storage</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              100% database persistence using Mongoose ODM with numeric INR pricing and indexed filtering.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Budget Explorer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Define your price ceiling in Lakhs and discover top-rated cars and bikes matching your financial plan.
            </p>
          </div>

        </div>
      </section>

      {/* Featured Vehicles Carousel / Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Featured Vehicles</h2>
            <p className="text-xs text-slate-400">Top trending cars and bikes in MongoDB database</p>
          </div>
          <Link
            to="/vehicles"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View All Vehicles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>

      {/* Quick Budget Discovery Shortcuts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-white">Explore by Budget Range</h2>
            <p className="text-xs text-slate-400">Browse vehicles categorized by INR price points</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/vehicles?maxPrice=1000000"
              className="p-5 glass-card rounded-2xl border border-slate-800 text-center space-y-2 hover:border-cyan-500/40"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Budget Friendly</span>
              <div className="text-xl font-extrabold text-white">Under ₹10 Lakh</div>
              <p className="text-[11px] text-slate-400">Bikes & entry commuter cars</p>
            </Link>

            <Link
              to="/vehicles?minPrice=1000000&maxPrice=2000000"
              className="p-5 glass-card rounded-2xl border border-slate-800 text-center space-y-2 hover:border-cyan-500/40"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Mid-Range Sweet Spot</span>
              <div className="text-xl font-extrabold text-white">₹10 Lakh - ₹20 Lakh</div>
              <p className="text-[11px] text-slate-400">Feature-loaded SUVs, Sedans & Sport bikes</p>
            </Link>

            <Link
              to="/vehicles?minPrice=2000000"
              className="p-5 glass-card rounded-2xl border border-slate-800 text-center space-y-2 hover:border-cyan-500/40"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Premium & Performance</span>
              <div className="text-xl font-extrabold text-white">₹20 Lakh+</div>
              <p className="text-[11px] text-slate-400">Luxury EVs, Superbikes & Luxury sedans</p>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
