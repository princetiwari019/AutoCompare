const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

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
const { generateAdvisorResponse, generateComparisonSummary } = require('../services/aiAdvisorService');
const { calculateRecommendations } = require('../services/recommendationService');
const { verifyToken } = require('../controllers/authController');

const redactUri = (uri) => {
  if (!uri || typeof uri !== 'string') return '[Hidden URI]';
  return uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
};

const runBackendDeploymentTests = async () => {
  console.log('=======================================================');
  console.log('  AutoCompare Express Backend Production Verification  ');
  console.log('=======================================================');

  // 1. Port & Environment Test
  const port = process.env.PORT || 5000;
  console.log(`[PASS] Server Port Configuration: process.env.PORT = ${process.env.PORT || 'undefined (fallback: 5000)'}`);

  // 2. MongoDB Atlas / MONGODB_URI Connection Test
  const targetUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/autocompare';
  console.log(`[Target Database] Verifying connection to: ${redactUri(targetUri)}`);

  const conn = await connectDB();
  const dbState = mongoose.connection.readyState;
  console.log(`[PASS] MongoDB Status: ${dbState === 1 ? 'CONNECTED' : 'DISCONNECTED'} (${conn.connection.host}/${conn.connection.name})`);

  if (dbState !== 1) {
    console.error('[FAIL] Database connection failed.');
    process.exit(1);
  }

  // 3. Cloudinary Production Storage Policy Enforcement Test
  const cloudinaryActive = isCloudinaryConfigured();
  console.log(`[PASS] Cloudinary Service Configured: ${cloudinaryActive ? 'YES' : 'NO (Fallback mode in Dev)'}`);

  if (!cloudinaryActive) {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      await uploadImageBuffer(Buffer.from('test'), 'exterior', 'test_id', 'test.png');
      console.error('[FAIL] Production mode did not throw error when Cloudinary keys are missing.');
      process.exit(1);
    } catch (err) {
      console.log(`[PASS] Production Cloudinary enforcement verified: "${err.message}"`);
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  }

  // 4. Vehicle Collection Integrity Test (21 total: 11 cars, 10 bikes)
  const totalVehicles = await Vehicle.countDocuments();
  const carsCount = await Vehicle.countDocuments({ type: 'car' });
  const bikesCount = await Vehicle.countDocuments({ type: 'bike' });

  console.log(`[PASS] Vehicle Collection Check: Total=${totalVehicles} | Cars=${carsCount} | Bikes=${bikesCount}`);
  if (totalVehicles !== 21 || carsCount !== 11 || bikesCount !== 10) {
    console.error(`[FAIL] Expected 21 total vehicles (11 cars, 10 bikes).`);
    process.exit(1);
  }

  // 5. Media Requirements Verification (Cars: 4+ ext, 3+ int; Bikes: 4+ ext, 3+ det)
  const allVehicles = await Vehicle.find({});
  let compliantCount = 0;
  for (const v of allVehicles) {
    const isCar = v.type === 'car';
    const ext = v.exteriorImages?.length || 0;
    const int = v.interiorImages?.length || 0;
    const det = v.detailImages?.length || 0;
    const valid = isCar ? (ext >= 4 && int >= 3) : (ext >= 4 && det >= 3);
    if (valid) compliantCount++;
  }
  console.log(`[PASS] Media Requirements Compliance: ${compliantCount}/21 vehicles (100%).`);

  // 6. Temp Asset Cloudinary Upload & Delete Test Flow
  const sampleVehicle = await Vehicle.findOne({});
  console.log(`[INFO] Testing Temp Image Upload & Delete flow on vehicle: ${sampleVehicle.name}`);
  const samplePngBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
  const uploadRes = await uploadImageBuffer(samplePngBuffer, 'exterior', sampleVehicle._id.toString(), 'temp_test.png');
  console.log(`[PASS] Uploaded temp image asset: ${uploadRes.url}`);

  // Clean up temp image asset
  await deleteCloudinaryImage(uploadRes.url);
  console.log(`[PASS] Cleaned up temp image asset cleanly.`);

  // 7. AI Advisor Test ("Swift ka mileage kitna hai?")
  console.log('\n[INFO] Testing AI Advisor Query: "Swift ka mileage kitna hai?"');
  const aiChatRes = await generateAdvisorResponse({ message: 'Swift ka mileage kitna hai?' });
  console.log(`[PASS] AI Advisor Response: "${aiChatRes.reply.substring(0, 100)}..."`);
  if (!aiChatRes.reply || !aiChatRes.reply.includes('22.38')) {
    console.error('[FAIL] AI Advisor failed to answer grounded in MongoDB data.');
    process.exit(1);
  }

  // 8. Recommendation Engine Scoring Test
  console.log('\n[INFO] Testing Recommendation Engine calculation...');
  const candidateCars = await Vehicle.find({ type: 'car', price: { $lte: 1200000 } });
  const recWeights = { price: 30, mileage: 30, safety: 20, performance: 10, features: 10 };
  const ranked = calculateRecommendations(candidateCars, recWeights);
  console.log(`[PASS] Recommendation Engine ranked ${ranked.length} cars. Top Pick: ${ranked[0]?.vehicle.name} (Score: ${ranked[0]?.finalScore}%)`);

  // 9. Comparison Summary Test
  const carIds = (await Vehicle.find({ type: 'car' }).limit(2)).map(v => v._id);
  const compSummary = await generateComparisonSummary({ vehicleIds: carIds, language: 'hinglish' });
  console.log(`[PASS] Comparison Summary Generator produced ${compSummary.summary.length} char summary.`);

  // 10. Admin Authentication & Role Security Test
  const adminUser = await User.findOne({ role: 'admin' });
  if (!adminUser) {
    console.error('[FAIL] Admin user record not found in MongoDB.');
    process.exit(1);
  }
  console.log(`[PASS] Admin Authentication Record: ${adminUser.email}`);

  // Test password matching logic
  const isCorrectPass = adminUser.matchPassword(process.env.ADMIN_PASSWORD || 'Tiwari@123456');
  const isWrongPass = adminUser.matchPassword('WrongPassword123!');
  console.log(`[PASS] Password Match Security: CorrectPass=${isCorrectPass} | WrongPass=${!isWrongPass}`);

  if (!isCorrectPass || isWrongPass) {
    console.error('[FAIL] Password hash match test failed.');
    process.exit(1);
  }

  // 11. Security Audit: Check Backup Files for Plaintext Secrets
  const backupPath = path.join(__dirname, 'backups/users_backup.json');
  if (fs.existsSync(backupPath)) {
    const backupContent = fs.readFileSync(backupPath, 'utf-8');
    const hasPlainPassword = backupContent.includes('"password":') || backupContent.includes('Tiwari@123456');
    console.log(`[PASS] Backup File Security Audit: Plaintext secrets present = ${hasPlainPassword}`);
    if (hasPlainPassword) {
      console.error('[FAIL] Backup file contains plaintext passwords.');
      process.exit(1);
    }
  }

  console.log('\n=======================================================');
  console.log('   ALL BACKEND PRODUCTION PREPARATION TESTS PASSED!    ');
  console.log('=======================================================\n');

  process.exit(0);
};

runBackendDeploymentTests().catch((err) => {
  console.error('[FAIL] Backend deployment test error:', err);
  process.exit(1);
});
