/**
 * Recommendation Engine Service
 * Implements deterministic mathematical min-max normalization & weighted scoring.
 * Kept decoupled from Express controllers for high testability and clean architecture.
 */

const calculateRecommendations = (candidateVehicles, weights) => {
  if (!candidateVehicles || candidateVehicles.length === 0) {
    return [];
  }

  const {
    price: wPrice = 20,
    mileage: wMileage = 30,
    safety: wSafety = 25,
    performance: wPerf = 15,
    features: wFeatures = 10
  } = weights;

  // Extract raw attribute values for candidate set
  const rawData = candidateVehicles.map((v) => {
    const priceVal = Number(v.price) || 0;
    const mileageVal = Number(v.mileage || v.specs?.mileage || 0);
    const safetyVal = Number(v.safetyRating || (v.scores?.safety ? v.scores.safety / 2 : 0));
    const powerVal = Number(v.power || v.specs?.maxPower || 0);
    const torqueVal = Number(v.torque || v.specs?.maxTorque || 0);
    const perfComposite = powerVal + (torqueVal * 0.5);
    const featuresCount = Array.isArray(v.features) ? v.features.length : 0;

    return {
      vehicle: v,
      price: priceVal,
      mileage: mileageVal,
      safety: safetyVal,
      performance: perfComposite,
      featuresCount
    };
  });

  // Calculate Min and Max bounds for candidate vehicles
  const minPrice = Math.min(...rawData.map((d) => d.price));
  const maxPrice = Math.max(...rawData.map((d) => d.price));

  const minMileage = Math.min(...rawData.map((d) => d.mileage));
  const maxMileage = Math.max(...rawData.map((d) => d.mileage));

  const minSafety = Math.min(...rawData.map((d) => d.safety));
  const maxSafety = Math.max(...rawData.map((d) => d.safety));

  const minPerf = Math.min(...rawData.map((d) => d.performance));
  const maxPerf = Math.max(...rawData.map((d) => d.performance));

  const minFeatures = Math.min(...rawData.map((d) => d.featuresCount));
  const maxFeatures = Math.max(...rawData.map((d) => d.featuresCount));

  // Compute normalized scores (0.0 to 1.0) and component contributions (out of 100)
  const scored = rawData.map((d) => {
    // 1. Price Score (Lower is better)
    let nPrice = 1.0;
    if (maxPrice > minPrice) {
      nPrice = (maxPrice - d.price) / (maxPrice - minPrice);
    }
    const scorePrice = nPrice * wPrice;

    // 2. Mileage Score (Higher is better)
    let nMileage = 1.0;
    if (maxMileage > minMileage) {
      nMileage = (d.mileage - minMileage) / (maxMileage - minMileage);
    }
    const scoreMileage = nMileage * wMileage;

    // 3. Safety Score (Higher is better)
    let nSafety = 1.0;
    if (maxSafety > minSafety) {
      nSafety = (d.safety - minSafety) / (maxSafety - minSafety);
    } else if (maxSafety > 0) {
      nSafety = d.safety / 5.0;
    }
    const scoreSafety = nSafety * wSafety;

    // 4. Performance Score (Higher is better)
    let nPerf = 1.0;
    if (maxPerf > minPerf) {
      nPerf = (d.performance - minPerf) / (maxPerf - minPerf);
    }
    const scorePerf = nPerf * wPerf;

    // 5. Features Score (More features is better)
    let nFeatures = 1.0;
    if (maxFeatures > minFeatures) {
      nFeatures = (d.featuresCount - minFeatures) / (maxFeatures - minFeatures);
    } else if (maxFeatures > 0) {
      nFeatures = d.featuresCount / Math.max(1, maxFeatures);
    }
    const scoreFeatures = nFeatures * wFeatures;

    const rawFinalScore = scorePrice + scoreMileage + scoreSafety + scorePerf + scoreFeatures;
    const finalScore = Math.round(rawFinalScore * 10) / 10;

    const scoreBreakdown = {
      price: Math.round(scorePrice * 10) / 10,
      mileage: Math.round(scoreMileage * 10) / 10,
      safety: Math.round(scoreSafety * 10) / 10,
      performance: Math.round(scorePerf * 10) / 10,
      features: Math.round(scoreFeatures * 10) / 10
    };

    // Deterministic reason generation based on top contributing scores
    const componentRatios = [
      { key: 'price', label: 'competitive pricing value', ratio: wPrice > 0 ? scorePrice / wPrice : 0 },
      { key: 'mileage', label: 'strong mileage efficiency', ratio: wMileage > 0 ? scoreMileage / wMileage : 0 },
      { key: 'safety', label: 'high safety crash protection', ratio: wSafety > 0 ? scoreSafety / wSafety : 0 },
      { key: 'performance', label: 'high engine power output', ratio: wPerf > 0 ? scorePerf / wPerf : 0 },
      { key: 'features', label: 'rich feature equipment', ratio: wFeatures > 0 ? scoreFeatures / wFeatures : 0 }
    ].sort((a, b) => b.ratio - a.ratio);

    const top1 = componentRatios[0]?.label || 'overall balance';
    const top2 = componentRatios[1]?.label || 'budget alignment';

    const recommendationReason = `Ranked highly because it offers ${top1} and ${top2} relative to other vehicles in your selected budget.`;

    return {
      vehicle: d.vehicle,
      finalScore,
      scoreBreakdown,
      recommendationReason
    };
  });

  // Sort descending by finalScore
  scored.sort((a, b) => b.finalScore - a.finalScore);

  // Assign 1-indexed rank and take top 5 candidate matches
  return scored.slice(0, 5).map((item, index) => ({
    rank: index + 1,
    vehicle: item.vehicle,
    finalScore: item.finalScore,
    scoreBreakdown: item.scoreBreakdown,
    recommendationReason: item.recommendationReason
  }));
};

module.exports = { calculateRecommendations };
