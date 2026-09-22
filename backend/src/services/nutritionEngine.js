// Verified nutritional reference values (per standard serving)
export const FOOD_DATABASE = [
  // 1. Snacks & Traditional Items
  { name: 'Boondi (Crispy Kara Boondi)', category: 'snack', unit: 'bowl (50g)', calories: 240, proteinGrams: 5.5, carbsGrams: 28.0, fatsGrams: 12.0, fiberGrams: 2.5, isVeg: true, isVegan: true },
  { name: 'Boondi Raita', category: 'dairy', unit: 'bowl (150g)', calories: 160, proteinGrams: 6.2, carbsGrams: 14.0, fatsGrams: 8.5, fiberGrams: 1.2, isVeg: true, isVegan: false },
  { name: 'Sweet Boondi', category: 'sweet', unit: 'serving (50g)', calories: 210, proteinGrams: 3.5, carbsGrams: 36.0, fatsGrams: 6.0, fiberGrams: 1.0, isVeg: true, isVegan: true },
  { name: 'Boondi Laddu', category: 'sweet', unit: 'piece (40g)', calories: 185, proteinGrams: 3.0, carbsGrams: 26.0, fatsGrams: 8.0, fiberGrams: 1.0, isVeg: true, isVegan: true },
  { name: 'Roasted Makhana (Fox Nuts)', category: 'snack', unit: 'bowl (30g)', calories: 105, proteinGrams: 3.2, carbsGrams: 20.0, fatsGrams: 1.5, fiberGrams: 2.5, isVeg: true, isVegan: true },
  { name: 'Samosa (Potato & Peas)', category: 'snack', unit: 'piece (80g)', calories: 220, proteinGrams: 4.5, carbsGrams: 26.0, fatsGrams: 11.0, fiberGrams: 3.0, isVeg: true, isVegan: true },
  { name: 'Medu Vada with Chutney', category: 'breakfast', unit: 'piece (60g)', calories: 175, proteinGrams: 5.5, carbsGrams: 18.0, fatsGrams: 9.5, fiberGrams: 3.5, isVeg: true, isVegan: true },
  { name: 'Poha (Flattened Rice with Peanuts)', category: 'breakfast', unit: 'bowl (150g)', calories: 215, proteinGrams: 5.0, carbsGrams: 38.0, fatsGrams: 5.5, fiberGrams: 3.2, isVeg: true, isVegan: true },
  { name: 'Rava Upma with Vegetables', category: 'breakfast', unit: 'bowl (150g)', calories: 205, proteinGrams: 5.2, carbsGrams: 36.0, fatsGrams: 5.0, fiberGrams: 3.0, isVeg: true, isVegan: true },
  { name: 'Dhokla (Steamed Gram Flour)', category: 'snack', unit: '2 pieces (80g)', calories: 140, proteinGrams: 6.0, carbsGrams: 22.0, fatsGrams: 3.0, fiberGrams: 2.8, isVeg: true, isVegan: true },
  { name: 'Bhel Puri', category: 'snack', unit: 'plate (120g)', calories: 190, proteinGrams: 4.8, carbsGrams: 34.0, fatsGrams: 4.5, fiberGrams: 3.5, isVeg: true, isVegan: true },

  // 2. Breakfast Specialties
  { name: 'Crispy Plain Dosa with Chutney', category: 'breakfast', unit: '1 dosa', calories: 170, proteinGrams: 4.0, carbsGrams: 28.0, fatsGrams: 5.0, fiberGrams: 1.5, isVeg: true, isVegan: true },
  { name: 'Masala Dosa with Sambar & Chutney', category: 'breakfast', unit: '1 dosa', calories: 285, proteinGrams: 6.5, carbsGrams: 44.0, fatsGrams: 9.5, fiberGrams: 3.8, isVeg: true, isVegan: true },
  { name: 'Idli with Sambar', category: 'breakfast', unit: '2 idlis + sambar', calories: 210, proteinGrams: 7.0, carbsGrams: 42.0, fatsGrams: 1.5, fiberGrams: 4.0, isVeg: true, isVegan: true },
  { name: 'Puri with Aloo Bhaji', category: 'breakfast', unit: '2 puris + bhaji', calories: 340, proteinGrams: 6.2, carbsGrams: 48.0, fatsGrams: 14.5, fiberGrams: 4.5, isVeg: true, isVegan: true },
  { name: 'Aloo Paratha with Curd', category: 'breakfast', unit: '1 paratha', calories: 290, proteinGrams: 6.8, carbsGrams: 42.0, fatsGrams: 11.0, fiberGrams: 4.0, isVeg: true, isVegan: false },
  { name: 'Ragi Java (Finger Millet Drink)', category: 'breakfast', unit: 'glass (250ml)', calories: 120, proteinGrams: 4.2, carbsGrams: 25.0, fatsGrams: 1.2, fiberGrams: 4.5, isVeg: true, isVegan: true },
  { name: 'Rolled Oats Porridge', category: 'breakfast', unit: 'bowl (200g)', calories: 160, proteinGrams: 6.0, carbsGrams: 28.0, fatsGrams: 3.0, fiberGrams: 4.0, isVeg: true, isVegan: true },
  { name: 'Fresh Whole-Wheat Bread Omelette', category: 'breakfast', unit: 'plate', calories: 295, proteinGrams: 18.5, carbsGrams: 24.0, fatsGrams: 12.0, fiberGrams: 4.2, isVeg: false, isVegan: false },

  // 3. Rice & Grains
  { name: 'Steamed Rice (Cooked)', category: 'grain', unit: 'bowl (150g)', calories: 195, proteinGrams: 4.0, carbsGrams: 43.0, fatsGrams: 0.5, fiberGrams: 0.6, isVeg: true, isVegan: true },
  { name: 'Brown Rice (Cooked)', category: 'grain', unit: 'bowl (150g)', calories: 175, proteinGrams: 4.5, carbsGrams: 36.0, fatsGrams: 1.5, fiberGrams: 2.8, isVeg: true, isVegan: true },
  { name: 'Chicken Biryani', category: 'rice', unit: 'plate (250g)', calories: 480, proteinGrams: 28.0, carbsGrams: 56.0, fatsGrams: 15.5, fiberGrams: 3.5, isVeg: false, isVegan: false },
  { name: 'Vegetable Biryani / Pulao', category: 'rice', unit: 'plate (250g)', calories: 350, proteinGrams: 8.5, carbsGrams: 62.0, fatsGrams: 8.0, fiberGrams: 5.5, isVeg: true, isVegan: true },
  { name: 'Curd Rice (Dahi Chawal)', category: 'rice', unit: 'bowl (200g)', calories: 240, proteinGrams: 7.2, carbsGrams: 42.0, fatsGrams: 5.0, fiberGrams: 1.5, isVeg: true, isVegan: false },
  { name: 'Moong Dal Khichdi', category: 'rice', unit: 'bowl (200g)', calories: 230, proteinGrams: 8.5, carbsGrams: 40.0, fatsGrams: 4.2, fiberGrams: 4.8, isVeg: true, isVegan: true },

  // 4. Breads & Rotis
  { name: 'Roti (Whole Wheat Chapati)', category: 'grain', unit: 'piece', calories: 85, proteinGrams: 3.1, carbsGrams: 16.0, fatsGrams: 0.5, fiberGrams: 2.8, isVeg: true, isVegan: true },
  { name: 'Butter Naan', category: 'grain', unit: 'piece', calories: 260, proteinGrams: 7.5, carbsGrams: 42.0, fatsGrams: 7.5, fiberGrams: 2.0, isVeg: true, isVegan: false },
  { name: 'Tandoori Roti', category: 'grain', unit: 'piece', calories: 110, proteinGrams: 4.0, carbsGrams: 22.0, fatsGrams: 0.8, fiberGrams: 3.0, isVeg: true, isVegan: true },

  // 5. Dals & Legumes
  { name: 'Yellow Dal (Cooked)', category: 'pulse', unit: 'bowl (150g)', calories: 145, proteinGrams: 9.0, carbsGrams: 22.0, fatsGrams: 2.5, fiberGrams: 6.0, isVeg: true, isVegan: true },
  { name: 'Dal Makhani', category: 'pulse', unit: 'bowl (150g)', calories: 260, proteinGrams: 10.5, carbsGrams: 28.0, fatsGrams: 12.0, fiberGrams: 6.5, isVeg: true, isVegan: false },
  { name: 'Chole Masala (Chickpea Curry)', category: 'pulse', unit: 'bowl (150g)', calories: 220, proteinGrams: 10.5, carbsGrams: 32.0, fatsGrams: 6.0, fiberGrams: 7.5, isVeg: true, isVegan: true },
  { name: 'Rajma Masala (Kidney Bean Curry)', category: 'pulse', unit: 'bowl (150g)', calories: 210, proteinGrams: 11.0, carbsGrams: 30.0, fatsGrams: 5.5, fiberGrams: 8.0, isVeg: true, isVegan: true },
  { name: 'Sambar (Lentil & Vegetable Stew)', category: 'pulse', unit: 'bowl (150g)', calories: 115, proteinGrams: 5.5, carbsGrams: 18.0, fatsGrams: 2.5, fiberGrams: 4.5, isVeg: true, isVegan: true },

  // 6. Vegetables & Paneer
  { name: 'Paneer (Cottage Cheese)', category: 'protein', unit: 'serving (100g)', calories: 265, proteinGrams: 18.0, carbsGrams: 3.5, fatsGrams: 20.0, fiberGrams: 0, isVeg: true, isVegan: false },
  { name: 'Paneer Butter Masala', category: 'curry', unit: 'bowl (150g)', calories: 320, proteinGrams: 14.0, carbsGrams: 12.0, fatsGrams: 24.0, fiberGrams: 2.5, isVeg: true, isVegan: false },
  { name: 'Palak Paneer', category: 'curry', unit: 'bowl (150g)', calories: 240, proteinGrams: 13.5, carbsGrams: 8.0, fatsGrams: 17.5, fiberGrams: 4.2, isVeg: true, isVegan: false },
  { name: 'Mixed Vegetable Curry', category: 'vegetable', unit: 'bowl (150g)', calories: 110, proteinGrams: 2.8, carbsGrams: 14.0, fatsGrams: 4.5, fiberGrams: 4.2, isVeg: true, isVegan: true },
  { name: 'Aloo Gobi', category: 'vegetable', unit: 'bowl (150g)', calories: 140, proteinGrams: 3.5, carbsGrams: 20.0, fatsGrams: 5.5, fiberGrams: 4.0, isVeg: true, isVegan: true },
  { name: 'Bhindi Masala (Okra)', category: 'vegetable', unit: 'bowl (150g)', calories: 125, proteinGrams: 3.0, carbsGrams: 14.0, fatsGrams: 6.5, fiberGrams: 4.8, isVeg: true, isVegan: true },

  // 7. Non-Veg & Seafood
  { name: 'Boiled Egg', category: 'protein', unit: 'piece', calories: 74, proteinGrams: 6.3, carbsGrams: 0.4, fatsGrams: 5.0, fiberGrams: 0, isVeg: false, isVegan: false },
  { name: 'Egg Omelette (2 Eggs)', category: 'protein', unit: 'serving', calories: 185, proteinGrams: 13.0, carbsGrams: 1.5, fatsGrams: 14.0, fiberGrams: 0.5, isVeg: false, isVegan: false },
  { name: 'Grilled Chicken Breast', category: 'protein', unit: 'serving (100g)', calories: 165, proteinGrams: 31.0, carbsGrams: 0, fatsGrams: 3.6, fiberGrams: 0, isVeg: false, isVegan: false },
  { name: 'Chicken Curry', category: 'curry', unit: 'bowl (150g)', calories: 245, proteinGrams: 24.0, carbsGrams: 6.0, fatsGrams: 14.0, fiberGrams: 1.5, isVeg: false, isVegan: false },
  { name: 'Fish Curry / Pan-Fried Fish', category: 'protein', unit: 'serving (120g)', calories: 210, proteinGrams: 22.0, carbsGrams: 4.0, fatsGrams: 11.5, fiberGrams: 1.0, isVeg: false, isVegan: false },
  { name: 'Mutton Curry', category: 'curry', unit: 'bowl (150g)', calories: 310, proteinGrams: 26.0, carbsGrams: 5.0, fatsGrams: 21.0, fiberGrams: 1.0, isVeg: false, isVegan: false },

  // 8. Salads, Fruits, Dairy & Beverages
  { name: 'Sprouted Moong Salad', category: 'protein', unit: 'bowl (100g)', calories: 105, proteinGrams: 7.8, carbsGrams: 18.0, fatsGrams: 0.6, fiberGrams: 5.2, isVeg: true, isVegan: true },
  { name: 'Green Salad with Cucumber & Tomato', category: 'vegetable', unit: 'plate (120g)', calories: 35, proteinGrams: 1.5, carbsGrams: 7.0, fatsGrams: 0.2, fiberGrams: 2.5, isVeg: true, isVegan: true },
  { name: 'Mixed Fruit Bowl (Papaya, Apple, Pomegranate)', category: 'fruit', unit: 'bowl (150g)', calories: 95, proteinGrams: 1.2, carbsGrams: 24.0, fatsGrams: 0.3, fiberGrams: 3.8, isVeg: true, isVegan: true },
  { name: 'Curd (Plain Dahi)', category: 'dairy', unit: 'cup (150g)', calories: 98, proteinGrams: 5.0, carbsGrams: 7.0, fatsGrams: 6.0, fiberGrams: 0, isVeg: true, isVegan: false },
  { name: 'Spiced Buttermilk (Chaas)', category: 'dairy', unit: 'glass (200ml)', calories: 45, proteinGrams: 2.8, carbsGrams: 4.5, fatsGrams: 1.8, fiberGrams: 0.4, isVeg: true, isVegan: false },
  { name: 'Sweet Lassi', category: 'dairy', unit: 'glass (200ml)', calories: 180, proteinGrams: 5.5, carbsGrams: 28.0, fatsGrams: 5.5, fiberGrams: 0, isVeg: true, isVegan: false },
  { name: 'Indian Masala Chai (Tea)', category: 'beverage', unit: 'cup (120ml)', calories: 75, proteinGrams: 2.5, carbsGrams: 11.0, fatsGrams: 2.5, fiberGrams: 0, isVeg: true, isVegan: false },
  { name: 'Filter Coffee with Milk', category: 'beverage', unit: 'cup (120ml)', calories: 85, proteinGrams: 2.8, carbsGrams: 12.0, fatsGrams: 3.0, fiberGrams: 0, isVeg: true, isVegan: false },
  { name: 'Almonds & Walnuts', category: 'snack', unit: 'handful (30g)', calories: 185, proteinGrams: 5.5, carbsGrams: 5.0, fatsGrams: 16.0, fiberGrams: 3.0, isVeg: true, isVegan: true },
  { name: 'Tofu (Firm)', category: 'protein', unit: 'serving (100g)', calories: 144, proteinGrams: 17.0, carbsGrams: 3.0, fatsGrams: 8.5, fiberGrams: 2.0, isVeg: true, isVegan: true },

  // 9. Street Food, Chaats & Popular Regional Dishes
  { name: 'Pani Puri (Gol Gappe)', category: 'snack', unit: '8 puris with pani', calories: 180, proteinGrams: 4.0, carbsGrams: 32.0, fatsGrams: 4.5, fiberGrams: 3.0, isVeg: true, isVegan: true },
  { name: 'Pav Bhaji', category: 'snack', unit: '2 pavs + bhaji', calories: 380, proteinGrams: 8.5, carbsGrams: 54.0, fatsGrams: 14.5, fiberGrams: 5.5, isVeg: true, isVegan: false },
  { name: 'Vada Pav', category: 'snack', unit: '1 piece', calories: 290, proteinGrams: 6.0, carbsGrams: 42.0, fatsGrams: 11.0, fiberGrams: 3.0, isVeg: true, isVegan: true },
  { name: 'Chole Bhature', category: 'breakfast', unit: '2 bhature + chole', calories: 520, proteinGrams: 14.0, carbsGrams: 68.0, fatsGrams: 22.0, fiberGrams: 8.0, isVeg: true, isVegan: false },
  { name: 'Kachori (Moong Dal)', category: 'snack', unit: 'piece (80g)', calories: 230, proteinGrams: 4.5, carbsGrams: 24.0, fatsGrams: 13.0, fiberGrams: 2.5, isVeg: true, isVegan: true },
  { name: 'Uttapam (Onion & Tomato)', category: 'breakfast', unit: '1 uttapam', calories: 220, proteinGrams: 5.5, carbsGrams: 38.0, fatsGrams: 5.5, fiberGrams: 3.5, isVeg: true, isVegan: true },
  { name: 'Ven Pongal with Ghee', category: 'breakfast', unit: 'bowl (200g)', calories: 270, proteinGrams: 7.5, carbsGrams: 44.0, fatsGrams: 8.5, fiberGrams: 3.5, isVeg: true, isVegan: false },
  { name: 'Lemon Rice (Chitranna)', category: 'rice', unit: 'bowl (150g)', calories: 225, proteinGrams: 4.2, carbsGrams: 42.0, fatsGrams: 5.0, fiberGrams: 2.0, isVeg: true, isVegan: true },
  { name: 'Kadai Paneer', category: 'curry', unit: 'bowl (150g)', calories: 290, proteinGrams: 14.0, carbsGrams: 10.0, fatsGrams: 22.0, fiberGrams: 3.0, isVeg: true, isVegan: false },
  { name: 'Matar Paneer', category: 'curry', unit: 'bowl (150g)', calories: 250, proteinGrams: 13.0, carbsGrams: 14.0, fatsGrams: 16.0, fiberGrams: 4.5, isVeg: true, isVegan: false },
  { name: 'Egg Curry (2 Boiled Eggs)', category: 'curry', unit: 'bowl (150g)', calories: 220, proteinGrams: 14.0, carbsGrams: 6.0, fatsGrams: 15.0, fiberGrams: 1.5, isVeg: false, isVegan: false },
  { name: 'Egg Bhurji (Spiced Scrambled)', category: 'protein', unit: '2 eggs', calories: 195, proteinGrams: 13.5, carbsGrams: 3.5, fatsGrams: 14.0, fiberGrams: 1.2, isVeg: false, isVegan: false },
  { name: 'Butter Chicken', category: 'curry', unit: 'bowl (150g)', calories: 340, proteinGrams: 26.0, carbsGrams: 8.0, fatsGrams: 23.0, fiberGrams: 1.5, isVeg: false, isVegan: false },
  { name: 'Chicken Tikka', category: 'protein', unit: '6 pieces (150g)', calories: 240, proteinGrams: 32.0, carbsGrams: 4.0, fatsGrams: 10.0, fiberGrams: 1.5, isVeg: false, isVegan: false },
  { name: 'Tandoori Chicken', category: 'protein', unit: '1 leg piece (150g)', calories: 260, proteinGrams: 34.0, carbsGrams: 3.0, fatsGrams: 12.0, fiberGrams: 1.0, isVeg: false, isVegan: false },

  // 10. Western & Global Favorites
  { name: 'Vegetable Pizza (Thin Crust)', category: 'snack', unit: '2 slices (160g)', calories: 340, proteinGrams: 12.0, carbsGrams: 46.0, fatsGrams: 12.0, fiberGrams: 4.0, isVeg: true, isVegan: false },
  { name: 'Veg Burger', category: 'snack', unit: '1 burger', calories: 320, proteinGrams: 9.0, carbsGrams: 48.0, fatsGrams: 11.0, fiberGrams: 4.5, isVeg: true, isVegan: true },
  { name: 'French Fries', category: 'snack', unit: 'medium (100g)', calories: 310, proteinGrams: 3.5, carbsGrams: 41.0, fatsGrams: 15.0, fiberGrams: 3.8, isVeg: true, isVegan: true },
  { name: 'Veg Hakka Noodles', category: 'snack', unit: 'plate (200g)', calories: 310, proteinGrams: 7.5, carbsGrams: 52.0, fatsGrams: 8.5, fiberGrams: 4.0, isVeg: true, isVegan: true },
  { name: 'Veg Fried Rice', category: 'rice', unit: 'plate (200g)', calories: 320, proteinGrams: 6.5, carbsGrams: 54.0, fatsGrams: 9.0, fiberGrams: 3.5, isVeg: true, isVegan: true },
  { name: 'Vegetable Sandwich', category: 'snack', unit: '1 sandwich', calories: 210, proteinGrams: 6.0, carbsGrams: 34.0, fatsGrams: 5.5, fiberGrams: 4.0, isVeg: true, isVegan: true },
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
