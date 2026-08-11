const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

const redactUri = (uri) => {
  if (!uri || typeof uri !== 'string') return '[Hidden URI]';
  return uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
};

const migrateToAtlas = async () => {
  console.log('=======================================================');
  console.log('   AutoCompare Production MongoDB Atlas Seeder & Migration');
  console.log('=======================================================');

  const targetUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/autocompare';
  console.log(`[Target Database] Connecting to: ${redactUri(targetUri)}`);

  const conn = await mongoose.connect(targetUri);
  console.log(`[Target Database] Successfully connected: ${conn.connection.host}/${conn.connection.name}`);

  const backupDir = path.join(__dirname, 'backups');
  const vehiclesBackupPath = path.join(backupDir, 'vehicles_backup.json');
  const usersBackupPath = path.join(backupDir, 'users_backup.json');

  if (!fs.existsSync(vehiclesBackupPath)) {
    console.error(`[Error] Backup file not found: ${vehiclesBackupPath}. Run backupDatabase.js first.`);
    process.exit(1);
  }

  const rawVehicles = JSON.parse(fs.readFileSync(vehiclesBackupPath, 'utf-8'));
  console.log(`[Migration] Found ${rawVehicles.length} vehicles in local backup.`);

  let upsertedVehicles = 0;

  for (const doc of rawVehicles) {
    const filter = { _id: new mongoose.Types.ObjectId(doc._id) };
    const vehicleData = { ...doc };
    vehicleData._id = new mongoose.Types.ObjectId(doc._id);

    if (vehicleData.createdAt) vehicleData.createdAt = new Date(vehicleData.createdAt);
    if (vehicleData.updatedAt) vehicleData.updatedAt = new Date(vehicleData.updatedAt);

    await Vehicle.replaceOne(filter, vehicleData, { upsert: true });
    upsertedVehicles++;
  }

  console.log(`[Migration Success] Upserted ${upsertedVehicles} vehicles in target database.`);

  // Seed Admin user if available in backup or .env
  if (fs.existsSync(usersBackupPath)) {
    const rawUsers = JSON.parse(fs.readFileSync(usersBackupPath, 'utf-8'));
    let upsertedUsers = 0;
    for (const uDoc of rawUsers) {
      const uFilter = { _id: new mongoose.Types.ObjectId(uDoc._id) };
      const userData = { ...uDoc };
      userData._id = new mongoose.Types.ObjectId(uDoc._id);
      await User.replaceOne(uFilter, userData, { upsert: true });
      upsertedUsers++;
    }
    console.log(`[Migration Success] Upserted ${upsertedUsers} user documents in target database.`);
  }

  const finalCount = await Vehicle.countDocuments();
  const carsCount = await Vehicle.countDocuments({ type: 'car' });
  const bikesCount = await Vehicle.countDocuments({ type: 'bike' });

  console.log('\n=======================================================');
  console.log('   Atlas Migration Summary:');
  console.log(`   - Total Vehicles: ${finalCount}`);
  console.log(`   - Cars Count:     ${carsCount}`);
  console.log(`   - Bikes Count:    ${bikesCount}`);
  console.log('=======================================================\n');

  process.exit(0);
};

migrateToAtlas().catch((err) => {
  console.error('[Migration Error]', err.message);
  process.exit(1);
});
