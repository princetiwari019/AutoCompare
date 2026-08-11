const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vehicle name is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['car', 'bike'],
      required: [true, 'Type must be car or bike'],
      index: true
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      index: true
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true
    },
    variant: {
      type: String,
      default: '',
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
      index: true
    },
    category: {
      type: String,
      default: 'General'
    },
    year: {
      type: Number,
      default: 2024
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
      default: 'Petrol'
    },
    transmission: {
      type: String,
      enum: ['Manual', 'Automatic', 'CVT', 'Single-Speed'],
      default: 'Manual'
    },
    engine: {
      type: Number,
      default: 0 // engine displacement in cc
    },
    mileage: {
      type: Number,
      default: 0,
      min: [0, 'Mileage must be a positive number']
    },
    power: {
      type: Number,
      default: 0 // in bhp
    },
    torque: {
      type: Number,
      default: 0 // in Nm
    },
    seatingCapacity: {
      type: Number,
      default: 2
    },
    safetyRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.5
    },
    features: [{ type: String }],
    pros: [{ type: String }],
    cons: [{ type: String }],
    exteriorImages: [{ type: String }],
    interiorImages: [{ type: String }],
    detailImages: [{ type: String }],
    images: {
      thumbnail: { type: String },
      exterior: [{ type: String }],
      interior: [{ type: String }],
      detail: [{ type: String }]
    },
    model3D: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    scores: {
      fuelEfficiency: { type: Number, min: 0, max: 10, default: 5 },
      performance: { type: Number, min: 0, max: 10, default: 5 },
      comfort: { type: Number, min: 0, max: 10, default: 5 },
      safety: { type: Number, min: 0, max: 10, default: 5 },
      techAndFeatures: { type: Number, min: 0, max: 10, default: 5 },
      valueForMoney: { type: Number, min: 0, max: 10, default: 5 }
    },
    specs: {
      engineDisplacement: { type: Number, default: 0 },
      maxPower: { type: Number, default: 0 },
      maxTorque: { type: Number, default: 0 },
      mileage: { type: Number, default: 0 },
      fuelType: { type: String, default: 'Petrol' },
      transmission: { type: String, default: 'Manual' },
      seatingCapacity: { type: Number, default: 2 },
      fuelTankCapacity: { type: Number, default: 10 },
      topSpeed: { type: Number, default: 120 }
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Virtual getters for backwards-compatible property access
vehicleSchema.virtual('vehicleType').get(function () {
  return this.type;
});

vehicleSchema.virtual('modelName').get(function () {
  return this.model;
});

vehicleSchema.set('toJSON', { virtuals: true });
vehicleSchema.set('toObject', { virtuals: true });

// Compound index for fast filtering by type and price
vehicleSchema.index({ type: 1, price: 1 });

// Text index for instant keyword search on name, brand, model, and category
vehicleSchema.index({
  name: 'text',
  brand: 'text',
  model: 'text',
  category: 'text'
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
