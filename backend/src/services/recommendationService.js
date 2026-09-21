import { FOOD_DATABASE } from './nutritionEngine.js';

/**
 * Generates afternoon nutrition alerts and smart recommendations.
 */
export const getAfternoonNutritionAlert = ({ todayMeals = [], target = {}, lifestyle = {}, storeProducts = [] }) => {
  const totalProteinLogged = todayMeals.reduce((s, m) => s + (m.totalNutrition?.proteinGrams || 0), 0);
  const targetProtein = target.proteinGrams || 60;
  const diet = lifestyle.dietPreference || 'Vegetarian';

  // If protein intake is significantly below half target by afternoon
  const diff = targetProtein - totalProteinLogged;

  if (diff <= 15) {
    return null; // On track, no warning alert needed
  }

  // Filter food suggestions based on diet
  let suggestions = [];
  if (diet === 'Non-vegetarian') {
    suggestions = [
      { name: 'Boiled Eggs (2 pcs)', proteinGrams: 12.6, calories: 148, image: '/images/boiled_eggs.jpg' },
      { name: 'Fresh Bread Omelette', proteinGrams: 18.5, calories: 295, image: '/images/bread_omelette.jpg' },
      { name: 'Grilled Chicken Breast Bowl', proteinGrams: 31.0, calories: 165, image: '/images/chicken.jpg' },
      { name: 'Sprouted Moong Salad', proteinGrams: 7.8, calories: 105, image: '/images/sprouts.jpg' },
    ];
  } else if (diet === 'Vegan') {
    suggestions = [
      { name: 'Sprouted Moong Salad', proteinGrams: 7.8, calories: 105, image: '/images/sprouts.jpg' },
      { name: 'Tofu & Vegetable Stir Fry', proteinGrams: 17.0, calories: 144, image: '/images/salad_bowl.jpg' },
      { name: 'Cooked Yellow Dal Bowl', proteinGrams: 9.0, calories: 145, image: '/images/soup.jpg' },
    ];
  } else {
    suggestions = [
      { name: 'Paneer (Cottage Cheese) Cubes', proteinGrams: 18.0, calories: 265, image: '/images/paneer.jpg' },
      { name: 'Sprouted Moong Salad', proteinGrams: 7.8, calories: 105, image: '/images/sprouts.jpg' },
      { name: 'Cooked Yellow Dal Bowl', proteinGrams: 9.0, calories: 145, image: '/images/soup.jpg' },
    ];
  }

  // Connect to VitaCare Store products
  const matchingProducts = storeProducts
    .filter(p => p.category === 'HIGH PROTEIN')
    .slice(0, 3);

  return {
    type: 'afternoon_protein_alert',
    headline: `You have logged approximately ${totalProteinLogged}g of protein today against your estimated daily target (${targetProtein}g).`,
    recommendation: 'Consider including a protein-rich option in your next meal or evening snack.',
    foodSuggestions: suggestions,
    storeProducts: matchingProducts,
  };
};

/**
 * Generates Tomorrow's Nutrition Plan based on today's logged meals and user preferences.
 */
export const generateTomorrowsPlan = ({ todayMeals = [], target = {}, lifestyle = {}, storeProducts = [] }) => {
  const totalProteinLogged = todayMeals.reduce((s, m) => s + (m.totalNutrition?.proteinGrams || 0), 0);
  const targetProtein = target.proteinGrams || 60;
  const diet = lifestyle.dietPreference || 'Vegetarian';

  const planCards = [];

  // Breakfast suggestion
  planCards.push({
    mealCategory: 'Breakfast',
    name: 'Ragi Java & Sprouted Moong Bowl',
    whySuggested: 'Combines slow-digesting complex carbs with high micronutrients and clean plant protein for steady morning energy.',
    nutrition: 'Calories: 225 kcal | Protein: 12g | Fiber: 9g',
    image: '/images/ragi_java.jpg',
    tag: 'High Fiber',
  });

  // Lunch suggestion
  if (diet === 'Non-vegetarian') {
    planCards.push({
      mealCategory: 'Lunch',
      name: 'Grilled Herb Chicken with Roti & Dal',
      whySuggested: 'Provides lean protein to support muscle recovery and helps you easily reach your estimated daily target.',
      nutrition: 'Calories: 460 kcal | Protein: 38g | Fiber: 8g',
      image: '/images/chicken.jpg',
      tag: 'High Protein',
    });
  } else {
    planCards.push({
      mealCategory: 'Lunch',
      name: 'Paneer Bhurji with 2 Rotis & Cucumber Salad',
      whySuggested: 'Rich in bioavailable calcium and protein while providing gut-friendly prebiotic fiber from fresh greens.',
      nutrition: 'Calories: 435 kcal | Protein: 24g | Fiber: 7g',
      image: '/images/paneer.jpg',
      tag: 'High Protein',
    });
  }

  // Evening snack
  planCards.push({
    mealCategory: 'Snack',
    name: 'Mixed Seeds, Almonds & Fresh Papaya',
    whySuggested: 'Contains heart-healthy fats, vitamin E, and natural digestive enzymes without creating blood sugar spikes.',
    nutrition: 'Calories: 180 kcal | Protein: 6g | Fiber: 5g',
    image: '/images/almonds_walnuts.jpg',
    tag: 'Nutrient Dense',
  });

  // Dinner
  planCards.push({
    mealCategory: 'Dinner',
    name: 'Light Yellow Dal Soup with Steamed Vegetables',
    whySuggested: 'Gentle on digestion before sleep while providing essential amino acids and micronutrients.',
    nutrition: 'Calories: 255 kcal | Protein: 12g | Fiber: 10g',
    image: '/images/soup.jpg',
    tag: 'Easy Digestion',
  });

  const matchingStore = storeProducts.slice(0, 4);

  return {
    title: "Tomorrow's Nutrition Plan",
    observation: totalProteinLogged < targetProtein
      ? `Today's logged protein was below your estimated target (${totalProteinLogged}g / ${targetProtein}g). Tomorrow's plan focuses on balanced protein distribution across meals.`
      : `Great job on your nutrition today! Tomorrow's plan maintains consistent macro balance and nutrient variety.`,
    planCards,
    recommendedStoreProducts: matchingStore,
    disclaimer: 'Personalized wellness suggestions based on your lifestyle profile and logged meals.'
  };
};
