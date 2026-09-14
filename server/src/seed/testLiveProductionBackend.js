const http = require('http');
const https = require('https');
const { URL } = require('url');

const targetUrl = process.argv[2] || process.env.LIVE_BACKEND_URL || 'http://localhost:5000';

const makeRequest = (urlStr, options = {}) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(urlStr);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: `${parsedUrl.pathname}${parsedUrl.search}`,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = client.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const json = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, headers: res.headers, data: json, rawBody: body });
        } catch (err) {
          resolve({ status: res.statusCode, headers: res.headers, rawBody: body });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
};

const runLiveVerification = async () => {
  console.log('=======================================================');
  console.log('   AutoCompare Live Production Backend Verification   ');
  console.log('=======================================================');
  console.log(`[Target URL] Testing live backend at: ${targetUrl}\n`);

  // Test 1: GET /api/health
  const healthRes = await makeRequest(`${targetUrl}/api/health`);
  console.log(`[Test 1] GET /api/health -> Status ${healthRes.status}`);
  console.log(`  Response:`, JSON.stringify(healthRes.data));

  if (healthRes.status !== 200 || !healthRes.data.success) {
    console.error('[FAIL] Health endpoint test failed.');
    process.exit(1);
  }

  // Test 2: GET /api/vehicles
  const vehiclesRes = await makeRequest(`${targetUrl}/api/vehicles?limit=50`);
  console.log(`\n[Test 2] GET /api/vehicles -> Status ${vehiclesRes.status}`);
  console.log(`  Total Vehicles returned: ${vehiclesRes.data.count}`);

  if (vehiclesRes.status !== 200 || vehiclesRes.data.count !== 21) {
    console.error(`[FAIL] Expected 21 vehicles, got ${vehiclesRes.data.count}`);
    process.exit(1);
  }

  // Test 3: GET /api/vehicles?type=car & type=bike
  const carsRes = await makeRequest(`${targetUrl}/api/vehicles?type=car&limit=50`);
  const bikesRes = await makeRequest(`${targetUrl}/api/vehicles?type=bike&limit=50`);

  console.log(`[Test 3] Vehicle Category Split: Cars=${carsRes.data.count} | Bikes=${bikesRes.data.count}`);

  if (carsRes.data.count !== 11 || bikesRes.data.count !== 10) {
    console.error(`[FAIL] Expected 11 cars and 10 bikes.`);
    process.exit(1);
  }

  // Test 4: POST /api/ai/chat ("Swift ka mileage kitna hai?")
  console.log('\n[Test 4] POST /api/ai/chat prompt: "Swift ka mileage kitna hai?"');
  const aiRes = await makeRequest(`${targetUrl}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { message: 'Swift ka mileage kitna hai?' }
  });

  console.log(`  AI Response (${aiRes.status}): "${aiRes.data.reply ? aiRes.data.reply.substring(0, 100) : ''}..."`);

  if (aiRes.status !== 200 || !aiRes.data.reply) {
    console.error('[FAIL] AI chat endpoint failed.');
    process.exit(1);
  }

  // Test 5: POST /api/recommendations
  console.log('\n[Test 5] POST /api/recommendations');
  const recRes = await makeRequest(`${targetUrl}/api/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      type: 'car',
      minPrice: 500000,
      maxPrice: 1500000,
      weights: { price: 30, mileage: 30, safety: 20, performance: 10, features: 10 }
    }
  });

  console.log(`  Recommendations returned (${recRes.status}): ${recRes.data.count} matches.`);
  if (recRes.status !== 200 || !recRes.data.data || recRes.data.data.length === 0) {
    console.error('[FAIL] Recommendation endpoint failed.');
    process.exit(1);
  }

  // Test 6: Unauthenticated Admin Endpoint Security Check
  console.log('\n[Test 6] GET /api/admin/vehicles (Unauthenticated Security Check)');
  const unauthRes = await makeRequest(`${targetUrl}/api/admin/vehicles`);
  console.log(`  Unauthenticated Status Code: ${unauthRes.status} (Expected: 401)`);

  if (unauthRes.status !== 401) {
    console.error('[FAIL] Unauthenticated admin endpoint did not return 401 Unauthorized.');
    process.exit(1);
  }

  console.log('\n=======================================================');
  console.log('   LIVE PRODUCTION BACKEND VERIFICATION COMPLETE!');
  console.log('=======================================================\n');
  process.exit(0);
};

runLiveVerification().catch((err) => {
  console.error('[FAIL] Live verification failed:', err.message);
  process.exit(1);
});
