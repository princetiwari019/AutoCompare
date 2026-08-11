import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminVehicleList from '../components/admin/AdminVehicleList';
import AdminMediaManager from '../components/admin/AdminMediaManager';
import { fetchAdminVehicles, deleteAdminVehicle, logoutAdmin } from '../services/adminService';
import { formatINR, getImageUrl } from '../utils/formatters';
import { ShieldCheck, RotateCcw, PlusCircle, LogOut, Car, Bike, CheckCircle2, AlertTriangle, Layers, Trash2, Settings, Clock, ArrowRight, Edit3 } from 'lucide-react';

const AdminDashboardPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [deletingVehicle, setDeletingVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const loadVehicles = () => {
    setLoading(true);
    setError(null);
    fetchAdminVehicles()
      .then((res) => {
        if (res.success) {
          setVehicles(res.data);
        } else {
          setError(res.message || 'Failed loading admin vehicle catalog');
        }
      })
      .catch((err) => {
        console.error('Error fetching admin vehicles', err);
        setError('Could not connect to Admin API backend.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleVehicleUpdated = (updatedVehicle) => {
    setSelectedVehicle(updatedVehicle);
    setVehicles((prev) =>
      prev.map((v) => (v._id === updatedVehicle._id ? updatedVehicle : v))
    );
  };

  const handleConfirmDelete = async () => {
    if (!deletingVehicle || deleting) return;
    setDeleting(true);
    try {
      const res = await deleteAdminVehicle(deletingVehicle._id);
      if (res.success) {
        setVehicles((prev) => prev.filter((v) => v._id !== deletingVehicle._id));
        setDeletingVehicle(null);
      }
    } catch (err) {
      console.error('Error deleting vehicle', err);
      alert(err.response?.data?.message || 'Failed to delete vehicle');
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  // Metrics summary
  const totalVehicles = vehicles.length;
  const totalCars = vehicles.filter((v) => v.type === 'car').length;
  const totalBikes = vehicles.filter((v) => v.type === 'bike').length;

  const completeMediaCount = vehicles.filter((v) => {
    const isCar = v.type === 'car';
    const ext = v.exteriorImages?.length || 0;
    const int = v.interiorImages?.length || 0;
    const det = v.detailImages?.length || 0;
    return isCar ? ext >= 4 && int >= 3 : ext >= 4 && det >= 3;
  }).length;

  const needsMediaCount = totalVehicles - completeMediaCount;

  // Recently added (top 4 latest created)
  const recentVehicles = [...vehicles].slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrator Control Portal</span>
          </div>
          <h1 className="text-3xl font-black text-white mt-1">
            Vehicle Management Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, edit, manage media assets, and purge vehicles in MongoDB catalog.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <Link
            to="/admin/vehicles/new"
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>+ Add Vehicle</span>
          </Link>

          <Link
            to="/admin/settings"
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-800"
            title="Admin settings"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>

          <button
            onClick={loadVehicles}
            className="px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 border border-slate-800"
            title="Refresh catalog"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-2.5 bg-rose-950/40 hover:bg-rose-900 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-1 border border-rose-800/60"
            title="Logout admin session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Total Catalog</span>
          </div>
          <div className="text-2xl font-black text-white">{totalVehicles}</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Car className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cars</span>
          </div>
          <div className="text-2xl font-black text-white">{totalCars}</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Bike className="w-3.5 h-3.5 text-cyan-400" />
            <span>Bikes</span>
          </div>
          <div className="text-2xl font-black text-white">{totalBikes}</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Complete Media</span>
          </div>
          <div className="text-2xl font-black text-emerald-400">{completeMediaCount}</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Needs Media</span>
          </div>
          <div className="text-2xl font-black text-amber-400">{needsMediaCount}</div>
        </div>

      </div>

      {/* PART K: Recently Added Vehicles Section */}
      {!selectedVehicle && recentVehicles.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Recently Cataloged Vehicles</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Latest Entries</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentVehicles.map((v) => {
              const isCar = v.type === 'car';
              const extCount = v.exteriorImages?.length || 0;
              const intCount = v.interiorImages?.length || 0;
              const detCount = v.detailImages?.length || 0;
              const isSatisfied = isCar ? extCount >= 4 && intCount >= 3 : extCount >= 4 && detCount >= 3;

              const rawThumb = v.images?.thumbnail || v.exteriorImages?.[0];
              const resolvedThumb = getImageUrl(rawThumb) || 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80';

              return (
                <div key={v._id} className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800/80 flex items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3">
                    <img src={resolvedThumb} alt={v.name} className="w-10 h-10 rounded-xl object-cover bg-slate-950 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs font-extrabold text-white truncate block">{v.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold block">{formatINR(v.price)}</span>
                    </div>
                  </div>
                  <Link
                    to={`/admin/vehicles/${v._id}/edit`}
                    className="p-2 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 rounded-xl transition-all shrink-0"
                    title="Edit vehicle"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel p-6 rounded-3xl border border-rose-500/40 bg-slate-900 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-400 font-extrabold text-lg">
              <Trash2 className="w-5 h-5" />
              <span>Delete {deletingVehicle.name}?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will permanently delete the vehicle document and all associated uploaded media files from server disk storage. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                disabled={deleting}
                onClick={() => setDeletingVehicle(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700"
              >
                Cancel
              </button>
              <button
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/30"
              >
                {deleting ? 'Deleting Vehicle...' : 'Delete Vehicle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main View Renderer */}
      {loading ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-semibold">Loading admin catalog from MongoDB...</p>
        </div>
      ) : error ? (
        <div className="glass-panel p-8 text-center rounded-3xl border border-rose-500/20 bg-rose-950/10 space-y-3 max-w-lg mx-auto">
          <h3 className="text-lg font-bold text-white">Admin Connection Error</h3>
          <p className="text-xs text-slate-400">{error}</p>
          <button
            onClick={loadVehicles}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl text-xs font-bold border border-slate-700 inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      ) : selectedVehicle ? (
        <AdminMediaManager
          vehicle={selectedVehicle}
          onBack={() => setSelectedVehicle(null)}
          onVehicleUpdated={handleVehicleUpdated}
        />
      ) : (
        <AdminVehicleList
          vehicles={vehicles}
          onSelectVehicle={(v) => setSelectedVehicle(v)}
          onDeleteVehicle={(v) => setDeletingVehicle(v)}
        />
      )}

    </div>
  );
};

export default AdminDashboardPage;
