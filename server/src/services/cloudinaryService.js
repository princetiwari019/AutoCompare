const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true
});

/**
 * Checks if Cloudinary is fully configured with required API keys
 */
const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

/**
 * Extract public_id from a Cloudinary image URL
 * e.g., https://res.cloudinary.com/demo/image/upload/v12345678/autocompare/vehicles/id/exterior-123.jpg
 * -> autocompare/vehicles/id/exterior-123
 */
const getPublicIdFromUrl = (url) => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return null;
  }
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    const pathAfterUpload = parts[1];
    // Remove version tag (v12345678/) if present
    const cleanPath = pathAfterUpload.replace(/^v\d+\//, '');
    // Strip file extension
    const lastDotIdx = cleanPath.lastIndexOf('.');
    if (lastDotIdx !== -1) {
      return cleanPath.substring(0, lastDotIdx);
    }
    return cleanPath;
  } catch (err) {
    console.error('Error parsing Cloudinary public_id from URL:', err);
    return null;
  }
};

/**
 * Upload image buffer to Cloudinary or fallback to local disk
 */
const uploadImageBuffer = async (buffer, category = 'exterior', vehicleId = 'temp', originalFilename = '') => {
  const ext = path.extname(originalFilename).toLowerCase() || '.png';
  const timestamp = Date.now();
  const randomSuffix = Math.round(Math.random() * 1e4);
  const baseFilename = `${category}-${timestamp}-${randomSuffix}`;

  if (!isCloudinaryConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Cloudinary is required for image storage in production mode. Credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are missing or invalid.'
      );
    }
  }

  if (isCloudinaryConfigured()) {
    const baseFolder = process.env.CLOUDINARY_FOLDER || 'autocompare/vehicles';
    const targetFolder = `${baseFolder}/${vehicleId}`;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: targetFolder,
          public_id: baseFilename,
          resource_type: 'image',
          overwrite: true
        },
        (error, result) => {
          if (error) {
            console.error('[Cloudinary] Upload failed:', error);
            return reject(new Error(`Cloudinary upload failed: ${error.message}`));
          }
          console.log(`[Cloudinary] Image uploaded successfully: ${result.secure_url}`);
          resolve({
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
            isCloudinary: true
          });
        }
      );

      Readable.from(buffer).pipe(uploadStream);
    });
  }

  // Fallback: Local disk storage
  const safeVehicleId = vehicleId.replace(/[^a-zA-Z0-9_-]/g, '');
  const vehicleDir = path.join(__dirname, '../../uploads/vehicles', safeVehicleId);

  if (!fs.existsSync(vehicleDir)) {
    fs.mkdirSync(vehicleDir, { recursive: true });
  }

  const filename = `${baseFilename}${ext}`;
  const fullPath = path.join(vehicleDir, filename);

  fs.writeFileSync(fullPath, buffer);

  const fileRelativePath = `/uploads/vehicles/${safeVehicleId}/${filename}`;
  console.log(`[Local Storage] Image saved to local disk: ${fileRelativePath}`);

  return {
    success: true,
    url: fileRelativePath,
    isCloudinary: false
  };
};

/**
 * Delete image asset by URL from Cloudinary or local disk
 */
const deleteCloudinaryImage = async (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') return;

  if (imageUrl.includes('cloudinary.com')) {
    const publicId = getPublicIdFromUrl(imageUrl);
    if (publicId && isCloudinaryConfigured()) {
      try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(`[Cloudinary] Destroyed image ${publicId}:`, result);
        return result;
      } catch (err) {
        console.error(`[Cloudinary] Error destroying image ${publicId}:`, err);
      }
    }
  } else if (imageUrl.startsWith('/uploads/')) {
    const localFilePath = path.join(__dirname, '../../', imageUrl);
    if (fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
        console.log(`[Local Storage] Deleted local file: ${localFilePath}`);
      } catch (err) {
        console.error('[Local Storage] Error deleting local file:', err);
      }
    }
  }
};

/**
 * Delete all media assets for a vehicle folder (Cloudinary and/or local disk)
 */
const deleteVehicleMediaFolder = async (vehicleId) => {
  const safeVehicleId = vehicleId.toString().replace(/[^a-zA-Z0-9_-]/g, '');

  if (isCloudinaryConfigured()) {
    const baseFolder = process.env.CLOUDINARY_FOLDER || 'autocompare/vehicles';
    const targetFolder = `${baseFolder}/${safeVehicleId}`;
    try {
      await cloudinary.api.delete_resources_by_prefix(targetFolder);
      await cloudinary.api.delete_folder(targetFolder);
      console.log(`[Cloudinary] Purged media folder: ${targetFolder}`);
    } catch (err) {
      console.error(`[Cloudinary] Error purging folder ${targetFolder}:`, err.message);
    }
  }

  const localDir = path.join(__dirname, '../../uploads/vehicles', safeVehicleId);
  if (fs.existsSync(localDir)) {
    try {
      fs.rmSync(localDir, { recursive: true, force: true });
      console.log(`[Local Storage] Purged local directory: ${localDir}`);
    } catch (err) {
      console.error('[Local Storage] Error purging local directory:', err);
    }
  }
};

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  getPublicIdFromUrl,
  uploadImageBuffer,
  deleteCloudinaryImage,
  deleteVehicleMediaFolder
};
