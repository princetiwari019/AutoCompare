const Vehicle = require('../models/Vehicle');
const fs = require('fs');
const path = require('path');
const {
  uploadImageBuffer,
  deleteCloudinaryImage,
  deleteVehicleMediaFolder
} = require('../services/cloudinaryService');


// @desc    Get all vehicles for admin dashboard with search & type filter
// @route   GET /api/admin/vehicles
// @access  Private (Admin)
const getAdminVehicles = async (req, res, next) => {
  try {
    const { type, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (type) {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Vehicle.countDocuments(query);
    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      total,
      data: vehicles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single vehicle by ID for admin media management
// @route   GET /api/admin/vehicles/:id
// @access  Private (Admin)
const getAdminVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new vehicle
// @route   POST /api/admin/vehicles
// @access  Private (Admin)
const createAdminVehicle = async (req, res, next) => {
  try {
    const {
      type,
      brand,
      model,
      variant,
      price,
      fuelType,
      transmission,
      engine,
      mileage,
      power,
      torque,
      seatingCapacity,
      safetyRating,
      rating,
      category,
      description,
      features,
      pros,
      cons
    } = req.body;

    // Required fields validation
    if (!type || !brand || !model || !variant || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields: type, brand, model, variant, and price'
      });
    }

    // Type validation
    if (type !== 'car' && type !== 'bike') {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "car" or "bike"'
      });
    }

    // Numeric validations
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid positive number'
      });
    }

    const name = `${brand} ${model} ${variant}`.trim();

    const vehicleData = {
      type,
      brand: brand.trim(),
      model: model.trim(),
      variant: variant.trim(),
      name,
      price: numPrice,
      fuelType: fuelType || (type === 'car' ? 'Petrol' : 'Petrol'),
      transmission: transmission || (type === 'car' ? 'Manual' : 'Manual'),
      engine: Number(engine) || 0,
      mileage: Number(mileage) || 0,
      power: Number(power) || 0,
      torque: Number(torque) || 0,
      seatingCapacity: Number(seatingCapacity) || (type === 'car' ? 5 : 2),
      safetyRating: Number(safetyRating) || 0,
      rating: Number(rating) || 4.5,
      category: category || (type === 'car' ? 'Hatchback' : 'Commuter'),
      description: description || '',
      features: Array.isArray(features) ? features : typeof features === 'string' ? features.split(',').map(s => s.trim()).filter(Boolean) : [],
      pros: Array.isArray(pros) ? pros : typeof pros === 'string' ? pros.split(',').map(s => s.trim()).filter(Boolean) : [],
      cons: Array.isArray(cons) ? cons : typeof cons === 'string' ? cons.split(',').map(s => s.trim()).filter(Boolean) : [],
      exteriorImages: [],
      interiorImages: [],
      detailImages: []
    };

    const newVehicle = await Vehicle.create(vehicleData);

    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: newVehicle
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing vehicle details (preserves media)
// @route   PUT /api/admin/vehicles/:id
// @access  Private (Admin)
const updateAdminVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Whitelisted editable fields
    const allowedFields = [
      'brand', 'model', 'variant', 'price', 'type', 'category',
      'fuelType', 'transmission', 'engine', 'mileage', 'power', 'torque',
      'seatingCapacity', 'safetyRating', 'rating', 'description',
      'features', 'pros', 'cons'
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'price' || field === 'engine' || field === 'mileage' || field === 'power' || field === 'torque' || field === 'seatingCapacity' || field === 'safetyRating' || field === 'rating') {
          const val = Number(req.body[field]);
          if (!isNaN(val)) vehicle[field] = val;
        } else if (field === 'features' || field === 'pros' || field === 'cons') {
          if (Array.isArray(req.body[field])) {
            vehicle[field] = req.body[field];
          } else if (typeof req.body[field] === 'string') {
            vehicle[field] = req.body[field].split(',').map(s => s.trim()).filter(Boolean);
          }
        } else {
          vehicle[field] = req.body[field];
        }
      }
    });

    vehicle.name = `${vehicle.brand} ${vehicle.model} ${vehicle.variant}`.trim();

    await vehicle.save();

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete vehicle document and purge uploaded media folder
// @route   DELETE /api/admin/vehicles/:id
// @access  Private (Admin)
const deleteAdminVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const vehicleId = vehicle._id.toString();

    // 1. Delete MongoDB document
    await Vehicle.findByIdAndDelete(vehicleId);

    // 2. Safely purge media assets (Cloudinary folder / local directory)
    await deleteVehicleMediaFolder(vehicleId);

    res.status(200).json({
      success: true,
      message: 'Vehicle and associated media deleted successfully',
      deletedId: vehicleId
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload vehicle image file
// @route   POST /api/admin/vehicles/:id/images
// @access  Private (Admin)
const uploadVehicleImage = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, message: 'Please attach a valid image file' });
    }

    const { category = 'exterior' } = req.body;
    const isBike = vehicle.type === 'bike';

    if (category === 'interior' && isBike) {
      return res.status(400).json({
        success: false,
        message: 'Motorcycles use detailImages instead of interiorImages'
      });
    }

    if (category === 'exterior' && vehicle.exteriorImages.length >= 8) {
      return res.status(400).json({ success: false, message: 'Maximum 8 exterior images allowed' });
    }
    if (category === 'interior' && vehicle.interiorImages.length >= 6) {
      return res.status(400).json({ success: false, message: 'Maximum 6 interior images allowed' });
    }
    if (category === 'detail' && vehicle.detailImages.length >= 6) {
      return res.status(400).json({ success: false, message: 'Maximum 6 detail images allowed' });
    }

    // Upload image buffer via Cloudinary service (or local disk fallback)
    const uploadResult = await uploadImageBuffer(
      req.file.buffer,
      category,
      vehicle._id.toString(),
      req.file.originalname
    );

    const imageUrl = uploadResult.url;

    if (category === 'exterior') {
      vehicle.exteriorImages.push(imageUrl);
    } else if (category === 'interior') {
      vehicle.interiorImages.push(imageUrl);
    } else if (category === 'detail') {
      vehicle.detailImages.push(imageUrl);
    }

    if (vehicle.exteriorImages.length > 0) {
      if (!vehicle.images) vehicle.images = {};
      vehicle.images.thumbnail = vehicle.exteriorImages[0];
    }

    await vehicle.save();

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl,
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete vehicle image by URL/path
// @route   DELETE /api/admin/vehicles/:id/images
// @access  Private (Admin)
const deleteVehicleImage = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const { category, imageUrl } = req.body;

    if (!category || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Category and imageUrl are required' });
    }

    if (category === 'exterior') {
      vehicle.exteriorImages = vehicle.exteriorImages.filter((img) => img !== imageUrl);
    } else if (category === 'interior') {
      vehicle.interiorImages = vehicle.interiorImages.filter((img) => img !== imageUrl);
    } else if (category === 'detail') {
      vehicle.detailImages = vehicle.detailImages.filter((img) => img !== imageUrl);
    }

    if (vehicle.exteriorImages.length > 0) {
      if (!vehicle.images) vehicle.images = {};
      vehicle.images.thumbnail = vehicle.exteriorImages[0];
    }

    await vehicle.save();

    // Delete asset from Cloudinary or local disk
    await deleteCloudinaryImage(imageUrl);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder vehicle images array
// @route   PUT /api/admin/vehicles/:id/images/reorder
// @access  Private (Admin)
const reorderVehicleImages = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const { category, images } = req.body;

    if (!category || !Array.isArray(images)) {
      return res.status(400).json({ success: false, message: 'Category and images array are required' });
    }

    if (category === 'exterior') {
      vehicle.exteriorImages = images;
      if (images.length > 0) {
        if (!vehicle.images) vehicle.images = {};
        vehicle.images.thumbnail = images[0];
      }
    } else if (category === 'interior') {
      vehicle.interiorImages = images;
    } else if (category === 'detail') {
      vehicle.detailImages = images;
    }

    await vehicle.save();

    res.status(200).json({
      success: true,
      message: 'Image order saved successfully',
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Validate image counts against minimum requirements
// @route   POST /api/admin/vehicles/:id/validate
// @access  Private (Admin)
const validateVehicleImages = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const isCar = vehicle.type === 'car';

    if (isCar) {
      if (vehicle.exteriorImages.length < 4 || vehicle.interiorImages.length < 3) {
        return res.status(400).json({
          success: false,
          valid: false,
          message: 'Cars require at least 4 exterior and 3 interior images.'
        });
      }
    } else {
      if (vehicle.exteriorImages.length < 4 || vehicle.detailImages.length < 3) {
        return res.status(400).json({
          success: false,
          valid: false,
          message: 'Bikes require at least 4 exterior and 3 detail images.'
        });
      }
    }

    res.status(200).json({
      success: true,
      valid: true,
      message: 'Vehicle media requirements satisfied'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminVehicles,
  getAdminVehicleById,
  createAdminVehicle,
  updateAdminVehicle,
  deleteAdminVehicle,
  uploadVehicleImage,
  deleteVehicleImage,
  reorderVehicleImages,
  validateVehicleImages
};
