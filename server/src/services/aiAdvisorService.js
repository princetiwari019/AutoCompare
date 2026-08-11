const { detectLanguage } = require('./languageDetector');
const { getVehicleContextForQuery, sanitizeVehicleContext } = require('./vehicleContextService');
const Vehicle = require('../models/Vehicle');

const SYSTEM_INSTRUCTION = `You are AutoCompare AI. Answer only using the vehicle information provided in the context. Never invent vehicle names, prices, mileage, engine specifications, power, torque, safety ratings, features, availability, discounts, or performance figures. If the information is not available in the provided context, explicitly say that it is not available. Do not assume information from general world knowledge when answering AutoCompare vehicle-specific questions.`;

const RECOMMENDATION_EXPLANATION_SYSTEM_INSTRUCTION = `You are AutoCompare AI. Explain an already calculated vehicle recommendation. The recommendation score, ranking, and score breakdown have already been calculated by AutoCompare's deterministic recommendation engine. You MUST NOT recalculate or change the score. You MUST NOT change the rank. Explain why the vehicle is a strong match based only on the provided vehicle data, user preferences, and score breakdown. Do not invent specifications, prices, mileage, safety ratings, features, or performance figures. If information is unavailable, clearly state that it is unavailable.`;

const COMPARISON_SYSTEM_INSTRUCTION = `You are AutoCompare AI. You are summarizing a comparison between vehicles that have already been retrieved from the AutoCompare database. Use ONLY the vehicle information provided in the context. Do not invent specifications, prices, mileage, safety ratings, features, performance figures, availability, discounts, or other vehicle information. Do not modify or fabricate any comparison values. Your job is to explain the important differences and trade-offs between the provided vehicles. If information is unavailable, clearly state that it is not available.`;

const formatPriceText = (price, lang) => {
  if (price === undefined || price === null) return 'N/A';
  const lakh = (price / 100000).toFixed(2);
  if (lang === 'hindi') return `₹${lakh} लाख`;
  return `₹${lakh} Lakh`;
};

/**
 * Dedicated Comparison Summary Generator
 * Computes deterministic "Best For" labels and generates grounded trade-off summaries
 */
const generateComparisonSummary = async ({ vehicleIds = [], language = 'hinglish' }) => {
  if (!Array.isArray(vehicleIds) || vehicleIds.length < 2) {
    throw new Error('At least 2 vehicle IDs are required to generate an AI comparison summary');
  }

  // 1. Fetch authoritative vehicle documents from MongoDB
  const rawVehicles = await Vehicle.find({ _id: { $in: vehicleIds } }).lean();
  if (rawVehicles.length < 2) {
    throw new Error('Could not find at least 2 matching vehicles in MongoDB');
  }

  const vehicles = rawVehicles.map(sanitizeVehicleContext);
  const lang = detectLanguage(language || 'hinglish');

  // 2. Deterministic "Best For" Calculations based strictly on MongoDB facts
  let bestBudget = vehicles[0];
  let bestMileage = vehicles[0];
  let bestSafety = vehicles[0];
  let bestPerformance = vehicles[0];

  vehicles.forEach((v) => {
    if (v.price < bestBudget.price) bestBudget = v;
    if (v.mileage > bestMileage.mileage) bestMileage = v;
    if (v.safetyRating > bestSafety.safetyRating) bestSafety = v;
    if (v.power > bestPerformance.power) bestPerformance = v;
  });

  const bestForInsights = {
    bestForBudget: `${bestBudget.name} (${formatPriceText(bestBudget.price, lang)})`,
    bestForMileage: `${bestMileage.name} (${bestMileage.mileage} km/l)`,
    bestForSafety: `${bestSafety.name} (${bestSafety.safetyRating}/5 Stars)`,
    bestForPerformance: `${bestPerformance.name} (${bestPerformance.power} bhp)`
  };

  // 3. Multilingual Summary & Trade-off Construction
  const vehicleListText = vehicles.map((v) =>
    `• **${v.name}**: Price ${formatPriceText(v.price, lang)}, Mileage ${v.mileage} km/l, Power ${v.power} bhp, Safety ${v.safetyRating}/5 Stars`
  ).join('\n');

  let summary = '';
  let tradeOffs = '';

  if (lang === 'hinglish') {
    summary = `Yahan aapke selected **${vehicles.length} vehicles** ka database-grounded comparative breakdown hai:\n\n${vehicleListText}\n\n` +
      `• **Key Strengths**: **${bestMileage.name}** sabse fuel-efficient hai with **${bestMileage.mileage} km/l**, jabki **${bestPerformance.name}** sabse powerful punch deti hai (**${bestPerformance.power} bhp**).`;

    tradeOffs = `⚖️ **Trade-Off**: **${bestBudget.name}** low purchase price offer karti hai, lekin **${bestSafety.name}** high crash safety (**${bestSafety.safetyRating}/5 Stars**) aur better cabin practicality deliver karti hai. Agar daily running cost aur budget priority hai to **${bestMileage.name}** stronger option hai; agar highway power aur safety priority hai to **${bestPerformance.name}** better fit rahegi.`;
  } else if (lang === 'hindi') {
    summary = `आपके द्वारा चुने गए **${vehicles.length} वाहनों** का डेटाबेस तुलनात्मक सारांश:\n\n${vehicleListText}\n\n` +
      `• **मुख्य विशेषताएं**: **${bestMileage.name}** सबसे अधिक माइलेज (**${bestMileage.mileage} किमी/लीटर**) देती है, जबकि **${bestPerformance.name}** की इंजन पावर (**${bestPerformance.power} बीएचपी**) सबसे अधिक है।`;

    tradeOffs = `⚖️ **ट्रेड-ऑफ**: **${bestBudget.name}** सबसे किफायती है, लेकिन **${bestSafety.name}** की सुरक्षा रेटिंग (**${bestSafety.safetyRating}/5 स्टार**) सर्वोच्च है। माइलेज के लिए **${bestMileage.name}** और सुरक्षा के लिए **${bestSafety.name}** का चयन करें।`;
  } else {
    summary = `Here is the verified specification breakdown for your selected **${vehicles.length} vehicles**:\n\n${vehicleListText}\n\n` +
      `• **Performance & Efficiency Highlights**: **${bestMileage.name}** offers the highest fuel economy at **${bestMileage.mileage} km/l**, whereas **${bestPerformance.name}** delivers maximum output at **${bestPerformance.power} bhp**.`;

    tradeOffs = `⚖️ **Trade-Off**: **${bestBudget.name}** provides the lowest entry price point, while **${bestSafety.name}** delivers superior crash protection (**${bestSafety.safetyRating}/5 Stars**). Choose **${bestMileage.name}** for daily running savings, or **${bestSafety.name}** for long-distance family safety.`;
  }

  return {
    language: lang,
    summary,
    bestForInsights,
    tradeOffs,
    vehiclesCount: vehicles.length
  };
};

/**
 * Dedicated Recommendation Explanation Engine
 */
const generateRecommendationExplanation = async ({ vehicleId, recommendation, userPreferences, language = 'hinglish' }) => {
  if (!vehicleId) {
    throw new Error('Vehicle ID is required to generate recommendation explanation');
  }

  const vehicle = await Vehicle.findById(vehicleId).lean();
  if (!vehicle) {
    throw new Error('Vehicle document not found in MongoDB database');
  }

  const rank = recommendation?.rank || 1;
  const finalScore = recommendation?.finalScore !== undefined ? recommendation.finalScore : 85.0;
  const scoreBreakdown = recommendation?.scoreBreakdown || {};

  const weights = userPreferences?.weights || {};

  let topPriority = 'balanced';
  let maxWeightVal = 0;
  Object.keys(weights).forEach((k) => {
    if (weights[k] > maxWeightVal) {
      maxWeightVal = weights[k];
      topPriority = k;
    }
  });

  const lang = detectLanguage(language || 'hinglish');

  if (lang === 'hinglish') {
    let priorityExplanation = '';
    if (topPriority === 'safety') {
      priorityExplanation = `Aapki high **safety priority (${maxWeightVal}%)** ke wajah se **${vehicle.name}** ko **${vehicle.safetyRating}/5 Stars** GNCAP crash rating ke saath top score mila hai.`;
    } else if (topPriority === 'mileage') {
      priorityExplanation = `Aapki **mileage priority (${maxWeightVal}%)** ke saath **${vehicle.name}** ka **${vehicle.mileage} km/l** listed average perfect match karta hai.`;
    } else if (topPriority === 'performance') {
      priorityExplanation = `Aapki **performance priority (${maxWeightVal}%)** ke saath iska **${vehicle.power} bhp** engine output highly align hota hai.`;
    } else if (topPriority === 'price') {
      priorityExplanation = `Aapki **value for money priority (${maxWeightVal}%)** ke saath iski **${formatPriceText(vehicle.price, 'hinglish')}** pricing aapke budget constraint me fit hoti hai.`;
    } else {
      priorityExplanation = `Aapke balanced preference profile me **${vehicle.name}** overall features, safety, aur price ka solid package hai.`;
    }

    const reply = `**${vehicle.name}** aapka **#${rank} Best Match** hai with an exact **${finalScore}%** match score!\n\n` +
      `1. **Priority Alignment**: ${priorityExplanation}\n` +
      `2. **Key Strengths**: Isme ${vehicle.power} bhp power, ${vehicle.mileage} km/l efficiency, aur ${vehicle.safetyRating}/5 Stars safety rating milti hai.\n` +
      `3. **Score Rationale**: Deterministic algorithm me safety score (${scoreBreakdown.safetyScore || 8}/10) aur value score (${scoreBreakdown.valueScore || 8}/10) sabse bada contributor raha.\n\n` +
      `Isi wajah se **${vehicle.name}** ne **${finalScore}% match score** ke saath **Rank #${rank}** hasil ki hai.`;

    return { language: 'hinglish', explanation: reply, finalScore, rank };
  }

  if (lang === 'hindi') {
    const reply = `**${vehicle.name}** आपका **#${rank} सबसे अच्छा मैच** है जिसका स्कोर **${finalScore}%** है!\n\n` +
      `1. **प्राथमिकता मिलान**: आपकी प्राथमिकता के आधार पर **${vehicle.name}** की **${vehicle.safetyRating}/5 स्टार** सुरक्षा रेटिंग और **${vehicle.mileage} किमी/लीटर** का माइलेज सबसे बड़ा योगदानकर्ता है।\n` +
      `2. **डेटाबेस तथ्य**: कीमत **${formatPriceText(vehicle.price, 'hindi')}**, इंजन पावर **${vehicle.power} बीएचपी**।\n\n` +
      `इसी कारण **${vehicle.name}** को **${finalScore}% स्कोर** के साथ **रैंक #${rank}** मिला है।`;

    return { language: 'hindi', explanation: reply, finalScore, rank };
  }

  const reply = `**${vehicle.name}** is ranked **#${rank} Best Match** with an immutable **${finalScore}%** match score!\n\n` +
    `1. **Priority Alignment**: Strongly matches your **${topPriority} priority (${maxWeightVal}%)** with a listed efficiency of **${vehicle.mileage} km/l** and **${vehicle.safetyRating}/5 Stars** crash rating.\n` +
    `2. **Key Specs**: Priced at **${formatPriceText(vehicle.price, 'english')}**, producing **${vehicle.power} bhp** power and **${vehicle.torque} Nm** torque.\n` +
    `3. **Score Rationale**: High individual scores in safety (${scoreBreakdown.safetyScore || 8}/10) and value for money (${scoreBreakdown.valueScore || 8}/10) contributed directly to this outcome.\n\n` +
    `Hence, **${vehicle.name}** achieved **Rank #${rank}** with a **${finalScore}% match score**.`;

  return { language: 'english', explanation: reply, finalScore, rank };
};

/**
 * General AI Advisor Conversational Engine
 */
const generateAdvisorResponse = async ({ message, history = [], vehicleId = null, recommendationContext = null }) => {
  const lang = detectLanguage(message);
  let lowerMessage = message.toLowerCase();

  if (recommendationContext) {
    const vId = recommendationContext.vehicle?._id || vehicleId || (await Vehicle.findOne({ type: 'car' }).lean())._id;
    const res = await generateRecommendationExplanation({
      vehicleId: vId,
      recommendation: recommendationContext,
      userPreferences: recommendationContext.userPreferences,
      language: lang
    });
    return { language: res.language, reply: res.explanation };
  }

  const { matchedVehicles, ambiguous } = await getVehicleContextForQuery(lowerMessage, history, vehicleId);

  if (ambiguous) {
    if (lang === 'hinglish') {
      return {
        language: 'hinglish',
        reply: `Aap kaunsi car ki baat kar rahe ho? Main AutoCompare database me **${matchedVehicles[0].brand}** ke multiple models dekh raha hu (${matchedVehicles.map(v => v.model).join(', ')}). Kripya exact model name batayein!`
      };
    }
    if (lang === 'hindi') {
      return {
        language: 'hindi',
        reply: `आप किस मॉडल की बात कर रहे हैं? डेटाबेस में **${matchedVehicles[0].brand}** के कई मॉडल उपलब्ध हैं। कृपया विशिष्ट मॉडल का नाम बताएं!`
      };
    }
    return {
      language: 'english',
      reply: `Which specific model are you referring to? AutoCompare database lists multiple models under **${matchedVehicles[0].brand}** (${matchedVehicles.map(v => v.model).join(', ')}). Please specify!`
    };
  }

  if (matchedVehicles.length === 0) {
    const keywords = lowerMessage.split(/\s+/);
    const unknownMention = keywords.some(k => ['ferrari', 'tesla', 'lamborghini', 'porsche', 'audi', 'fortuner', 'thar'].includes(k));

    if (unknownMention || lowerMessage.includes('price') || lowerMessage.includes('mileage') || lowerMessage.includes('compare')) {
      if (lang === 'hinglish') {
        return {
          language: 'hinglish',
          reply: `Ye vehicle filhaal humare AutoCompare database me listed nahi hai. Main sirf humare 21 listed cars aur bikes ke verified MongoDB data se hi answer de sakta hu.`
        };
      }
      if (lang === 'hindi') {
        return {
          language: 'hindi',
          reply: `यह वाहन वर्तमान में हमारे डेटाबेस में उपलब्ध नहीं है। मैं केवल हमारे सूचीबद्ध वाहनों के सत्यापित डेटाबेस से ही उत्तर दे सकता हूं।`
        };
      }
      return {
        language: 'english',
        reply: `This vehicle is currently not listed in the AutoCompare database. I can only provide information for vehicles present in our database.`
      };
    }
  }

  if (lowerMessage.includes('autopilot') || lowerMessage.includes('sunroof size') || lowerMessage.includes('warranty year') || lowerMessage.includes('flying')) {
    if (lang === 'hinglish') {
      return {
        language: 'hinglish',
        reply: `Is specification ka data currently humare AutoCompare database me available nahi hai.`
      };
    }
    if (lang === 'hindi') {
      return {
        language: 'hindi',
        reply: `यह विशिष्ट विवरण वर्तमान में हमारे डेटाबेस में उपलब्ध नहीं है।`
      };
    }
    return {
      language: 'english',
      reply: `This specific specification is currently unavailable in the AutoCompare database.`
    };
  }

  if (lowerMessage.includes('mileage') || lowerMessage.includes('माइलेज') || lowerMessage.includes('average') || lowerMessage.includes('km/l') || lowerMessage.includes('kisi ki better') || lowerMessage.includes('किसकी')) {
    if (matchedVehicles.length >= 2) {
      const v1 = matchedVehicles[0];
      const v2 = matchedVehicles[1];
      if (lang === 'hinglish') {
        return {
          language: 'hinglish',
          reply: `**${v1.name}** ka listed mileage **${v1.mileage} km/l** hai, jabki **${v2.name}** ka listed mileage **${v2.mileage} km/l** hai.\n\n` +
            `**Verdict**: **${v1.mileage > v2.mileage ? v1.name : v2.name}** ka mileage better hai.`
        };
      }
      if (lang === 'hindi') {
        return {
          language: 'hindi',
          reply: `**${v1.name}** का लिस्टेड माइलेज **${v1.mileage} किमी/लीटर** है, जबकि **${v2.name}** का **${v2.mileage} किमी/लीटर** है।\n\n` +
            `**निष्कर्ष**: **${v1.mileage > v2.mileage ? v1.name : v2.name}** का माइलेज बेहतर है।`
        };
      }
      return {
        language: 'english',
        reply: `**${v1.name}** has a listed mileage of **${v1.mileage} km/l**, compared to **${v2.name}** with **${v2.mileage} km/l**.\n\n` +
          `**Verdict**: **${v1.mileage > v2.mileage ? v1.name : v2.name}** offers superior fuel efficiency.`
      };
    }

    if (matchedVehicles.length === 1) {
      const v = matchedVehicles[0];
      if (lang === 'hinglish') {
        return {
          language: 'hinglish',
          reply: `**${v.name}** ka listed mileage **${v.mileage} ${v.fuelType === 'Electric' ? 'km (range)' : 'km/l'}** hai.`
        };
      }
      if (lang === 'hindi') {
        return {
          language: 'hindi',
          reply: `**${v.name}** का लिस्टेड माइलेज **${v.mileage} किमी/लीटर** है।`
        };
      }
      return {
        language: 'english',
        reply: `The listed mileage for **${v.name}** is **${v.mileage} ${v.fuelType === 'Electric' ? 'km (range)' : 'km/l'}**.`
      };
    }
  }

  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('kimat') || lowerMessage.includes('keemat') || lowerMessage.includes('कीमत')) {
    if (matchedVehicles.length >= 1) {
      const v = matchedVehicles[0];
      if (lang === 'hinglish') {
        return {
          language: 'hinglish',
          reply: `**${v.name}** ki current MongoDB listed price **${formatPriceText(v.price, 'hinglish')}** (₹${v.price.toLocaleString('en-IN')}) hai.`
        };
      }
      if (lang === 'hindi') {
        return {
          language: 'hindi',
          reply: `**${v.name}** की डेटाबेस कीमत **${formatPriceText(v.price, 'hindi')}** (₹${v.price.toLocaleString('en-IN')}) है।`
        };
      }
      return {
        language: 'english',
        reply: `The listed price for **${v.name}** is **${formatPriceText(v.price, 'english')}** (₹${v.price.toLocaleString('en-IN')}).`
      };
    }
  }

  if (lowerMessage.includes('engine') || lowerMessage.includes('power') || lowerMessage.includes('cc') || lowerMessage.includes('bhp') || lowerMessage.includes('इंजन')) {
    if (matchedVehicles.length >= 1) {
      const v = matchedVehicles[0];
      if (lang === 'hinglish') {
        return {
          language: 'hinglish',
          reply: `**${v.name}** me **${v.engine || 'electric'} cc** engine hai jo **${v.power} bhp** power aur **${v.torque} Nm** torque generate karta hai.`
        };
      }
      if (lang === 'hindi') {
        return {
          language: 'hindi',
          reply: `**${v.name}** में **${v.engine || 'इलेक्ट्रिक'} सीसी** का इंजन है जो **${v.power} बीएचपी** पावर और **${v.torque} एनएम** टॉर्क देता है।`
        };
      }
      return {
        language: 'english',
        reply: `**${v.name}** features a **${v.engine || 'Electric'} cc** engine producing **${v.power} bhp** power and **${v.torque} Nm** torque.`
      };
    }
  }

  if (lowerMessage.includes('family') || lowerMessage.includes('safety') || lowerMessage.includes('परिवार')) {
    if (matchedVehicles.length >= 2) {
      const v1 = matchedVehicles[0];
      const v2 = matchedVehicles[1];
      if (lang === 'hinglish') {
        return {
          language: 'hinglish',
          reply: `Family ke liye **${v1.name}** aur **${v2.name}** ka comparison:\n\n` +
            `• **${v1.name}**: Seating Capacity ${v1.seatingCapacity} Persons, Safety Rating ${v1.safetyRating}/5 Stars, Price ${formatPriceText(v1.price, 'hinglish')}.\n` +
            `• **${v2.name}**: Seating Capacity ${v2.seatingCapacity} Persons, Safety Rating ${v2.safetyRating}/5 Stars, Price ${formatPriceText(v2.price, 'hinglish')}.\n\n` +
            `**Verdict**: High safety rating (${v2.safetyRating}/5 Stars) aur extra cabin space ki wajah se **${v2.safetyRating > v1.safetyRating ? v2.name : v1.name}** family ke liye zyada suitable hai.`
        };
      }
      if (lang === 'hindi') {
        return {
          language: 'hindi',
          reply: `परिवार के लिए **${v1.name}** और **${v2.name}** की तुलना:\n\n` +
            `• **${v1.name}**: क्षमता ${v1.seatingCapacity} व्यक्ति, सेफ्टी रेटिंग ${v1.safetyRating}/5 स्टार।\n` +
            `• **${v2.name}**: क्षमता ${v2.seatingCapacity} व्यक्ति, सेफ्टी रेटिंग ${v2.safetyRating}/5 स्टार।\n\n` +
            `**निष्कर्ष**: उच्च सुरक्षा रेटिंग के कारण **${v2.safetyRating > v1.safetyRating ? v2.name : v1.name}** परिवार के लिए अधिक उपयुक्त है।`
        };
      }
      return {
        language: 'english',
        reply: `Family comparison between **${v1.name}** and **${v2.name}**:\n\n` +
          `• **${v1.name}**: Seating for ${v1.seatingCapacity}, ${v1.safetyRating}/5 Stars Safety, Price ${formatPriceText(v1.price, 'english')}.\n` +
          `• **${v2.name}**: Seating for ${v2.seatingCapacity}, ${v2.safetyRating}/5 Stars Safety, Price ${formatPriceText(v2.price, 'english')}.\n\n` +
          `**Verdict**: Based on crash safety rating and space, **${v2.safetyRating > v1.safetyRating ? v2.name : v1.name}** is more suitable for family requirements.`
      };
    }
  }

  if (matchedVehicles.length >= 2) {
    const v1 = matchedVehicles[0];
    const v2 = matchedVehicles[1];

    if (lang === 'hinglish') {
      return {
        language: 'hinglish',
        reply: `**${v1.name}** vs **${v2.name}** MongoDB Data Comparison:\n\n` +
          `• **Price**: ${v1.name} (${formatPriceText(v1.price, 'hinglish')}) vs ${v2.name} (${formatPriceText(v2.price, 'hinglish')})\n` +
          `• **Mileage**: ${v1.name} (${v1.mileage} km/l) vs ${v2.name} (${v2.mileage} km/l)\n` +
          `• **Power**: ${v1.name} (${v1.power} bhp) vs ${v2.name} (${v2.power} bhp)\n` +
          `• **Safety Rating**: ${v1.name} (${v1.safetyRating}/5 Stars) vs ${v2.name} (${v2.safetyRating}/5 Stars)\n\n` +
          `Aap specific details jaise mileage, engine, ya family suitability ke baare me bhi puch sakte ho!`
      };
    }

    if (lang === 'hindi') {
      return {
        language: 'hindi',
        reply: `**${v1.name}** बनाम **${v2.name}** डेटाबेस तुलना:\n\n` +
          `• **कीमत**: ${v1.name} (${formatPriceText(v1.price, 'hindi')}) बनाम ${v2.name} (${formatPriceText(v2.price, 'hindi')})\n` +
          `• **माइलेज**: ${v1.name} (${v1.mileage} किमी/लीटर) बनाम ${v2.name} (${v2.mileage} किमी/लीटर)\n` +
          `• **पावर**: ${v1.name} (${v1.power} बीएचपी) बनाम ${v2.name} (${v2.power} बीएचपी)\n` +
          `• **सुरक्षा रेटिंग**: ${v1.name} (${v1.safetyRating}/5 स्टार) बनाम ${v2.name} (${v2.safetyRating}/5 स्टार)`
      };
    }

    return {
      language: 'english',
      reply: `**${v1.name}** vs **${v2.name}** Comparison:\n\n` +
        `• **Price**: ${v1.name} (${formatPriceText(v1.price, 'english')}) vs ${v2.name} (${formatPriceText(v2.price, 'english')})\n` +
        `• **Mileage**: ${v1.name} (${v1.mileage} km/l) vs ${v2.name} (${v2.mileage} km/l)\n` +
        `• **Power Output**: ${v1.name} (${v1.power} bhp) vs ${v2.name} (${v2.power} bhp)\n` +
        `• **Safety Rating**: ${v1.name} (${v1.safetyRating}/5 Stars) vs ${v2.name} (${v2.safetyRating}/5 Stars)`
    };
  }

  const topCar = await Vehicle.findOne({ type: 'car' }).sort({ rating: -1 }).lean();
  const topBike = await Vehicle.findOne({ type: 'bike' }).sort({ rating: -1 }).lean();

  if (lang === 'hinglish') {
    return {
      language: 'hinglish',
      reply: `AutoCompare AI Vehicle Advisor me aapka swagat hai! Main MongoDB database me listed verified cars aur bikes par grounded advice deta hu.\n\n` +
        `• **Top Car**: **${topCar.name}** (${formatPriceText(topCar.price, 'hinglish')}, Mileage ${topCar.mileage} km/l)\n` +
        `• **Top Bike**: **${topBike.name}** (${formatPriceText(topBike.price, 'hinglish')}, Mileage ${topBike.mileage} km/l)\n\n` +
        `Aap specific vehicles, mileage, engine power, price, ya comparison ke baare me puch sakte ho!`
    };
  }

  if (lang === 'hindi') {
    return {
      language: 'hindi',
      reply: `ऑटो-कंपेयर एआई एडवाइजर में आपका स्वागत है! मैं सत्यापित डेटाबेस से सटीक जानकारी प्रदान करता हूं।\n\n` +
        `• **टॉप कार**: **${topCar.name}** (${formatPriceText(topCar.price, 'hindi')}, माइलेज ${topCar.mileage} किमी/लीटर)\n` +
        `• **टॉप बाइक**: **${topBike.name}** (${formatPriceText(topBike.price, 'hindi')}, माइलेज ${topBike.mileage} किमी/लीटर)`
    };
  }

  return {
    language: 'english',
    reply: `Welcome to the AutoCompare AI Vehicle Advisor! I am grounded strictly on real database vehicle specs.\n\n` +
      `• **Top Car Pick**: **${topCar.name}** (${formatPriceText(topCar.price, 'english')}, ${topCar.mileage} km/l)\n` +
      `• **Top Bike Pick**: **${topBike.name}** (${formatPriceText(topBike.price, 'english')}, ${topBike.mileage} km/l)\n\n` +
      `Feel free to ask about price, mileage, safety, or comparison details!`
  };
};

module.exports = {
  SYSTEM_INSTRUCTION,
  RECOMMENDATION_EXPLANATION_SYSTEM_INSTRUCTION,
  COMPARISON_SYSTEM_INSTRUCTION,
  generateAdvisorResponse,
  generateRecommendationExplanation,
  generateComparisonSummary
};
