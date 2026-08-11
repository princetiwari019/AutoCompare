import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VehicleForm from '../components/admin/VehicleForm';
import AdminMediaManager from '../components/admin/AdminMediaManager';
import { fetchAdminVehicleById, updateAdminVehicle } from '../services/adminService';
import { Edit3, ArrowLeft, ShieldAlert, CheckCircle } from 'lucide-react';

const AdminEditVehiclePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    fetchAdminVehicleById(id)
      .then((res) => {
        if (res.success) {
          setVehicle(res.data);
        } else {
          setError(res.message || 'Vehicle not found');
        }
      })
      .catch((err) => {
        console.error('Error fetching vehicle', err);
        setError('Vehicle not found');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdateSubmit = async (formData) => {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await updateAdminVehicle(id, formData);
      if (res.success) {
        setVehicle(res.data);
        setSuccessMsg('Vehicle specifications updated successfully! Existing media preserved.');
      } else {
        setError(res.message || 'Failed to update vehicle');
      }
    } catch (err) {
      console.error('Error updating vehicle', err);
      setError(err.response?.data?.message || 'Failed to update vehicle');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400 font-semibold">Loading vehicle specifications...</p>
      </div>
    );
  }

  if (error && !vehicle) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-6 glass-panel rounded-3xl border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
        <button
          onClick={() => navigate('/admin')}
          className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <Edit3 className="w-4 h-4" />
            <span>Edit Vehicle</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-0.5">{vehicle.name}</h1>
          <p className="text-xs text-slate-400">
            ID: {vehicle._id} • {vehicle.brand} • {vehicle.type.toUpperCase()}
          </p>
        </div>

        <button
          onClick={() => navigate('/admin')}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-slate-800 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-2xl text-xs text-rose-300 font-semibold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Vehicle Form */}
      <VehicleForm initialValues={vehicle} onSubmit={handleUpdateSubmit} loading={saving} isEditMode={true} />

      {/* Media Management Section */}
      <div className="pt-6 border-t border-slate-800">
        <AdminMediaManager vehicle={vehicle} onVehicleUpdated={(updated) => setVehicle(updated)} />
      </div>

    </div>
  );
};

export default AdminEditVehiclePage;
