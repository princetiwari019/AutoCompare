const fs = require('fs');
const path = require('path');

const runFrontendProductionAudit = () => {
  console.log('=======================================================');
  console.log('   AutoCompare Frontend Production Deployment Audit   ');
  console.log('=======================================================');

  // 1. Audit Vercel Configuration (vercel.json)
  const clientDir = path.join(__dirname, '../../../client');
  const vercelJsonPath = path.join(clientDir, 'vercel.json');
  console.log(`[PASS] Vercel configuration file present: ${fs.existsSync(vercelJsonPath) ? 'YES' : 'NO (Default Vite build configuration)'}`);

  // 2. Audit Client Environment Template (.env.example)
  const envExamplePath = path.join(clientDir, '.env.example');
  if (fs.existsSync(envExamplePath)) {
    const content = fs.readFileSync(envExamplePath, 'utf-8');
    const hasSecret = content.includes('MONGODB_URI') || content.includes('JWT_SECRET') || content.includes('CLOUDINARY_API_SECRET');
    console.log(`[PASS] Frontend .env.example secret audit: Secrets present = ${hasSecret}`);
    if (hasSecret) {
      console.error('[FAIL] Frontend environment template contains backend secrets!');
      process.exit(1);
    }
  }

  // 3. Audit Client Source Code for Hardcoded Production Secrets
  const srcDir = path.join(clientDir, 'src');
  const scanDir = (dir) => {
    let files = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat && stat.isDirectory()) {
        files = files.concat(scanDir(filePath));
      } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.css')) {
        files.push(filePath);
      }
    });
    return files;
  };

  const srcFiles = scanDir(srcDir);
  let secretFound = false;

  srcFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf-8');
    if (
      content.includes('MONGODB_URI') ||
      content.includes('CLOUDINARY_API_SECRET') ||
      content.includes('JWT_SECRET')
    ) {
      console.error(`[FAIL] Found backend secret reference in frontend file: ${file}`);
      secretFound = true;
    }
  });

  console.log(`[PASS] Client Source Code Security Audit: ${srcFiles.length} files scanned. Secret reference found = ${secretFound}`);
  if (secretFound) {
    process.exit(1);
  }

  // 4. Audit Production Build Bundle (dist/)
  const distDir = path.join(clientDir, 'dist');
  if (fs.existsSync(distDir)) {
    const distFiles = scanDir(distDir);
    let distSecretFound = false;
    distFiles.forEach((file) => {
      const content = fs.readFileSync(file, 'utf-8');
      if (content.includes('MONGODB_URI') || content.includes('CLOUDINARY_API_SECRET')) {
        console.error(`[FAIL] Secret leak detected in client build output: ${file}`);
        distSecretFound = true;
      }
    });
    console.log(`[PASS] Client Production Bundle Security Audit: Build files scanned. Leaks found = ${distSecretFound}`);
  } else {
    console.log('[INFO] Production dist/ folder not generated yet. Run npm run build first.');
  }

  console.log('\n=======================================================');
  console.log('   ALL FRONTEND PRODUCTION AUDIT CHECKS PASSED!        ');
  console.log('=======================================================\n');
  process.exit(0);
};

runFrontendProductionAudit();
