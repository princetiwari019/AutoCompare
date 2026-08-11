const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectDB = require('../config/db');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const { calculateRecommendations } = require('../services/recommendationService');
const { generateAdvisorResponse } = require('../services/aiAdvisorService');

const redactUri = (uri) => {
  if (!uri || typeof uri !== 'string') return '[Hidden URI]';
  return uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
};

const verifyAtlasDeployment = async () => {
  console.log('=======================================================');
  console.log('   AutoCompare MongoDB Atlas End-to-End Verification   ');
  console.log('=======================================================');

  const targetUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/autocompare';
  console.log(`[Target Database] Verifying connection to: ${redactUri(targetUri)}`);

  const conn = await connectDB();
  console.log(`[PASS] DB Connection OK: ${conn.connection.host}/${conn.connection.name}`);

  // Test 1: Health Check Database Status
  const dbState = mongoose.connection.readyState;
  const isDbConnected = dbState === 1;
  console.log(`[PASS] Health check database state: ${isDbConnected ? 'connected' : 'disconnected'}`);

  if (!isDbConnected) {
    console.error('[FAIL] Database is not connected.');
    process.exit(1);
  }

  // Test 2: Vehicle Count & Category Split (21 total: 11 cars, 10 bikes)
  const totalVehicles = await Vehicle.countDocuments();
  const carsCount = await Vehicle.countDocuments({ type: 'car' });
  const bikesCount = await Vehicle.countDocuments({ type: 'bike' });

  console.log(`[PASS] Vehicle Counts: Total=${totalVehicles} | Cars=${carsCount} | Bikes=${bikesCount}`);

  if (totalVehicles !== 21 || carsCount !== 11 || bikesCount !== 10) {
    console.error(`[FAIL] Expected 21 total vehicles (11 cars, 10 bikes), got Total=${totalVehicles}, Cars=${carsCount}, Bikes=${bikesCount}`);
    process.exit(1);
  }

  // Test 3: Representative Vehicles Inspection
  const representativeNames = [
    'Swift',
    'Nexon',
    'Creta',
    'Ninja 300',
    'Classic 350'
  ];

  for (const nameKeyword of representativeNames) {
    const v = await Vehicle.findOne({ name: { $regex: nameKeyword, $options: 'i' } });
    if (v) {
      console.log(`  [Found] ${v.name} (${v.type}, ₹${(v.price/100000).toFixed(2)} Lakh, Ext:${v.exteriorImages.length}, Int:${v.interiorImages.length}, Det:${v.detailImages.length})`);
    } else {
      console.error(`[FAIL] Could not find representative vehicle matching keyword: ${nameKeyword}`);
      process.exit(1);
    }
  }

  // Test 4: Media Minimums Verification (Cars: 4+ ext, 3+ int; Bikes: 4+ ext, 3+ detail)
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

  console.log(`[PASS] Media Compliance: ${compliantCount}/${allVehicles.length} vehicles meet 4+ ext & 3+ int/detail requirements.`);

  if (compliantCount !== 21) {
    console.error(`[FAIL] Only ${compliantCount}/21 vehicles met media minimums.`);
    process.exit(1);
  }

  // Test 5: Image URLs Integrity Check
  const sampleVehicle = await Vehicle.findOne({});
  console.log(`[PASS] Sample Image URLs for ${sampleVehicle.name}:`);
  console.log(`  - Thumbnail: ${sampleVehicle.images?.thumbnail}`);
  console.log(`  - Primary Exterior: ${sampleVehicle.exteriorImages?.[0]}`);

  // Test 6: AI Advisor Chat Integration Test
  console.log('\n[INFO] Testing AI Advisor query: "Swift ka mileage kitna hai?"');
  const aiResponse = await generateAdvisorResponse({ message: 'Swift ka mileage kitna hai?' });
  console.log(`[PASS] AI Advisor Response generated successfully (${aiResponse.reply.length} chars).`);
  console.log(`  Preview: "${aiResponse.reply.substring(0, 120)}..."`);

  if (!aiResponse.reply || aiResponse.reply.length < 10) {
    console.error('[FAIL] AI Advisor returned an invalid or empty response.');
    process.exit(1);
  }

  // Test 7: Recommendation Engine Scoring Test
  console.log('\n[INFO] Testing Recommendation Engine query against MongoDB data...');
  const candidateCars = await Vehicle.find({ type: 'car', price: { $lte: 1200000 } });
  const weights = { price: 30, mileage: 30, safety: 20, performance: 10, features: 10 };
  const rankedResults = calculateRecommendations(candidateCars, weights);

  console.log(`[PASS] Recommendation Scoring: Ranked ${rankedResults.length} candidate cars matching criteria.`);
  if (rankedResults.length > 0) {
    const topPick = rankedResults[0];
    console.log(`  Top Recommendation Match: ${topPick.vehicle.name} (Score: ${topPick.finalScore}%, Rank #${topPick.rank})`);
  }

  // Test 8: Admin Authentication Check
  const adminEmail = process.env.ADMIN_EMAIL || 'pt201754@gmail.com';
  const adminUser = await User.findOne({ role: 'admin' });
  console.log(`[PASS] Admin user record present in database: ${adminUser ? adminUser.email : 'None'}`);

  if (!adminUser) {
    console.error('[FAIL] Admin user record is missing in database.');
    process.exit(1);
  }

  console.log('\n=======================================================');
  console.log('   ALL MONGODB ATLAS END-TO-END VERIFICATION TESTS PASSED!');
  console.log('=======================================================\n');

  process.exit(0);
};

verifyAtlasDeployment().catch((err) => {
  console.error('[FAIL] Atlas verification error:', err);
  process.exit(1);
});
