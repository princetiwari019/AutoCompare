const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectDB = require('../config/db');

const backupLocalDatabase = async () => {
  console.log('=======================================================');
  console.log('   AutoCompare Local Database Backup Utility           ');
  console.log('=======================================================');

  await connectDB();
  const db = mongoose.connection.db;

  const backupDir = path.join(__dirname, 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // Backup vehicles collection
  const vehicles = await db.collection('vehicles').find({}).toArray();
  const vehiclesBackupPath = path.join(backupDir, 'vehicles_backup.json');
  fs.writeFileSync(vehiclesBackupPath, JSON.stringify(vehicles, null, 2));

  // Backup users collection
  const users = await db.collection('users').find({}).toArray();
  const usersBackupPath = path.join(backupDir, 'users_backup.json');
  fs.writeFileSync(usersBackupPath, JSON.stringify(users, null, 2));

  console.log(`[Backup Success] Exported ${vehicles.length} vehicle documents to: ${vehiclesBackupPath}`);
  console.log(`[Backup Success] Exported ${users.length} user documents to: ${usersBackupPath}`);
  console.log('=======================================================\n');

  process.exit(0);
};

backupLocalDatabase().catch((err) => {
  console.error('[Backup Error]', err);
  process.exit(1);
});
