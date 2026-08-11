import React, { useState } from 'react';
import { Save, Car, Bike, DollarSign, Shield, Zap, Sparkles } from 'lucide-react';

const VehicleForm = ({ initialValues = {}, onSubmit, loading = false, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    type: initialValues.type || 'car',
    brand: initialValues.brand || '',
    model: initialValues.model || '',
    variant: initialValues.variant || 'VXi',
    price: initialValues.price || '',
    category: initialValues.category || (initialValues.type === 'bike' ? 'Commuter' : 'Hatchback'),
    fuelType: initialValues.fuelType || 'Petrol',
    transmission: initialValues.transmission || 'Manual',
    engine: initialValues.engine || '',
    mileage: initialValues.mileage || '',
    power: initialValues.power || '',
    torque: initialValues.torque || '',
    seatingCapacity: initialValues.seatingCapacity || (initialValues.type === 'bike' ? 2 : 5),
    safetyRating: initialValues.safetyRating || 4,
    rating: initialValues.rating || 4.5,
    description: initialValues.description || '',
    features: Array.isArray(initialValues.features) ? initialValues.features.join(', ') : initialValues.features || '',
    pros: Array.isArray(initialValues.pros) ? initialValues.pros.join(', ') : initialValues.pros || '',
    cons: Array.isArray(initialValues.cons) ? initialValues.cons.join(', ') : initialValues.cons || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* 1. Basic Information */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3 uppercase tracking-wider">
          <Car className="w-4 h-4 text-cyan-400" />
          <span>1. Basic Vehicle Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Vehicle Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={isEditMode}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="car">🚗 Car</option>
              <option value="bike">🏍️ Bike</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Brand / Manufacturer *</label>
            <input
              type="text"
              name="brand"
              required
              placeholder="e.g. Maruti Suzuki, Tata, BMW"
              value={formData.brand}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Model Name *</label>
            <input
              type="text"
              name="model"
              required
              placeholder="e.g. Swift, Nexon, Fortuner"
              value={formData.model}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Variant / Trim *</label>
            <input
              type="text"
              name="variant"
              required
              placeholder="e.g. VXi, Creative, Style"
              value={formData.variant}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Ex-Showroom Price (INR ₹) *</label>
            <input
              type="number"
              name="price"
              required
              min="10000"
              placeholder="e.g. 649000"
              value={formData.price}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Body Category</label>
            <input
              type="text"
              name="category"
              placeholder="e.g. Hatchback, SUV, Cruiser, Sport"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Specifications & Performance */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3 uppercase tracking-wider">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>2. Engine & Performance Specs</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Fuel Type</label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="CNG">CNG</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Transmission</label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
              <option value="AMT">AMT</option>
              <option value="DCT">DCT</option>
              <option value="CVT">CVT</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Engine Capacity (cc)</label>
            <input
              type="number"
              name="engine"
              placeholder="e.g. 1197"
              value={formData.engine}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Mileage (km/l or km range)</label>
            <input
              type="number"
              step="0.01"
              name="mileage"
              placeholder="e.g. 22.38"
              value={formData.mileage}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Max Power (bhp)</label>
            <input
              type="number"
              step="0.1"
              name="power"
              placeholder="e.g. 82"
              value={formData.power}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Max Torque (Nm)</label>
            <input
              type="number"
              step="0.1"
              name="torque"
              placeholder="e.g. 112"
              value={formData.torque}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Safety & Ratings */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3 uppercase tracking-wider">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>3. Safety Ratings & Seating Capacity</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Seating Capacity</label>
            <input
              type="number"
              name="seatingCapacity"
              placeholder="5"
              value={formData.seatingCapacity}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">GNCAP Safety Rating (0 to 5 Stars)</label>
            <input
              type="number"
              min="0"
              max="5"
              name="safetyRating"
              placeholder="4"
              value={formData.safetyRating}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Overall Rating (out of 5)</label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="5"
              name="rating"
              placeholder="4.5"
              value={formData.rating}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* 4. Description, Features, Pros & Cons */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>4. Vehicle Overview & Features</span>
        </h3>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Description</label>
            <textarea
              rows={3}
              name="description"
              placeholder="Detailed description of the vehicle..."
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Features (comma-separated)</label>
              <textarea
                rows={3}
                name="features"
                placeholder="Touchscreen, ABS, Airbags, Sunroof"
                value={formData.features}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Pros / Advantages (comma-separated)</label>
              <textarea
                rows={3}
                name="pros"
                placeholder="High mileage, Low maintenance, High resale"
                value={formData.pros}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Cons / Disadvantages (comma-separated)</label>
              <textarea
                rows={3}
                name="cons"
                placeholder="Long waiting period, Basic rear space"
                value={formData.cons}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit CTA */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-extrabold text-xs rounded-2xl shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition-all"
        >
          <Save className="w-4 h-4 text-slate-950" />
          <span>{loading ? 'Saving Vehicle...' : isEditMode ? 'Update Vehicle Data' : 'Create & Proceed to Media Upload'}</span>
        </button>
      </div>

    </form>
  );
};

export default VehicleForm;
