import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Car, Bike, CheckCircle2, AlertTriangle, Image as ImageIcon, Edit3, Trash2, ArrowRight } from 'lucide-react';
import { formatINR, getImageUrl } from '../../utils/formatters';

const AdminVehicleList = ({ vehicles = [], onSelectVehicle, onDeleteVehicle }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const navigate = useNavigate();

  const filtered = vehicles.filter((v) => {
    const matchesType = !filterType || v.type === filterType;
    const matchesSearch =
      !search ||
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.brand.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Search & Category Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vehicle name, brand, model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 shrink-0">
          {[
            { id: '', label: 'All Catalog' },
            { id: 'car', label: 'Cars', icon: Car },
            { id: 'bike', label: 'Bikes', icon: Bike }
          ].map((item) => {
            const Icon = item.icon;
            const active = filterType === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setFilterType(item.id)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
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

      {/* Vehicle Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((v) => {
          const isCar = v.type === 'car';
          const extCount = v.exteriorImages?.length || 0;
          const intCount = v.interiorImages?.length || 0;
          const detCount = v.detailImages?.length || 0;

          const isSatisfied = isCar
            ? extCount >= 4 && intCount >= 3
            : extCount >= 4 && detCount >= 3;

          const rawThumb = v.images?.thumbnail || v.exteriorImages?.[0];
          const resolvedThumb = getImageUrl(rawThumb) || 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80';

          return (
            <div
              key={v._id}
              className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                <div className="relative h-40 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                  <img
                    src={resolvedThumb}
                    alt={v.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-slate-950/80 backdrop-blur-md rounded-lg text-[10px] font-bold text-slate-200 uppercase">
                    {isCar ? <Car className="w-3 h-3 text-cyan-400" /> : <Bike className="w-3 h-3 text-cyan-400" />}
                    <span>{v.category}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold uppercase text-cyan-400">{v.brand}</span>
                    <span className="font-extrabold text-white">{formatINR(v.price)}</span>
                  </div>
                  <h3 className="text-base font-bold text-white line-clamp-1">{v.name}</h3>
                </div>

                {/* Media Metrics & Validation Pill */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-3 text-slate-300 font-semibold">
                    <span className="flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                      Ext: {extCount}
                    </span>
                    {isCar ? (
                      <span>Int: {intCount}</span>
                    ) : (
                      <span>Det: {detCount}</span>
                    )}
                  </div>

                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 border ${
                    isSatisfied
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {isSatisfied ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    <span>{isSatisfied ? 'Ready' : 'Needs Media'}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons: Edit, Media, Delete */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => navigate(`/admin/vehicles/${v._id}/edit`)}
                  className="py-2 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border border-slate-700 transition-colors"
                  title="Edit specs"
                >
                  <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => onSelectVehicle(v)}
                  className="py-2 px-2 bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border border-cyan-500/30 transition-colors"
                  title="Manage media"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Media</span>
                </button>

                <button
                  onClick={() => onDeleteVehicle(v)}
                  className="py-2 px-2 bg-rose-950/40 hover:bg-rose-900/80 text-rose-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border border-rose-500/30 transition-colors"
                  title="Delete vehicle"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Delete</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default AdminVehicleList;
