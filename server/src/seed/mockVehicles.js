const mockVehicles = [
  // --- CARS (11 Vehicles, ₹5 Lakh to ₹60 Lakh+) ---
  {
    name: 'Maruti Suzuki Swift VXi',
    type: 'car',
    brand: 'Maruti Suzuki',
    model: 'Swift',
    variant: 'VXi',
    price: 649000, // ₹6.49 Lakh
    category: 'Hatchback',
    year: 2024,
    fuelType: 'Petrol',
    transmission: 'Manual',
    engine: 1197,
    mileage: 22.38,
    power: 82,
    torque: 112,
    seatingCapacity: 5,
    safetyRating: 3,
    rating: 4.3,
    features: ['Dual Airbags', 'ABS with EBD', '7-inch Touchscreen', 'Power Windows', 'Rear Parking Sensors'],
    pros: ['Excellent fuel efficiency', 'High resale value and widespread service network', 'Peppy engine for city driving'],
    cons: ['Average build quality', 'Basic highway safety equipment'],
    exteriorImages: [
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'
    ],
    interiorImages: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
    ],
    images: {
      thumbnail: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80',
      exterior: [
        'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'
      ],
      interior: [
        'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    model3D: '',
    description: 'The Maruti Suzuki Swift is India’s favorite hatchback offering punchy performance, unmatched mileage, and low maintenance.',
    scores: { fuelEfficiency: 9.2, performance: 7.2, comfort: 7.8, safety: 6.5, techAndFeatures: 7.5, valueForMoney: 9.5 },
    specs: { engineDisplacement: 1197, maxPower: 82, maxTorque: 112, mileage: 22.38, fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 5, fuelTankCapacity: 37, topSpeed: 165 },
    isFeatured: true
  },
  {
    name: 'Tata Nexon Creative',
    type: 'car',
    brand: 'Tata',
    model: 'Nexon',
    variant: 'Creative',
    price: 815000, // ₹8.15 Lakh
    category: 'SUV',
    year: 2024,
    fuelType: 'Petrol',
    transmission: 'Manual',
    engine: 1199,
    mileage: 17.44,
    power: 118,
    torque: 170,
    seatingCapacity: 5,
    safetyRating: 5,
    rating: 4.6,
    features: ['5-Star GNCAP Crash Rating', '10.25-inch Touchscreen', 'LED Sequential DRLs', 'Automatic Climate Control', 'ESP & Hill Hold'],
    pros: ['Top-tier 5-star safety crash rating', 'Muscular compact SUV design', 'Comfortable ride over rough roads'],
    cons: ['Service experience varies by region', 'Slight engine thrum at high RPM'],
    exteriorImages: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80'
    ],
    interiorImages: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    images: {
      thumbnail: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
      exterior: [
        'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80'
      ],
      interior: [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    model3D: '',
    description: 'Tata Nexon is a feature-packed compact SUV famous for its 5-star GNCAP safety rating and bold modern styling.',
    scores: { fuelEfficiency: 7.8, performance: 8.4, comfort: 8.5, safety: 9.8, techAndFeatures: 8.8, valueForMoney: 9.1 },
    specs: { engineDisplacement: 1199, maxPower: 118, maxTorque: 170, mileage: 17.44, fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 5, fuelTankCapacity: 44, topSpeed: 180 },
    isFeatured: true
  },
  {
    name: 'Hyundai Creta SX',
    type: 'car',
    brand: 'Hyundai',
    model: 'Creta',
    variant: 'SX',
    price: 1100000, // ₹11.00 Lakh
    category: 'SUV',
    year: 2024,
    fuelType: 'Petrol',
    transmission: 'Manual',
    engine: 1497,
    mileage: 17.4,
    power: 113,
    torque: 144,
    seatingCapacity: 5,
    safetyRating: 4,
    rating: 4.7,
    features: ['Panoramic Sunroof', 'Dual 10.25-inch Screens', 'Bose 8-Speaker Audio', 'Level 2 ADAS', 'Ventilated Front Seats'],
    pros: ['Smooth engine refinement', 'Feature-loaded premium interior cabin', 'Panoramic sunroof'],
    cons: ['High demand leads to longer waiting periods'],
    exteriorImages: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    interiorImages: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ],
    images: {
      thumbnail: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
      exterior: [
        'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
      ],
      interior: [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    model3D: '',
    description: 'The Hyundai Creta sets the benchmark for mid-size SUVs in India with luxury interior technology and refined engines.',
    scores: { fuelEfficiency: 8.0, performance: 8.1, comfort: 9.0, safety: 8.5, techAndFeatures: 9.6, valueForMoney: 8.9 },
    specs: { engineDisplacement: 1497, maxPower: 113, maxTorque: 144, mileage: 17.4, fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 5, fuelTankCapacity: 50, topSpeed: 185 },
    isFeatured: true
  },
  {
    name: 'Honda City VX',
    type: 'car',
    brand: 'Honda',
    model: 'City',
    variant: 'VX',
    price: 1208000, // ₹12.08 Lakh
    category: 'Sedan',
    year: 2024,
    fuelType: 'Petrol',
    transmission: 'Manual',
    engine: 1498,
    mileage: 17.8,
    power: 119,
    torque: 145,
    seatingCapacity: 5,
    safetyRating: 5,
    rating: 4.6,
    features: ['Honda Sensing ADAS', 'Electric Sunroof', '8-inch Touchscreen with Wireless CarPlay', '6 Airbags', 'LaneWatch Camera'],
    pros: ['VTEC engine is smooth and high-revving', 'Class-leading rear seat legroom', 'Advanced safety features'],
    cons: ['Low ground clearance on large speed bumps'],
    exteriorImages: [
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
    ],
    interiorImages: [
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
    ],
    images: {
      thumbnail: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80',
      exterior: [
        'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
      ],
      interior: [
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    model3D: '',
    description: 'The iconic Honda City delivers elegant executive sedan comfort, high-revving VTEC performance, and Honda Sensing safety.',
    scores: { fuelEfficiency: 8.2, performance: 8.5, comfort: 9.2, safety: 9.3, techAndFeatures: 8.8, valueForMoney: 8.8 },
    specs: { engineDisplacement: 1498, maxPower: 119, maxTorque: 145, mileage: 17.8, fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 5, fuelTankCapacity: 40, topSpeed: 190 },
    isFeatured: false
  },
  {
    name: 'Mahindra XUV700 AX5',
    type: 'car',
    brand: 'Mahindra',
    model: 'XUV700',
    variant: 'AX5',
    price: 1399000, // ₹13.99 Lakh
    category: 'SUV',
    year: 2024,
    fuelType: 'Diesel',
    transmission: 'Manual',
    engine: 2184,
    mileage: 16.5,
    power: 182,
    torque: 420,
    seatingCapacity: 7,
    safetyRating: 5,
    rating: 4.8,
    features: ['Dual HD Super Screen Cockpit', 'Skyroof Panoramic Glass', 'mHawk Turbo Diesel Engine', 'Drive Modes (Zip, Zap, Zoom)', 'LED Headlamps'],
    pros: ['Massive 182 bhp diesel torque output', '5-star crash safety & 7-seat flexibility', 'Commanding road presence'],
    cons: ['Large dimensions make tight city parking tricky'],
    exteriorImages: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'
    ],
    interiorImages: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
    ],
    images: {
      thumbnail: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
      exterior: [
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'
      ],
      interior: [
        'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    model3D: '',
    description: 'Mahindra XUV700 dominates the 7-seater SUV segment with class-leading diesel power, futuristic tech, and 5-star safety.',
    scores: { fuelEfficiency: 7.2, performance: 9.5, comfort: 9.1, safety: 9.7, techAndFeatures: 9.3, valueForMoney: 9.2 },
    specs: { engineDisplacement: 2184, maxPower: 182, maxTorque: 420, mileage: 16.5, fuelType: 'Diesel', transmission: 'Manual', seatingCapacity: 7, fuelTankCapacity: 60, topSpeed: 200 },
    isFeatured: true
  },
  {
    name: 'Toyota Innova Crysta VX',
    type: 'car',
    brand: 'Toyota',
    model: 'Innova Crysta',
    variant: 'VX',
    price: 1999000, // ₹19.99 Lakh
    category: 'Luxury',
    year: 2024,
    fuelType: 'Diesel',
    transmission: 'Manual',
    engine: 2393,
    mileage: 15.1,
    power: 148,
    torque: 343,
    seatingCapacity: 7,
    safetyRating: 5,
    rating: 4.8,
    features: ['7 Airbags', 'Ambient Lighting', 'Captain Seats in 2nd Row', '8-inch Touchscreen', 'Vehicle Stability Control'],
    pros: ['Unrivaled reliability and bulletproof engine life', 'Plush captain seat comfort for long tours', 'High resale value'],
    cons: ['Manual heavy steering at low parking speeds'],
    exteriorImages: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80'
    ],
    interiorImages: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    images: {
      thumbnail: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      exterior: [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80'
      ],
      interior: [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    model3D: '',
    description: 'Toyota Innova Crysta remains the benchmark for premium MPVs in India with legendary durability and passenger luxury.',
    scores: { fuelEfficiency: 7.0, performance: 8.2, comfort: 9.7, safety: 9.4, techAndFeatures: 8.0, valueForMoney: 8.7 },
    specs: { engineDisplacement: 2393, maxPower: 148, maxTorque: 343, mileage: 15.1, fuelType: 'Diesel', transmission: 'Manual', seatingCapacity: 7, fuelTankCapacity: 55, topSpeed: 175 },
    isFeatured: false
  },
  {
    name: 'Hyundai Verna SX Turbo',
    type: 'car',
    brand: 'Hyundai',
    model: 'Verna',
    variant: 'SX Turbo',
    price: 1485000, // ₹14.85 Lakh
    category: 'Sedan',
    year: 2024,
    fuelType: 'Petrol',
    transmission: 'Manual',
    engine: 1482,
    mileage: 18.6,
    power: 158,
    torque: 253,
    seatingCapacity: 5,
    safetyRating: 5,
    rating: 4.6,
    features: ['160 PS Turbo GDi Engine', 'Full LED Horizon Lightbar', 'Heated & Ventilated Seats', 'Level 2 ADAS', '10.25 Infotainment'],
    pros: ['Segment-leading 158 bhp turbo acceleration', '5-star GNCAP safety rating', 'Futuristic design aesthetics'],
    cons: ['Polarizing front lightbar design'],
    exteriorImages: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
    ],
    interiorImages: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ],
    images: {
      thumbnail: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
      exterior: [
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
      ],
      interior: [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    model3D: '',
    description: 'The Hyundai Verna Turbo is a fast, futuristic sedan delivering 158 bhp power alongside a 5-star GNCAP safety score.',
    scores: { fuelEfficiency: 8.1, performance: 9.3, comfort: 8.8, safety: 9.5, techAndFeatures: 9.5, valueForMoney: 8.9 },
    specs: { engineDisplacement: 1482, maxPower: 158, maxTorque: 253, mileage: 18.6, fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 5, fuelTankCapacity: 45, topSpeed: 210 },
    isFeatured: true
  },
  {
    name: 'Tata Harrier Fearless',
    type: 'car',
    brand: 'Tata',
    model: 'Harrier',
    variant: 'Fearless',
    price: 1549000, // ₹15.49 Lakh
    category: 'SUV',
    year: 2024,
    fuelType: 'Diesel',
    transmission: 'Manual',
    engine: 1956,
    mileage: 16.8,
    power: 168,
    torque: 350,
    seatingCapacity: 5,
    safetyRating: 5,
    rating: 4.7,
    features: ['5-Star GNCAP Crash Rating', 'JBL 10-Speaker Audio System', 'Terrain Response Modes', 'Panoramic Sunroof', '360 Camera'],
    pros: ['Striking futuristic SUV stance', 'OmegaArc platform built on Land Rover pedigree', 'Plush ride quality'],
    cons: ['No petrol engine option available'],
    exteriorImages: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80'
    ],
    interiorImages: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    images: {
      thumbnail: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
      exterior: [
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80'
      ],
      interior: [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    model3D: '',
    description: 'Tata Harrier combines Land Rover D8 derived platform strength with a 5-star crash rating and aggressive street presence.',
    scores: { fuelEfficiency: 7.4, performance: 9.0, comfort: 9.2, safety: 9.8, techAndFeatures: 9.1, valueForMoney: 8.8 },
    specs: { engineDisplacement: 1956, maxPower: 168, maxTorque: 350, mileage: 16.8, fuelType: 'Diesel', transmission: 'Manual', seatingCapacity: 5, fuelTankCapacity: 50, topSpeed: 195 },
    isFeatured: false
  },
  {
    name: 'Skoda Slavia Style',
    type: 'car',
    brand: 'Skoda',
    model: 'Slavia',
    variant: 'Style',
    price: 1163000, // ₹11.63 Lakh
    category: 'Sedan',
    year: 2024,
    fuelType: 'Petrol',
    transmission: 'Manual',
    engine: 1498,
    mileage: 18.47,
    power: 148,
    torque: 250,
    seatingCapacity: 5,
    safetyRating: 5,
    rating: 4.6,
    features: ['5-Star GNCAP Crash Safety', '1.5 TSI Active Cylinder Tech', '10-inch Touchscreen', 'Electric Sunroof', '521L Boot Space'],
    pros: ['German driving dynamics and high-speed stability', '5-star GNCAP safety', 'Huge 521-liter boot'],
    cons: ['AC cooling requires high blower setting in extreme summer'],
    exteriorImages: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80'
    ],
    interiorImages: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
    ],
    images: {
      thumbnail: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
      exterior: [
        'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80'
      ],
      interior: [
        'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    model3D: '',
    description: 'Skoda Slavia brings European driving dynamics, 148 bhp TSI punch, and a 5-star GNCAP rating to sedan enthusiasts.',
    scores: { fuelEfficiency: 8.3, performance: 9.1, comfort: 8.9, safety: 9.7, techAndFeatures: 8.7, valueForMoney: 8.9 },
    specs: { engineDisplacement: 1498, maxPower: 148, maxTorque: 250, mileage: 18.47, fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 5, fuelTankCapacity: 45, topSpeed: 200 },
    isFeatured: false
  },
  {
    name: 'MG ZS EV Exclusive',
    type: 'car',
    brand: 'MG',
    model: 'ZS EV',
    variant: 'Exclusive',
    price: 1898000, // ₹18.98 Lakh
    category: 'SUV',
    year: 2024,
    fuelType: 'Electric',
    transmission: 'Single-Speed',
    engine: 0,
    mileage: 461, // km range per full charge
    power: 174,
    torque: 280,
    seatingCapacity: 5,
    safetyRating: 5,
    rating: 4.5,
    features: ['50.3 kWh Battery Pack', 'Panoramic Skyroof', 'i-SMART 75+ Connected Car Tech', 'Digital Bluetooth Key', '360 Camera'],
    pros: ['Real world 350-400 km EV range', 'Instant 280 Nm silent electric acceleration', 'Low running cost'],
    cons: ['Public charging infrastructure varies on highways'],
    exteriorImages: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80'
    ],
    interiorImages: [
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
    ],
    images: {
      thumbnail: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
      exterior: [
        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80'
      ],
      interior: [
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    model3D: '',
    description: 'MG ZS EV is a premium electric SUV delivering silent 174 PS power, 461 km certified range, and smart connected features.',
    scores: { fuelEfficiency: 9.8, performance: 9.0, comfort: 8.7, safety: 9.4, techAndFeatures: 9.6, valueForMoney: 8.6 },
    specs: { engineDisplacement: 0, maxPower: 174, maxTorque: 280, mileage: 461, fuelType: 'Electric', transmission: 'Single-Speed', seatingCapacity: 5, fuelTankCapacity: 0, topSpeed: 175 },
    isFeatured: true
  },
  {
    name: 'BMW 3 Series Gran Limousine',
    type: 'car',
    brand: 'BMW',
    model: '3 Series',
    variant: 'Gran Limousine',
    price: 6090000, // ₹60.90 Lakh
    category: 'Luxury',
    year: 2024,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: 1998,
    mileage: 15.3,
    power: 258,
    torque: 400,
    seatingCapacity: 5,
    safetyRating: 5,
    rating: 4.9,
    features: ['Curved Dual iDrive Display', 'Panoramic Sunroof', 'Harman Kardon 16-Speaker System', 'Comfort Access', 'Laserlight Headlamps'],
    pros: ['Extended wheelbase for rear seat luxury', 'TwinPower Turbo 258 bhp performance', 'Peerless luxury ergonomics'],
    cons: ['High insurance and routine service costs'],
    exteriorImages: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
    ],
    interiorImages: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ],
    images: {
      thumbnail: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
      exterior: [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
      ],
      interior: [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    model3D: '',
    description: 'BMW 3 Series Gran Limousine offers executive rear legroom luxury combined with 258 bhp German sport sedan agility.',
    scores: { fuelEfficiency: 6.8, performance: 9.8, comfort: 9.8, safety: 9.8, techAndFeatures: 9.8, valueForMoney: 7.9 },
    specs: { engineDisplacement: 1998, maxPower: 258, maxTorque: 400, mileage: 15.3, fuelType: 'Petrol', transmission: 'Automatic', seatingCapacity: 5, fuelTankCapacity: 59, topSpeed: 250 },
    isFeatured: true
  },

  // --- BIKES (10 Vehicles, ₹1 Lakh to ₹5 Lakh+) ---
  {
    name: 'TVS Apache RTR 160 4V',
    type: 'bike',
    brand: 'TVS',
    model: 'Apache RTR 160',
    variant: '4V Special Edition',
    price: 124000, // ₹1.24 Lakh
    category: 'Commuter',
    year: 2024,
    fuelType: 'Petrol',
    transmission: 'Manual',
    engine: 159.7,
    mileage: 45.0,
    power: 17.5,
    torque: 14.73,
    seatingCapacity: 2,
    safetyRating: 4,
    rating: 4.5,
    features: ['SmartXonnect Bluetooth Console', '3 Ride Modes (Urban, Rain, Sport)', 'Showo Suspension', 'Dual Channel ABS', 'LED Headlamp'],
    pros: ['Best-in-class power output for 160cc', 'Feature loaded digital instrument cluster', 'Refined engine'],
    cons: ['Slightly firm rear suspension setup'],
    exteriorImages: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
    ],
    interiorImages: [],
    images: {
      thumbnail: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
      exterior: [
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
      ],
      interior: []
    },
    model3D: '',
    description: 'TVS Apache RTR 160 4V is a high-performance 160cc streetbike equipped with ride modes and SmartXonnect telemetry.',
    scores: { fuelEfficiency: 8.8, performance: 8.2, comfort: 8.0, safety: 8.2, techAndFeatures: 8.6, valueForMoney: 9.4 },
    specs: { engineDisplacement: 159.7, maxPower: 17.5, maxTorque: 14.73, mileage: 45.0, fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 2, fuelTankCapacity: 12, topSpeed: 114 },
    isFeatured: true
  },
  {
    name: 'Yamaha MT-15 V2',
    type: 'bike',
    brand: 'Yamaha',
    model: 'MT-15',
    variant: 'V2 Deluxe',
    price: 168000, // ₹1.68 Lakh
    category: 'Sports Bike',
    year: 2024,
    fuelType: 'Petrol',
    transmission: 'Manual',
    engine: 155,
    mileage: 48.0,
    power: 18.4,
    torque: 14.1,
    seatingCapacity: 2,
    safetyRating: 4,
    rating: 4.6,
    features: ['VVA (Variable Valve Actuation)', 'Traction Control System', 'USD Front Forks', 'Dual Channel ABS', 'Y-Connect App'],
    pros: ['Torquey 155cc liquid-cooled VVA engine', 'Extremely nimble streetfighter handling', 'Aggressive dark warrior design'],
    cons: ['Compact pillion seat space'],
    exteriorImages: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
    ],
    interiorImages: [],
    images: {
      thumbnail: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
      exterior: [
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
      ],
      interior: []
    },
    model3D: '',
    description: 'Yamaha MT-15 V2 brings R15 derived VVA tech and USD forks to an ultra-agile naked street motorcycle.',
    scores: { fuelEfficiency: 9.1, performance: 8.7, comfort: 7.8, safety: 8.5, techAndFeatures: 8.9, valueForMoney: 9.2 },
    specs: { engineDisplacement: 155, maxPower: 18.4, maxTorque: 14.1, mileage: 48.0, fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 2, fuelTankCapacity: 10, topSpeed: 130 },
    isFeatured: true
  },
  {
    name: 'Royal Enfield Classic 350',
    type: 'bike',
    brand: 'Royal Enfield',
    model: 'Classic 350',
    variant: 'Dark Series',
    price: 193000, // ₹1.93 Lakh
    category: 'Cruiser',
    year: 2024,
    fuelType: 'Petrol',
    transmission: 'Manual',
    engine: 349,
    mileage: 36.2,
    power: 20.2,
    torque: 27,
    seatingCapacity: 2,
    safetyRating: 4,
    rating: 4.7,
    features: ['Smooth J-Series Engine', 'Dual Channel ABS', 'LCD Info Cluster', 'Tripper Navigation Pod', 'Classic Teardrop Tank'],
    pros: ['Vibration-free smooth J-series counterbalanced engine', 'Iconic thump sound and vintage styling', 'Plush seating comfort'],
    cons: ['Heavier curb weight when maneuvering in tight spots'],
    exteriorImages: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
    ],
    interiorImages: [],
    images: {
      thumbnail: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
      exterior: [
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
      ],
      interior: []
    },
    model3D: '',
    description: 'The Royal Enfield Classic 350 is an iconic roadster featuring a refined 349cc engine, timeless heritage aesthetic, and unmatched cruising charisma.',
    scores: { fuelEfficiency: 8.5, performance: 7.2, comfort: 9.4, safety: 8.3, techAndFeatures: 7.9, valueForMoney: 9.3 },
    specs: { engineDisplacement: 349, maxPower: 20.2, maxTorque: 27, mileage: 36.2, fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 2, fuelTankCapacity: 13, topSpeed: 115 },
    isFeatured: true
  },
  {
    name: 'KTM Duke 250',
    type: 'bike',
    brand: 'KTM',
    model: 'Duke 250',
    variant: 'Standard',
    price: 239000, // ₹2.39 Lakh
    category: 'Sports Bike',
    year: 2024,
    fuelType: 'Petrol',
    transmission: 'Manual',
    engine: 249,
    mileage: 30.0,
    power: 31,
    torque: 25,
    seatingCapacity: 2,
    safetyRating: 4,
    rating: 4.6,
    features: ['31 PS DOHC Engine', 'Supermoto ABS Mode', 'WP Apex USD Suspension', '5-inch LCD Console', 'Assist & Slipper Clutch'],
    pros: ['Sharp 31 PS power output for high-speed thrills', 'WP Apex precision handling frame', 'Supermoto ABS mode'],
    cons: ['Firm sport seat cushion'],
    exteriorImages: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
    ],
    interiorImages: [],
    images: {
      thumbnail: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
      exterior: [
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
      ],
      interior: []
    },
    model3D: '',
    description: 'KTM Duke 250 delivers aggressive streetfighter performance with 31 PS DOHC power and WP Apex race-spec chassis tuning.',
    scores: { fuelEfficiency: 7.6, performance: 9.2, comfort: 8.0, safety: 8.7, techAndFeatures: 8.8, valueForMoney: 8.9 },
    specs: { engineDisplacement: 249, maxPower: 31, maxTorque: 25, mileage: 30.0, fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 2, fuelTankCapacity: 15, topSpeed: 148 },
    isFeatured: false
  },
  {
    name: "Honda H'ness CB350",
    type: 'bike',
    brand: 'Honda',
    model: 'CB350',
    variant: "H'ness DLX Pro",
    price: 210000, // ₹2.10 Lakh
    category: 'Cruiser',
    year: 2024,
    fuelType: 'Petrol',
    transmission: 'Manual',
    engine: 348.36,
    mileage: 35.0,
    power: 21,
    torque: 30,
    seatingCapacity: 2,
    safetyRating: 4,
    rating: 4.7,
    features: ['HSTC (Honda Selectable Torque Control)', 'Voice Control System (HSVCS)', 'Dual Channel ABS', 'Full LED Lighting', 'Assist Slipper Clutch'],
    pros: ['Class-exclusive Traction Control (HSTC)', 'Ultra-smooth engine note and light clutch', 'Superior build finish'],
    cons: ['Tall gear ratios require downshifts on steep inclines'],
    exteriorImages: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
    ],
    interiorImages: [],
    images: {
      thumbnail: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
      exterior: [
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
      ],
      interior: []
    },
    model3D: '',
    description: "Honda H'ness CB350 offers refined modern-classic cruising with traction control safety and Honda voice control.",
    scores: { fuelEfficiency: 8.4, performance: 7.8, comfort: 9.3, safety: 9.0, techAndFeatures: 8.9, valueForMoney: 9.1 },
    specs: { engineDisplacement: 348.36, maxPower: 21, maxTorque: 30, mileage: 35.0, fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 2, fuelTankCapacity: 15, topSpeed: 125 },
    isFeatured: false
  },
  {
    name: 'Royal Enfield Himalayan 450',
    type: 'bike',
    brand: 'Royal Enfield',
    model: 'Himalayan',
    variant: 'Kamet White',
    price: 285000, // ₹2.85 Lakh
    category: 'Adventure',
    year: 2024,
    fuelType: 'Petrol',
    transmission: 'Manual',
    engine: 452,
    mileage: 30.0,
    power: 40,
    torque: 40,
    seatingCapacity: 2,
    safetyRating: 5,
    rating: 4.8,
    features: ['Sherpa 450 Liquid-Cooled Engine', '4-inch Full Map TFT Display', 'Switchable Rear ABS', 'Showa Upside Down Forks', 'Ride by Wire'],
    pros: ['40 PS liquid-cooled Sherpa engine', 'World-class adventure tourer suspension absorption', 'Google Maps integration on round TFT display'],
    cons: ['Tall seat height for shorter riders'],
    exteriorImages: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
    ],
    interiorImages: [],
    images: {
      thumbnail: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
      exterior: [
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
      ],
      interior: []
    },
    model3D: '',
    description: 'Royal Enfield Himalayan 450 is a powerhouse adventure motorcycle built with a 40 PS liquid-cooled engine and round Google Maps TFT cluster.',
    scores: { fuelEfficiency: 7.5, performance: 9.3, comfort: 9.6, safety: 9.2, techAndFeatures: 9.5, valueForMoney: 9.4 },
    specs: { engineDisplacement: 452, maxPower: 40, maxTorque: 40, mileage: 30.0, fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 2, fuelTankCapacity: 17, topSpeed: 155 },
    isFeatured: true
  },
  {
    name: 'Kawasaki Ninja 300',
    type: 'bike',
    brand: 'Kawasaki',
    model: 'Ninja 300',
    variant: 'Lime Green',
    price: 343000, // ₹3.43 Lakh
    category: 'Sports Bike',
    year: 2024,
    fuelType: 'Petrol',
    transmission: 'Manual',
    engine: 296,
    mileage: 26.0,
    power: 39,
    torque: 26.1,
    seatingCapacity: 2,
    safetyRating: 4,
    rating: 4.6,
    features: ['Parallel-Twin Liquid-Cooled Engine', 'Assist & Slipper Clutch', 'Dual Channel ABS', 'Twin Projector Headlamps', 'Heat Management Tech'],
    pros: ['Silky-smooth parallel-twin engine note', 'Forgiving sports ergonomics for daily riding', 'Iconic Ninja supersport styling'],
    cons: ['Halogen bulb lighting cluster looks traditional'],
    exteriorImages: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
    ],
    interiorImages: [],
    images: {
      thumbnail: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
      exterior: [
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
      ],
      interior: []
    },
    model3D: '',
    description: 'Kawasaki Ninja 300 remains the most accessible parallel-twin supersport bike offering 39 PS output and smooth high-RPM power.',
    scores: { fuelEfficiency: 7.2, performance: 9.1, comfort: 8.4, safety: 8.6, techAndFeatures: 7.8, valueForMoney: 8.5 },
    specs: { engineDisplacement: 296, maxPower: 39, maxTorque: 26.1, mileage: 26.0, fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 2, fuelTankCapacity: 17, topSpeed: 170 },
    isFeatured: true
  },
  {
    name: 'TVS Apache RR 310',
    type: 'bike',
    brand: 'TVS',
    model: 'Apache RR 310',
    variant: 'Race Replica',
    price: 272000, // ₹2.72 Lakh
    category: 'Sports Bike',
    year: 2024,
    fuelType: 'Petrol',
    transmission: 'Manual',
    engine: 312.2,
    mileage: 33.1,
    power: 34,
    torque: 27.3,
    seatingCapacity: 2,
    safetyRating: 4,
    rating: 4.7,
    features: ['Vertical 5-inch TFT Display', '4 Riding Modes', 'Bi-LED Twin Headlamps', 'Michelin Road 5 Tires', 'Race Telemetry'],
    pros: ['Track-honed aerodynamics developed in wind tunnels', 'Vertically stacked smart TFT screen', 'Top-tier Michelin tires'],
    cons: ['Vibrations felt at very high RPM near redline'],
    exteriorImages: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
    ],
    interiorImages: [],
    images: {
      thumbnail: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
      exterior: [
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
      ],
      interior: []
    },
    model3D: '',
    description: 'TVS Apache RR 310 is a flagship track machine built with wind-tunnel tested fairings and advanced ride mode electronics.',
    scores: { fuelEfficiency: 8.0, performance: 9.0, comfort: 8.1, safety: 8.8, techAndFeatures: 9.4, valueForMoney: 9.2 },
    specs: { engineDisplacement: 312.2, maxPower: 34, maxTorque: 27.3, mileage: 33.1, fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 2, fuelTankCapacity: 11, topSpeed: 160 },
    isFeatured: false
  },
  {
    name: 'Triumph Speed 400',
    type: 'bike',
    brand: 'Triumph',
    model: 'Speed 400',
    variant: 'Standard',
    price: 233000, // ₹2.33 Lakh
    category: 'Sports Bike',
    year: 2024,
    fuelType: 'Petrol',
    transmission: 'Manual',
    engine: 398.15,
    mileage: 29.0,
    power: 40,
    torque: 37.5,
    seatingCapacity: 2,
    safetyRating: 5,
    rating: 4.8,
    features: ['TR-Series 40 PS Engine', 'Switchable Traction Control', 'Bosch Dual Channel ABS', 'All LED Lighting', 'Upside Down USD Forks'],
    pros: ['Superb 40 PS power at an accessible price', 'Flawless Triumph fit, finish, and engineering quality', 'Switchable traction control'],
    cons: ['Compact physical presence for larger riders'],
    exteriorImages: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
    ],
    interiorImages: [],
    images: {
      thumbnail: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
      exterior: [
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
      ],
      interior: []
    },
    model3D: '',
    description: 'Triumph Speed 400 combines British roadster elegance with 40 PS punchy performance and premium componentry.',
    scores: { fuelEfficiency: 7.8, performance: 9.4, comfort: 8.8, safety: 9.1, techAndFeatures: 9.0, valueForMoney: 9.6 },
    specs: { engineDisplacement: 398.15, maxPower: 40, maxTorque: 37.5, mileage: 29.0, fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 2, fuelTankCapacity: 13, topSpeed: 160 },
    isFeatured: true
  },
  {
    name: 'BMW G 310 RR',
    type: 'bike',
    brand: 'BMW',
    model: 'G 310 RR',
    variant: 'Style Passion',
    price: 305000, // ₹3.05 Lakh
    category: 'Sports Bike',
    year: 2024,
    fuelType: 'Petrol',
    transmission: 'Manual',
    engine: 313,
    mileage: 30.3,
    power: 34,
    torque: 27,
    seatingCapacity: 2,
    safetyRating: 4,
    rating: 4.7,
    features: ['BMW Motorrad Motorsport Livery', 'Infotainment TFT Display', 'Ride by Wire Throttle', 'BMW ABS', 'USD Front Forks'],
    pros: ['Head-turning BMW Motorsport livery and branding', 'Sharp supersport aerodynamic bodywork', 'Ride-by-wire modes'],
    cons: ['Premium price tag compared to segment rivals'],
    exteriorImages: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
    ],
    interiorImages: [],
    images: {
      thumbnail: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
      exterior: [
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
      ],
      interior: []
    },
    model3D: '',
    description: 'BMW G 310 RR brings BMW Motorrad racing heritage and 34 PS performance to entry supersport riders.',
    scores: { fuelEfficiency: 7.9, performance: 9.0, comfort: 8.0, safety: 8.8, techAndFeatures: 9.1, valueForMoney: 8.4 },
    specs: { engineDisplacement: 313, maxPower: 34, maxTorque: 27, mileage: 30.3, fuelType: 'Petrol', transmission: 'Manual', seatingCapacity: 2, fuelTankCapacity: 11, topSpeed: 160 },
    isFeatured: false
  }
];

module.exports = mockVehicles;
