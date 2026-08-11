import React, { useState } from 'react';
import {
  ArrowLeft,
  Upload,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Camera,
  Armchair,
  Info,
  ShieldCheck
} from 'lucide-react';
import {
  uploadVehicleImage,
  deleteVehicleImage,
  reorderVehicleImages,
  validateVehicleImages
} from '../../services/adminService';
import { formatINR, getImageUrl } from '../../utils/formatters';

const AdminMediaManager = ({ vehicle, onBack, onVehicleUpdated }) => {
  const [activeCategory, setActiveCategory] = useState('exterior'); // 'exterior', 'interior', 'detail'
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  if (!vehicle) return null;

  const isCar = vehicle.type === 'car';
  const extList = vehicle.exteriorImages || [];
  const intList = vehicle.interiorImages || [];
  const detList = vehicle.detailImages || [];

  const currentList =
    activeCategory === 'exterior'
      ? extList
      : activeCategory === 'interior'
      ? intList
      : detList;

  const minRequired = activeCategory === 'exterior' ? 4 : 3;
  const maxAllowed = activeCategory === 'exterior' ? 8 : 6;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Only JPEG, JPG, PNG, and WEBP images are allowed');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be less than 5 MB');
      return;
    }

    setError(null);
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
  };

  const handleUploadConfirm = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await uploadVehicleImage(vehicle._id, activeCategory, selectedFile);
      if (res.success) {
        setMessage(`Image uploaded to ${activeCategory} gallery!`);
        setSelectedFile(null);
        setFilePreview(null);
        onVehicleUpdated(res.data);
      } else {
        setError(res.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Error uploading image', err);
      const errMsg = err.response?.data?.message || 'Error uploading file to server.';
      setError(errMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (url) => {
    if (!window.confirm('Delete this image asset?')) return;

    setError(null);
    setMessage(null);

    try {
      const res = await deleteVehicleImage(vehicle._id, activeCategory, url);
      if (res.success) {
        setMessage('Image removed safely.');
        onVehicleUpdated(res.data);
      }
    } catch (err) {
      console.error('Error deleting image', err);
      setError(err.response?.data?.message || 'Error removing image asset.');
    }
  };

  const handleMove = async (fromIdx, direction) => {
    const toIdx = fromIdx + direction;
    if (toIdx < 0 || toIdx >= currentList.length) return;

    const newList = [...currentList];
    const temp = newList[fromIdx];
    newList[fromIdx] = newList[toIdx];
    newList[toIdx] = temp;

    try {
      const res = await reorderVehicleImages(vehicle._id, activeCategory, newList);
      if (res.success) {
        onVehicleUpdated(res.data);
      }
    } catch (err) {
      console.error('Error reordering images', err);
    }
  };

  const handleValidateRequirements = async () => {
    setError(null);
    setMessage(null);
    try {
      const res = await validateVehicleImages(vehicle._id);
      if (res.valid) {
        setMessage('✅ Vehicle satisfies all minimum media requirements!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Media requirements not satisfied.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Admin Catalog</span>
          </button>

          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <span>Manage Media — {vehicle.name}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {vehicle.brand} • {vehicle.category} • {formatINR(vehicle.price)}
          </p>
        </div>

        <button
          onClick={handleValidateRequirements}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20 inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Validate Media Requirements</span>
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-950/40 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 glass-panel p-2 rounded-2xl border border-slate-800">
        <button
          onClick={() => {
            setActiveCategory('exterior');
            setSelectedFile(null);
            setFilePreview(null);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeCategory === 'exterior'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Exterior ({extList.length}/8)</span>
        </button>

        {isCar ? (
          <button
            onClick={() => {
              setActiveCategory('interior');
              setSelectedFile(null);
              setFilePreview(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeCategory === 'interior'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Armchair className="w-4 h-4" />
            <span>Interior ({intList.length}/6)</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setActiveCategory('detail');
              setSelectedFile(null);
              setFilePreview(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeCategory === 'detail'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Cockpit & Details ({detList.length}/6)</span>
          </button>
        )}
      </div>

      {/* Upload Drop Zone / Staging Box */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white capitalize">
              Upload {activeCategory} Image
            </h3>
            <p className="text-[11px] text-slate-400">
              Min required: {minRequired} | Max allowed: {maxAllowed} | Format: JPEG, PNG, WEBP (&lt; 5MB)
            </p>
          </div>

          <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 cursor-pointer inline-flex items-center gap-2">
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Select Local Image File</span>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>

        {/* Staged File Local Preview */}
        {filePreview && (
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/90 p-4 rounded-2xl border border-cyan-500/30">
            <img
              src={filePreview}
              alt="Staged Preview"
              className="w-32 h-24 object-cover rounded-xl border border-slate-700"
            />
            <div className="flex-1 space-y-1 text-xs">
              <span className="font-bold text-white block">{selectedFile.name}</span>
              <span className="text-slate-400 block">{(selectedFile.size / 1024).toFixed(1)} KB</span>
              <span className="text-cyan-400 font-semibold block uppercase">Target: {activeCategory}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setFilePreview(null);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                disabled={uploading}
                onClick={handleUploadConfirm}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-cyan-500/20"
              >
                {uploading ? 'Uploading...' : 'Confirm Upload'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Gallery Grid Display */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white capitalize">
          Current {activeCategory} Gallery ({currentList.length})
        </h3>

        {currentList.length === 0 ? (
          <div className="glass-panel p-8 text-center rounded-2xl border border-slate-800 text-xs text-slate-400 italic">
            No {activeCategory} images uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {currentList.map((url, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-3 border border-slate-800 space-y-2 relative group bg-slate-900"
              >
                {/* Index & Primary Pill */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                  <span className="px-2 py-0.5 bg-slate-950 rounded-lg">
                    #{idx + 1}
                  </span>
                  {idx === 0 && activeCategory === 'exterior' && (
                    <span className="px-2 py-0.5 bg-cyan-500 text-slate-950 rounded-lg font-black uppercase">
                      Primary
                    </span>
                  )}
                </div>

                {/* Image Preview */}
                <div className="h-32 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                  <img
                    src={getImageUrl(url)}
                    alt={`Image ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Move Left / Right Controls & Delete */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <div className="flex items-center gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, -1)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                      title="Move Left"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={idx === currentList.length - 1}
                      onClick={() => handleMove(idx, 1)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                      title="Move Right"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleDeleteImage(url)}
                    className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                    title="Delete Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminMediaManager;
