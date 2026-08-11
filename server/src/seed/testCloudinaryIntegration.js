const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const express = require('express');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectDB = require('../config/db');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const {
  isCloudinaryConfigured,
  uploadImageBuffer,
  deleteCloudinaryImage,
  getPublicIdFromUrl
} = require('../services/cloudinaryService');

const runIntegrationTests = async () => {
  console.log('=======================================================');
  console.log('   AutoCompare Cloudinary Integration & Media Tests    ');
  console.log('=======================================================');

  // Test 1: DB Connection & Vehicle Count
  await connectDB();
  const count = await Vehicle.countDocuments();
  console.log(`[PASS] DB Connection OK. Found ${count} vehicles in MongoDB.`);

  if (count < 21) {
    console.error(`[FAIL] Expected at least 21 vehicles, found ${count}`);
    process.exit(1);
  }

  // Test 2: Cloudinary Configuration & Production Mode Enforcement Check
  const configured = isCloudinaryConfigured();
  console.log(`[PASS] Cloudinary Configuration Check: ${configured ? 'ACTIVE (Production Mode)' : 'FALLBACK MODE (Local Disk)'}`);

  // Test Production Enforcement Error when Cloudinary keys missing
  if (!configured) {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      await uploadImageBuffer(Buffer.from('test'), 'exterior', 'test_id', 'test.png');
      console.error('[FAIL] Production mode did not throw error when Cloudinary keys are missing.');
      process.exit(1);
    } catch (err) {
      console.log(`[PASS] Production mode Cloudinary enforcement verified: "${err.message}"`);
    } finally {
      process.env.NODE_ENV = originalNodeEnv;
    }
  }

  // Test 3: Test Uploading an Image Buffer
  const sampleVehicle = await Vehicle.findOne({});
  if (!sampleVehicle) {
    console.error('[FAIL] No vehicle found for testing upload.');
    process.exit(1);
  }

  console.log(`[INFO] Testing image upload on vehicle: ${sampleVehicle.name} (${sampleVehicle._id})`);

  // 1x1 PNG transparent pixel buffer
  const samplePngBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );

  const uploadResult = await uploadImageBuffer(
    samplePngBuffer,
    'exterior',
    sampleVehicle._id.toString(),
    'test_image.png'
  );

  console.log('[PASS] Image buffer upload test succeeded:', uploadResult);

  if (!uploadResult.url) {
    console.error('[FAIL] Upload result did not return an image URL.');
    process.exit(1);
  }

  // Add test image to vehicle and save
  const originalExteriorCount = sampleVehicle.exteriorImages.length;
  sampleVehicle.exteriorImages.push(uploadResult.url);
  await sampleVehicle.save();

  console.log(`[PASS] Added test image to MongoDB vehicle document. New exterior count: ${sampleVehicle.exteriorImages.length}`);

  // Test 4: Delete Image
  sampleVehicle.exteriorImages = sampleVehicle.exteriorImages.filter((img) => img !== uploadResult.url);
  await sampleVehicle.save();
  await deleteCloudinaryImage(uploadResult.url);

  console.log(`[PASS] Deleted test image. Restored exterior count to: ${sampleVehicle.exteriorImages.length}`);

  if (sampleVehicle.exteriorImages.length !== originalExteriorCount) {
    console.error('[FAIL] Exterior count was not restored correctly.');
    process.exit(1);
  }

  // Test 5: Verify URL formatting helper helper logic
  const cloudinaryTestUrl = 'https://res.cloudinary.com/demo/image/upload/v12345678/autocompare/vehicles/123/exterior-456.jpg';
  const parsedPublicId = getPublicIdFromUrl(cloudinaryTestUrl);
  console.log(`[PASS] getPublicIdFromUrl test: ${cloudinaryTestUrl} -> "${parsedPublicId}"`);

  if (parsedPublicId !== 'autocompare/vehicles/123/exterior-456') {
    console.error(`[FAIL] Public ID parsing failed, expected "autocompare/vehicles/123/exterior-456", got "${parsedPublicId}"`);
    process.exit(1);
  }

  console.log('\n=======================================================');
  console.log('   ALL BACKEND MEDIA & CLOUDINARY INTEGRATION TESTS PASSED!');
  console.log('=======================================================\n');

  process.exit(0);
};

runIntegrationTests().catch((err) => {
  console.error('[FAIL] Integration test error:', err);
  process.exit(1);
});
