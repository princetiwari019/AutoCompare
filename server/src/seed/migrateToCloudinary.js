const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectDB = require('../config/db');
const Vehicle = require('../models/Vehicle');
const {
  isCloudinaryConfigured,
  uploadImageBuffer
} = require('../services/cloudinaryService');

const migrateVehiclesToCloudinary = async () => {
  console.log('=======================================================');
  console.log('   AutoCompare Cloudinary Vehicle Media Migration Tool ');
  console.log('=======================================================');

  await connectDB();

  const vehicles = await Vehicle.find({});
  console.log(`Found ${vehicles.length} vehicles in database.`);

  if (!isCloudinaryConfigured()) {
    console.log('\n[Notice] Cloudinary credentials are not configured in server/.env.');
    console.log('All 21 existing vehicles and local /uploads/ URLs will remain intact and fall back to local disk storage.');
    console.log('To migrate images to Cloudinary, set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server/.env and re-run:');
    console.log('  npm run migrate:cloudinary\n');
    process.exit(0);
  }

  console.log('\n[Cloudinary Configured] Proceeding with migration of local /uploads/ images...\n');

  let totalMigratedImages = 0;
  let totalMigratedVehicles = 0;

  for (const vehicle of vehicles) {
    const vehicleId = vehicle._id.toString();
    let modified = false;

    const processCategory = async (imagesArray, categoryName) => {
      if (!Array.isArray(imagesArray)) return imagesArray;
      const updatedArray = [];

      for (const imgUrl of imagesArray) {
        if (typeof imgUrl === 'string' && (imgUrl.startsWith('/uploads/') || imgUrl.startsWith('uploads/'))) {
          const relativePath = imgUrl.startsWith('/') ? imgUrl : `/${imgUrl}`;
          const localFilePath = path.join(__dirname, '../../', relativePath);

          if (fs.existsSync(localFilePath)) {
            try {
              const buffer = fs.readFileSync(localFilePath);
              const result = await uploadImageBuffer(
                buffer,
                categoryName,
                vehicleId,
                path.basename(localFilePath)
              );

              if (result.success && result.url) {
                updatedArray.push(result.url);
                totalMigratedImages++;
                modified = true;
                console.log(`  [Migrated] ${vehicle.name} (${categoryName}): ${imgUrl} -> ${result.url}`);
              } else {
                updatedArray.push(imgUrl);
              }
            } catch (err) {
              console.error(`  [Error] Failed to migrate image ${localFilePath}:`, err.message);
              updatedArray.push(imgUrl);
            }
          } else {
            console.warn(`  [Warning] Local file not found on disk: ${localFilePath}`);
            updatedArray.push(imgUrl);
          }
        } else {
          updatedArray.push(imgUrl);
        }
      }

      return updatedArray;
    };

    vehicle.exteriorImages = await processCategory(vehicle.exteriorImages, 'exterior');
    vehicle.interiorImages = await processCategory(vehicle.interiorImages, 'interior');
    vehicle.detailImages = await processCategory(vehicle.detailImages, 'detail');

    if (vehicle.exteriorImages && vehicle.exteriorImages.length > 0) {
      if (!vehicle.images) vehicle.images = {};
      vehicle.images.thumbnail = vehicle.exteriorImages[0];
    }

    if (modified) {
      await vehicle.save();
      totalMigratedVehicles++;
    }
  }

  console.log('\n=======================================================');
  console.log(`Migration Complete:`);
  console.log(`- Total Vehicles Processed: ${vehicles.length}`);
  console.log(`- Vehicles Updated:         ${totalMigratedVehicles}`);
  console.log(`- Images Uploaded to Cloud: ${totalMigratedImages}`);
  console.log('=======================================================\n');

  process.exit(0);
};

migrateVehiclesToCloudinary().catch((error) => {
  console.error('Migration execution error:', error);
  process.exit(1);
});
