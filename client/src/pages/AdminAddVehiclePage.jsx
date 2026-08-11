import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VehicleForm from '../components/admin/VehicleForm';
import { createAdminVehicle } from '../services/adminService';
import { PlusCircle, ArrowLeft, ShieldAlert } from 'lucide-react';

const AdminAddVehiclePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCreateSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await createAdminVehicle(formData);
      if (res.success && res.data) {
        // Redirect to edit/media page to attach vehicle images
        navigate(`/admin`);
      } else {
        setError(res.message || 'Failed to create vehicle');
      }
    } catch (err) {
      console.error('Error creating vehicle', err);
      setError(err.response?.data?.message || 'Failed to create vehicle. Check input values.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <PlusCircle className="w-4 h-4" />
            <span>Admin Management</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-0.5">Add New Vehicle</h1>
          <p className="text-xs text-slate-400">
            Create a new vehicle record in MongoDB and proceed to media upload.
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

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-2xl text-xs text-rose-300 font-semibold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Vehicle Form */}
      <VehicleForm onSubmit={handleCreateSubmit} loading={loading} isEditMode={false} />

    </div>
  );
};

export default AdminAddVehiclePage;
