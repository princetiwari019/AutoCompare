const Vehicle = require('../models/Vehicle');

/**
 * Clean & sanitize vehicle document into a structured context object
 * Omits internal Mongoose fields, image binary arrays, and raw metadata.
 */
const sanitizeVehicleContext = (v) => {
  if (!v) return null;

  return {
    id: v._id ? v._id.toString() : undefined,
    name: v.name,
    brand: v.brand,
    model: v.model,
    variant: v.variant || 'Standard',
    type: v.type,
    price: v.price,
    category: v.category,
    year: v.year || 2024,
    fuelType: v.fuelType,
    transmission: v.transmission,
    engine: v.engine || v.specs?.engineDisplacement || 0,
    mileage: v.mileage || v.specs?.mileage || 0,
    power: v.power || v.specs?.maxPower || 0,
    torque: v.torque || v.specs?.maxTorque || 0,
    seatingCapacity: v.seatingCapacity || v.specs?.seatingCapacity || 2,
    safetyRating: v.safetyRating || 0,
    rating: v.rating || 4.5,
    features: v.features || [],
    pros: v.pros || [],
    cons: v.cons || [],
    description: v.description || ''
  };
};

/**
 * Identify relevant vehicle documents from MongoDB based on query text and turn history
 */
const getVehicleContextForQuery = async (queryText, history = [], targetVehicleId = null) => {
  const allVehicles = await Vehicle.find({}).lean();
  const lowerQuery = (queryText || '').toLowerCase();

  // 1. Direct match by vehicleId if provided
  if (targetVehicleId) {
    const matchedById = allVehicles.find((v) => v._id.toString() === targetVehicleId.toString());
    if (matchedById) {
      return {
        matchedVehicles: [sanitizeVehicleContext(matchedById)],
        ambiguous: false
      };
    }
  }

  // 2. Scan query text for model, brand, or name tokens
  let matched = allVehicles.filter((v) => {
    const nameLower = v.name.toLowerCase();
    const modelLower = v.model.toLowerCase();
    const brandLower = v.brand.toLowerCase();
    return lowerQuery.includes(modelLower) || lowerQuery.includes(brandLower) || lowerQuery.includes(nameLower);
  });

  // 3. Conversational Context Fallback: Check turn history if current prompt uses implicit pronouns
  if (matched.length === 0 && history && history.length > 0) {
    const conversationTurnText = history.slice(-4).map((h) => h.content).join(' ').toLowerCase();
    matched = allVehicles.filter((v) => {
      const modelLower = v.model.toLowerCase();
      const brandLower = v.brand.toLowerCase();
      const nameLower = v.name.toLowerCase();
      return conversationTurnText.includes(modelLower) || conversationTurnText.includes(brandLower) || conversationTurnText.includes(nameLower);
    });
  }

  // 4. Disambiguation Check: Check if brand-only query matches multiple models
  let ambiguous = false;
  if (matched.length > 2) {
    const uniqueBrands = new Set(matched.map((v) => v.brand.toLowerCase()));
    if (uniqueBrands.size === 1) {
      ambiguous = true;
    }
  }

  return {
    matchedVehicles: matched.map(sanitizeVehicleContext),
    ambiguous
  };
};

module.exports = {
  sanitizeVehicleContext,
  getVehicleContextForQuery
};
