const connectDB = require('../config/db');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const mockVehicles = require('./mockVehicles');
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // 1. Seed or Update Admin User from .env
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword) {
      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = User.hashPassword(adminPassword, salt);

      // Check if admin with this email exists, or if any admin exists
      let admin = await User.findOne({ email: adminEmail.toLowerCase() });
      if (!admin) {
        // If an old admin exists under a different email, update that record to the new email & password
        admin = await User.findOne({ role: 'admin' });
      }

      if (admin) {
        admin.email = adminEmail.toLowerCase();
        admin.salt = salt;
        admin.passwordHash = passwordHash;
        admin.role = 'admin';
        await admin.save();
        console.log(`[Seeder Success] Saved and updated admin credentials: ${adminEmail}`);
      } else {
        await User.create({
          name: 'System Admin',
          email: adminEmail.toLowerCase(),
          passwordHash,
          salt,
          role: 'admin'
        });
        console.log(`[Seeder Success] Created admin account: ${adminEmail}`);
      }
    } else {
      console.warn('[Seeder Warning] ADMIN_EMAIL or ADMIN_PASSWORD missing from .env.');
    }

    // 2. Seed Mock Vehicles if Collection is Empty
    const vehicleCount = await Vehicle.countDocuments({});
    if (vehicleCount === 0) {
      console.log('[Seeder] Inserting initial 21 vehicles dataset into MongoDB...');
      const inserted = await Vehicle.insertMany(mockVehicles);
      console.log(`[Seeder Success] Seeded ${inserted.length} vehicles into MongoDB database!`);
    } else {
      console.log(`[Seeder] MongoDB already contains ${vehicleCount} vehicles. Preserving existing data.`);
    }

    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error] Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
