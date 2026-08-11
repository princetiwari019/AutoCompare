import React from 'react';
import { SlidersHorizontal, RotateCcw, Search, Car, Bike, Star } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

const FilterSidebar = ({
  filters,
  setFilters,
  meta,
  onReset
}) => {
  const handleTypeChange = (selectedType) => {
    setFilters((prev) => ({ ...prev, type: selectedType, vehicleType: selectedType, page: 1 }));
  };

  const handlePriceChange = (e) => {
    setFilters((prev) => ({ ...prev, maxPrice: e.target.value, page: 1 }));
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleBrandToggle = (brand) => {
    setFilters((prev) => {
      const currentBrands = prev.brand ? prev.brand.split(',') : [];
      const updated = currentBrands.includes(brand)
        ? currentBrands.filter((b) => b !== brand)
        : [...currentBrands, brand];
      return { ...prev, brand: updated.join(','), page: 1 };
    });
  };

  const selectedBrands = filters.brand ? filters.brand.split(',') : [];
  const currentType = filters.type || filters.vehicleType || '';

  return (
    <aside className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 font-bold text-white text-base">
          <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
          <span>Filter Options</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Vehicle Type Toggle */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Vehicle Type
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
          {[
            { id: '', label: 'All' },
            { id: 'car', label: 'Cars', icon: Car },
            { id: 'bike', label: 'Bikes', icon: Bike }
          ].map((item) => {
            const Icon = item.icon;
            const active = currentType === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTypeChange(item.id)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  active
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Bar Input */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Search Keyword
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search brand, model, variant..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>

      {/* Max Price Range Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-slate-300 uppercase tracking-wider">
            Max Price Ceiling
          </label>
          <span className="font-bold text-cyan-400">
            {formatINR(filters.maxPrice || meta.priceRange?.maxPrice || 6500000)}
          </span>
        </div>
        <input
          type="range"
          min={meta.priceRange?.minPrice || 100000}
          max={meta.priceRange?.maxPrice || 6500000}
          step={50000}
          value={filters.maxPrice || meta.priceRange?.maxPrice || 6500000}
          onChange={handlePriceChange}
          className="w-full accent-cyan-500 cursor-pointer bg-slate-800 rounded-lg h-2"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-medium">
          <span>{formatINR(meta.priceRange?.minPrice || 100000)}</span>
          <span>{formatINR(meta.priceRange?.maxPrice || 6500000)}</span>
        </div>
      </div>

      {/* Brand Checkboxes */}
      {meta.brands && meta.brands.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Filter by Brand
          </label>
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {meta.brands.map((b) => (
              <label
                key={b}
                className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(b)}
                  onChange={() => handleBrandToggle(b)}
                  className="rounded border-slate-800 bg-slate-900 text-cyan-500 focus:ring-0"
                />
                <span>{b}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Fuel Type Dropdown */}
      {meta.fuelTypes && meta.fuelTypes.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Fuel Type
          </label>
          <select
            value={filters.fuelType || ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, fuelType: e.target.value, page: 1 }))}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Fuel Types</option>
            {meta.fuelTypes.map((ft) => (
              <option key={ft} value={ft}>
                {ft}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Transmission Dropdown */}
      {meta.transmissions && meta.transmissions.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Transmission
          </label>
          <select
            value={filters.transmission || ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, transmission: e.target.value, page: 1 }))}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Transmissions</option>
            {meta.transmissions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Minimum Rating Dropdown */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Minimum Rating
        </label>
        <select
          value={filters.minRating || ''}
          onChange={(e) => setFilters((prev) => ({ ...prev, minRating: e.target.value, page: 1 }))}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
        >
          <option value="">All Ratings</option>
          <option value="4.5">4.5+ Stars ★★★★★</option>
          <option value="4.0">4.0+ Stars ★★★★☆</option>
          <option value="3.5">3.5+ Stars ★★★☆☆</option>
        </select>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={onReset}
        className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-colors border border-slate-700 flex items-center justify-center gap-2"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Clear All Filters</span>
      </button>

    </aside>
  );
};

export default FilterSidebar;
