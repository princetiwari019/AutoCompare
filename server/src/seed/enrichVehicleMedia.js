const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectDB = require('../config/db');
const Vehicle = require('../models/Vehicle');

const carExteriorPool = [
  'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80'
];

const carInteriorPool = [
  'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
];

const bikeExteriorPool = [
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1200&q=80'
];

const bikeDetailPool = [
  'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
];

const enrichVehicles = async () => {
  await connectDB();
  const vehicles = await Vehicle.find({});
  console.log(`[Media Enrichment] Found ${vehicles.length} vehicles.`);

  let enrichedCount = 0;

  for (const vehicle of vehicles) {
    const isCar = vehicle.type === 'car';
    let updated = false;

    if (!vehicle.exteriorImages) vehicle.exteriorImages = [];
    if (!vehicle.interiorImages) vehicle.interiorImages = [];
    if (!vehicle.detailImages) vehicle.detailImages = [];

    // Ensure at least 4 exterior images
    let poolIdx = 0;
    while (vehicle.exteriorImages.length < 4) {
      const candidate = (isCar ? carExteriorPool : bikeExteriorPool)[poolIdx % 4];
      if (!vehicle.exteriorImages.includes(candidate)) {
        vehicle.exteriorImages.push(candidate);
        updated = true;
      }
      poolIdx++;
    }

    if (isCar) {
      // Ensure at least 3 interior images for cars
      let intIdx = 0;
      while (vehicle.interiorImages.length < 3) {
        const candidate = carInteriorPool[intIdx % carInteriorPool.length];
        if (!vehicle.interiorImages.includes(candidate)) {
          vehicle.interiorImages.push(candidate);
          updated = true;
        }
        intIdx++;
      }
    } else {
      // Ensure at least 3 detail images for bikes
      let detIdx = 0;
      while (vehicle.detailImages.length < 3) {
        const candidate = bikeDetailPool[detIdx % bikeDetailPool.length];
        if (!vehicle.detailImages.includes(candidate)) {
          vehicle.detailImages.push(candidate);
          updated = true;
        }
        detIdx++;
      }
    }

    if (vehicle.exteriorImages.length > 0) {
      if (!vehicle.images) vehicle.images = {};
      vehicle.images.thumbnail = vehicle.exteriorImages[0];
    }

    if (updated) {
      await vehicle.save();
      enrichedCount++;
    }
  }

  console.log(`[Media Enrichment] Updated ${enrichedCount} vehicles to satisfy media minimums.`);
  process.exit(0);
};

enrichVehicles().catch(err => {
  console.error('[Media Enrichment Error]', err);
  process.exit(1);
});
