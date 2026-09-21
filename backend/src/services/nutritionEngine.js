// Verified nutritional reference values (per standard serving)
export const FOOD_DATABASE = [
  { name: 'Boiled Egg', category: 'protein', unit: 'piece', calories: 74, proteinGrams: 6.3, carbsGrams: 0.4, fatsGrams: 5.0, fiberGrams: 0, isVeg: false, isVegan: false },
  { name: 'Roti (Whole Wheat Chapati)', category: 'grain', unit: 'piece', calories: 85, proteinGrams: 3.1, carbsGrams: 16.0, fatsGrams: 0.5, fiberGrams: 2.8, isVeg: true, isVegan: true },
  { name: 'Yellow Dal (Cooked)', category: 'pulse', unit: 'bowl (150g)', calories: 145, proteinGrams: 9.0, carbsGrams: 22.0, fatsGrams: 2.5, fiberGrams: 6.0, isVeg: true, isVegan: true },
  { name: 'Paneer (Cottage Cheese)', category: 'protein', unit: 'serving (100g)', calories: 265, proteinGrams: 18.0, carbsGrams: 3.5, fatsGrams: 20.0, fiberGrams: 0, isVeg: true, isVegan: false },
  { name: 'Grilled Chicken Breast', category: 'protein', unit: 'serving (100g)', calories: 165, proteinGrams: 31.0, carbsGrams: 0, fatsGrams: 3.6, fiberGrams: 0, isVeg: false, isVegan: false },
  { name: 'Ragi Java (Finger Millet Drink)', category: 'breakfast', unit: 'glass (250ml)', calories: 120, proteinGrams: 4.2, carbsGrams: 25.0, fatsGrams: 1.2, fiberGrams: 4.5, isVeg: true, isVegan: true },
  { name: 'Steamed Rice (Cooked)', category: 'grain', unit: 'bowl (150g)', calories: 195, proteinGrams: 4.0, carbsGrams: 43.0, fatsGrams: 0.5, fiberGrams: 0.6, isVeg: true, isVegan: true },
  { name: 'Mixed Vegetable Curry', category: 'vegetable', unit: 'bowl (150g)', calories: 110, proteinGrams: 2.8, carbsGrams: 14.0, fatsGrams: 4.5, fiberGrams: 4.2, isVeg: true, isVegan: true },
  { name: 'Sprouted Moong Salad', category: 'protein', unit: 'bowl (100g)', calories: 105, proteinGrams: 7.8, carbsGrams: 18.0, fatsGrams: 0.6, fiberGrams: 5.2, isVeg: true, isVegan: true },
  { name: 'Rolled Oats Porridge', category: 'breakfast', unit: 'bowl (200g)', calories: 160, proteinGrams: 6.0, carbsGrams: 28.0, fatsGrams: 3.0, fiberGrams: 4.0, isVeg: true, isVegan: true },
  { name: 'Greek Yogurt (Plain)', category: 'dairy', unit: 'cup (150g)', calories: 130, proteinGrams: 15.0, carbsGrams: 6.0, fatsGrams: 4.0, fiberGrams: 0, isVeg: true, isVegan: false },
  { name: 'Tofu (Firm)', category: 'protein', unit: 'serving (100g)', calories: 144, proteinGrams: 17.0, carbsGrams: 3.0, fatsGrams: 8.5, fiberGrams: 2.0, isVeg: true, isVegan: true },
  { name: 'Mixed Fruit Bowl (Papaya, Apple, Pomegranate)', category: 'fruit', unit: 'bowl (150g)', calories: 95, proteinGrams: 1.2, carbsGrams: 24.0, fatsGrams: 0.3, fiberGrams: 3.8, isVeg: true, isVegan: true },
  { name: 'Idli with Sambar', category: 'breakfast', unit: '2 idlis + sambar', calories: 210, proteinGrams: 7.0, carbsGrams: 42.0, fatsGrams: 1.5, fiberGrams: 4.0, isVeg: true, isVegan: true },
  { name: 'Crispy Plain Dosa with Chutney', category: 'breakfast', unit: '1 dosa', calories: 170, proteinGrams: 4.0, carbsGrams: 28.0, fatsGrams: 5.0, fiberGrams: 1.5, isVeg: true, isVegan: true },
  { name: 'Almonds & Walnuts', category: 'snack', unit: 'handful (30g)', calories: 185, proteinGrams: 5.5, carbsGrams: 5.0, fatsGrams: 16.0, fiberGrams: 3.0, isVeg: true, isVegan: true },
  { name: 'Green Salad with Cucumber & Tomato', category: 'vegetable', unit: 'plate (120g)', calories: 35, proteinGrams: 1.5, carbsGrams: 7.0, fatsGrams: 0.2, fiberGrams: 2.5, isVeg: true, isVegan: true },
];

/**
 * Calculate personalized nutrition targets based on scientific formulas (Mifflin-St Jeor)
 * with lifestyle, activity multipliers, and user goals.
 */
export const calculateNutritionTargets = (profile = {}, lifestyle = {}) => {
  const age = Number(profile.age) || 28;
  const gender = profile.gender || 'Male';
  const heightCm = Number(profile.heightCm) || 170;
  const weightKg = Number(profile.weightKg) || 68;
  const goals = profile.goals || [];

  // Mifflin-St Jeor BMR
  let bmr;
  if (gender === 'Female') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }

  // Activity multiplier
  let activityMultiplier = 1.2; // Sedentary base
  const exercise = lifestyle.exerciseLevel || 'Sedentary';
  if (exercise === 'Lightly active') activityMultiplier = 1.375;
  else if (exercise === 'Moderately active') activityMultiplier = 1.55;
  else if (exercise === 'Very active') activityMultiplier = 1.725;

  // Adjust for sitting / standing ratio
  const sittingHours = Number(lifestyle.sittingDurationHours) || 8;
  if (sittingHours > 8) activityMultiplier = Math.max(1.15, activityMultiplier - 0.05);

  let targetCalories = Math.round(bmr * activityMultiplier);

  // Goal adjustments
  let proteinFactor = 1.0; // g per kg of body weight
  if (goals.includes('Improve protein intake') || goals.includes('Physical activity')) {
    proteinFactor = 1.5;
  } else if (goals.includes('Healthy weight management')) {
    targetCalories = Math.round(targetCalories * 0.9); // slight deficit
    proteinFactor = 1.4;
  }

  const targetProteinGrams = Math.round(weightKg * proteinFactor);
  const proteinCalories = targetProteinGrams * 4;

  // 25% of calories from fat
  const fatCalories = targetCalories * 0.25;
  const targetFatsGrams = Math.round(fatCalories / 9);

  // Remaining calories from carbohydrates
  const remainingCalories = Math.max(400, targetCalories - (proteinCalories + fatCalories));
  const targetCarbsGrams = Math.round(remainingCalories / 4);

  // Water: 35ml per kg of body weight
  const targetWaterMl = Math.round(weightKg * 35);

  return {
    calories: targetCalories,
    proteinGrams: targetProteinGrams,
    carbsGrams: targetCarbsGrams,
    fatsGrams: targetFatsGrams,
    fiberGrams: 30,
    waterMl: targetWaterMl,
    calciumMg: 1000,
    ironMg: gender === 'Female' ? 18 : 12,
    vitaminDMcg: 15,
    vitaminCMg: 80,
    disclaimer: 'Targets are personalized wellness estimates based on your profile and not medical prescriptions.'
  };
};

/**
 * Search and find best matching food from database
 */
export const findFoodByName = (query = '') => {
  const q = query.toLowerCase().trim();
  return FOOD_DATABASE.find(f => f.name.toLowerCase().includes(q)) || null;
};
