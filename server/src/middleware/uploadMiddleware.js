const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure base uploads directory exists for fallback local storage
const uploadsDir = path.join(__dirname, '../../uploads/vehicles');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Memory Storage Configuration (Provides file buffer to Cloudinary service)
const storage = multer.memoryStorage();

// File filter (MIME types: JPEG, JPG, PNG, WEBP)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, PNG, and WEBP image files are allowed'), false);
  }
};

// 5 MB file size limit
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;
