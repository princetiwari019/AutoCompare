const Vehicle = require('../models/Vehicle');

// @desc    Get paginated vehicles with filtering, search & sorting
// @route   GET /api/vehicles
// @access  Public
const getVehicles = async (req, res, next) => {
  try {
    const {
      type,
      vehicleType,
      brand,
      category,
      fuelType,
      transmission,
      minPrice,
      maxPrice,
      minRating,
      search,
      sortBy,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // Support both 'type' and 'vehicleType' query parameter
    const selectedType = type || vehicleType;
    if (selectedType) {
      query.type = selectedType;
    }

    if (brand) {
      query.brand = { $in: Array.isArray(brand) ? brand : brand.split(',') };
    }
    if (category) {
      query.category = { $in: Array.isArray(category) ? category : category.split(',') };
    }
    if (fuelType) {
      query.fuelType = fuelType;
    }
    if (transmission) {
      query.transmission = transmission;
    }

    // Price range filtering (in numeric INR)
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Minimum rating filter
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // Text search query across name, brand, model
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting options
    let sort = { createdAt: -1 };
    if (sortBy === 'price_asc') sort = { price: 1 };
    else if (sortBy === 'price_desc') sort = { price: -1 };
    else if (sortBy === 'power_desc') sort = { power: -1 };
    else if (sortBy === 'mileage_desc') sort = { mileage: -1 };
    else if (sortBy === 'rating_desc') sort = { rating: -1 };
    else if (sortBy === 'year_desc') sort = { year: -1 };

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Vehicle.countDocuments(query);
    const vehicles = await Vehicle.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: vehicles.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: vehicles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Public
const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: `Vehicle not found with ID of ${req.params.id}`
      });
    }

    // Find up to 3 similar vehicles in same category and type
    const similarVehicles = await Vehicle.find({
      _id: { $ne: vehicle._id },
      type: vehicle.type,
      category: vehicle.category
    }).limit(3);

    res.status(200).json({
      success: true,
      data: vehicle,
      similar: similarVehicles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get multiple vehicles for comparison by IDs
// @route   GET /api/vehicles/compare
// @access  Public
const compareVehicles = async (req, res, next) => {
  try {
    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({
        success: false,
        message: 'Please provide vehicle IDs to compare (e.g., ?ids=id1,id2)'
      });
    }

    const idArray = ids.split(',').filter(Boolean);
    const vehicles = await Vehicle.find({ _id: { $in: idArray } });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get filter metadata (available brands, categories, price range)
// @route   GET /api/vehicles/meta/filters
// @access  Public
const getFilterMeta = async (req, res, next) => {
  try {
    const selectedType = req.query.type || req.query.vehicleType;
    const match = selectedType ? { type: selectedType } : {};

    const brands = await Vehicle.distinct('brand', match);
    const categories = await Vehicle.distinct('category', match);
    const fuelTypes = await Vehicle.distinct('fuelType', match);
    const transmissions = await Vehicle.distinct('transmission', match);

    // Get min and max price in numeric INR
    const minMaxPrice = await Vehicle.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        brands: brands.sort(),
        categories: categories.sort(),
        fuelTypes: fuelTypes.sort(),
        transmissions: transmissions.sort(),
        priceRange: minMaxPrice[0] || { minPrice: 100000, maxPrice: 6500000 }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVehicles,
  getVehicleById,
  compareVehicles,
  getFilterMeta
};
