import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterSidebar from '../components/discovery/FilterSidebar';
import VehicleCard from '../components/vehicle/VehicleCard';
import { fetchVehicles, fetchFilterMetadata } from '../services/vehicleService';
import { ChevronLeft, ChevronRight, SlidersHorizontal, SearchX, AlertCircle, RotateCcw } from 'lucide-react';

const ListingPage = ({ defaultType = '' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({});
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, currentPage: 1 });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Debounced search state
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  // Active filters state
  const [filters, setFilters] = useState(() => ({
    type: searchParams.get('type') || defaultType,
    brand: searchParams.get('brand') || '',
    category: searchParams.get('category') || '',
    fuelType: searchParams.get('fuelType') || '',
    transmission: searchParams.get('transmission') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sortBy') || 'price_asc',
    page: parseInt(searchParams.get('page') || '1', 10)
  }));

  // Handle route parameter changes (e.g. switching between /cars and /bikes)
  useEffect(() => {
    if (defaultType) {
      setFilters((prev) => ({ ...prev, type: defaultType, vehicleType: defaultType, page: 1 }));
    }
  }, [defaultType]);

  // Debounce search input changes by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Sync URL query params with state
  useEffect(() => {
    const params = {};
    const activeType = filters.type || defaultType;
    if (activeType) params.type = activeType;
    if (filters.brand) params.brand = filters.brand;
    if (filters.category) params.category = filters.category;
    if (filters.fuelType) params.fuelType = filters.fuelType;
    if (filters.transmission) params.transmission = filters.transmission;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.minRating) params.minRating = filters.minRating;
    if (filters.search) params.search = filters.search;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.page > 1) params.page = filters.page;

    setSearchParams(params, { replace: true });
  }, [filters, defaultType, setSearchParams]);

  // Load filter metadata dropdown options
  useEffect(() => {
    fetchFilterMetadata(filters.type || defaultType)
      .then((res) => {
        if (res.success) {
          setMeta(res.data);
        }
      })
      .catch((err) => console.error('Error fetching filter metadata', err));
  }, [filters.type, defaultType]);

  // Load vehicles list from backend Express API
  const loadVehicles = () => {
    setLoading(true);
    setError(null);
    fetchVehicles({ ...filters, type: filters.type || defaultType })
      .then((res) => {
        if (res.success) {
          setVehicles(res.data);
          setPagination({
            total: res.total,
            totalPages: res.totalPages,
            currentPage: res.currentPage
          });
        } else {
          setError(res.message || 'Failed loading vehicles.');
        }
      })
      .catch((err) => {
        console.error('Error fetching vehicles list', err);
        setError('Network or server error while loading vehicles. Please check your connection.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadVehicles();
  }, [filters]);

  const handleResetFilters = () => {
    setSearchInput('');
    setFilters({
      type: defaultType,
      brand: '',
      category: '',
      fuelType: '',
      transmission: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      search: '',
      sortBy: 'price_asc',
      page: 1
    });
  };

  // Determine dynamic count text
  const currentType = filters.type || defaultType;
  const typeLabel = currentType === 'car' ? 'cars' : currentType === 'bike' ? 'bikes' : 'vehicles';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white capitalize">
            Explore {typeLabel}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            <strong className="text-cyan-400 font-bold">{pagination.total}</strong> {typeLabel} found
          </p>
        </div>

        {/* Controls: Mobile Filter Drawer Toggle & Sort Dropdown */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden px-3.5 py-2 glass-panel rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-2 border border-slate-800"
          >
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 hidden sm:inline font-medium">Sort By:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value, page: 1 }))}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 font-semibold"
            >
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Rating: High to Low</option>
              <option value="mileage_desc">Mileage: High to Low</option>
              <option value="power_desc">Power: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <FilterSidebar
            filters={{ ...filters, search: searchInput }}
            setFilters={(updater) => {
              const updated = typeof updater === 'function' ? updater(filters) : updater;
              if (updated.search !== undefined) setSearchInput(updated.search);
              setFilters(updated);
            }}
            meta={meta}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Drawer Filter */}
        {isMobileFilterOpen && (
          <div className="lg:hidden col-span-1 mb-4">
            <FilterSidebar
              filters={{ ...filters, search: searchInput }}
              setFilters={(updater) => {
                const updated = typeof updater === 'function' ? updater(filters) : updater;
                if (updated.search !== undefined) setSearchInput(updated.search);
                setFilters(updated);
              }}
              meta={meta}
              onReset={handleResetFilters}
            />
          </div>
        )}

        {/* Main Grid & States Area */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Loading Skeleton State */}
          {loading ? (
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
          ) : error ? (
            /* Error State */
            <div className="glass-panel rounded-2xl p-10 text-center space-y-4 border border-rose-500/20 max-w-lg mx-auto my-8">
              <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Error Loading Vehicles</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
              <button
                onClick={loadVehicles}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/25 inline-flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </button>
            </div>
          ) : vehicles.length === 0 ? (
            /* Empty Results State */
            <div className="glass-panel rounded-2xl p-12 text-center space-y-4 border border-slate-800 max-w-lg mx-auto my-8">
              <div className="w-16 h-16 rounded-full bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">No vehicles found</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                No vehicles matched your selected filter criteria. Try adjusting your search keyword or clearing active filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl text-xs font-bold border border-slate-700 inline-flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear All Filters</span>
              </button>
            </div>
          ) : (
            /* Vehicle Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && !error && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                disabled={filters.page <= 1}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-xs font-semibold text-slate-300 px-4">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <button
                disabled={filters.page >= pagination.totalPages}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default ListingPage;
