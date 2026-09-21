import { FOOD_DATABASE } from './nutritionEngine.js';

/**
 * Context-aware VitaCare AI Coach.
 * Strictly uses logged data and never fabricates intake numbers.
 */
export const askAICoach = async ({ question = '', user = {}, profile = {}, lifestyle = {}, targets = {}, todayMeals = [], pastMeals = [], storeProducts = [] }) => {
  const q = question.toLowerCase().trim();

  // 1. What did I eat today?
  if (q.includes('what did i eat today') || q.includes('my meals today') || q.includes('today meals')) {
    if (!todayMeals || todayMeals.length === 0) {
      return {
        answer: "You haven't logged any meals today yet. Add your first meal to start tracking your daily nutrition!",
        suggestions: ['Log Breakfast', 'Log Lunch', 'Take Meal Photo'],
        relatedProducts: [],
      };
    }

    const mealSummary = todayMeals.map(m => {
      const type = m.mealType.charAt(0).toUpperCase() + m.mealType.slice(1);
      const itemsList = m.items.map(i => `${i.quantity} ${i.unit || ''} ${i.name}`).join(', ');
      return `• **${type}** (${m.timeLogged}): ${itemsList} — ${m.totalNutrition.calories} kcal, ${m.totalNutrition.proteinGrams}g protein`;
    }).join('\n');

    return {
      answer: `Here is what you have logged for today:\n\n${mealSummary}\n\nTotal logged: ${todayMeals.reduce((s, m) => s + m.totalNutrition.calories, 0)} kcal, ${todayMeals.reduce((s, m) => s + m.totalNutrition.proteinGrams, 0)}g protein.`,
      suggestions: ['How much protein do I have left?', "What's tomorrow's plan?"],
      relatedProducts: [],
    };
  }

  // 2. How much protein did I log today?
  if (q.includes('protein') && (q.includes('today') || q.includes('how much') || q.includes('logged'))) {
    if (!todayMeals || todayMeals.length === 0) {
      return {
        answer: `You haven't logged any meals today yet. Your estimated daily protein target is **${targets.proteinGrams || 60}g**. Add your meals to see your progress!`,
        suggestions: ['Log a Meal', 'Protein-rich foods in store'],
        relatedProducts: storeProducts.filter(p => p.category === 'HIGH PROTEIN').slice(0, 2),
      };
    }

    const totalProtein = todayMeals.reduce((s, m) => s + (m.totalNutrition.proteinGrams || 0), 0);
    const targetProtein = targets.proteinGrams || 60;
    const remaining = Math.max(0, Math.round((targetProtein - totalProtein) * 10) / 10);

    let message = `You have logged approximately **${totalProtein}g** of protein today against your estimated target of **${targetProtein}g**.\n`;
    if (remaining > 0) {
      message += `Approximately **${remaining}g remaining** based on your current target. Consider a protein-rich option for your upcoming meal.`;
    } else {
      message += `You have reached your estimated protein target for today!`;
    }

    const proteinProducts = storeProducts.filter(p => p.category === 'HIGH PROTEIN').slice(0, 3);

    return {
      answer: message,
      suggestions: ['View high-protein options in VitaCare Store', "Plan tomorrow's meals"],
      relatedProducts: proteinProducts,
    };
  }

  // 3. What should I eat tomorrow? / Tomorrow's plan
  if (q.includes('tomorrow') || q.includes('what should i eat')) {
    const diet = lifestyle.dietPreference || 'Vegetarian';
    const totalProtein = todayMeals.reduce((s, m) => s + (m.totalNutrition?.proteinGrams || 0), 0);
    const targetProtein = targets.proteinGrams || 60;

    let advice = `Based on your ${diet.toLowerCase()} preference and daily wellness targets, here is a balanced approach for tomorrow:\n\n`;
    advice += `• **Breakfast**: High fiber and complex carbs (e.g. Ragi Java or Rolled Oats) with protein (Sprouts or Eggs).\n`;
    advice += `• **Lunch**: Whole wheat rotis or brown rice paired with yellow dal and a fresh vegetable salad.\n`;
    advice += `• **Snacks**: Handful of roasted nuts or a cup of plain Greek yogurt.\n`;
    advice += `• **Dinner**: Light meal with steamed greens, lentils, or paneer/tofu at least 2 hours before bed.`;

    return {
      answer: advice,
      suggestions: ["View Tomorrow's Plan page", 'Explore VitaCare Store'],
      relatedProducts: storeProducts.slice(0, 3),
    };
  }

  // 4. Why is fiber important?
  if (q.includes('fiber') || q.includes('fibre')) {
    return {
      answer: `Dietary fiber is essential for several key aspects of preventive wellness:\n\n1. **Digestive Health**: Promotes regularity and feeds beneficial gut microbiota.\n2. **Blood Sugar Regulation**: Soluble fiber slows carbohydrate absorption, preventing rapid glucose spikes.\n3. **Sustained Satiety**: Helps you feel comfortably full longer, supporting balanced energy.\n4. **Cardiovascular Wellness**: Helps maintain healthy cholesterol profiles.\n\nYour estimated daily fiber target is **${targets.fiberGrams || 30}g**. Whole grains, lentils, millets, and fresh fruits are excellent sources.`,
      suggestions: ['Fiber-rich breakfast foods', 'View VitaCare Store'],
      relatedProducts: storeProducts.filter(p => p.category === 'HEALTHY BREAKFAST' || p.category === 'FRUITS & FRESH FOODS').slice(0, 2),
    };
  }

  // 5. I haven't logged lunch. What should I do?
  if (q.includes('lunch') && (q.includes('haven\'t') || q.includes('missed') || q.includes('not logged') || q.includes('forgot'))) {
    return {
      answer: "No problem! You can quickly record your lunch now using the **+ ADD MEAL** button on your dashboard. Choose between taking a photo, speaking naturally with voice input, or entering items manually. Recording your meal helps keep your daily nutrition summary accurate.",
      suggestions: ['Add Lunch Now', 'View Dashboard'],
      relatedProducts: [],
    };
  }

  // 6. What protein-rich foods match my diet?
  if (q.includes('protein-rich') || q.includes('protein options') || q.includes('sources of protein')) {
    const diet = lifestyle.dietPreference || 'Vegetarian';
    let foodList = '';

    if (diet === 'Non-vegetarian') {
      foodList = '• Boiled or poached eggs (6.3g per egg)\n• Grilled chicken breast (31g per 100g)\n• Yellow dal / cooked lentils (9g per bowl)\n• Paneer (18g per 100g)\n• Greek yogurt (15g per cup)';
    } else if (diet === 'Vegan') {
      foodList = '• Sprouted moong salad (7.8g per 100g)\n• Tofu (17g per 100g)\n• Cooked dal and pulses (9g per bowl)\n• Mixed seeds and nuts (5-6g per handful)\n• Soya chunks / edamame';
    } else {
      foodList = '• Yellow dal / cooked lentils (9g per bowl)\n• Paneer (18g per 100g)\n• Greek yogurt (15g per cup)\n• Sprouted moong salad (7.8g per 100g)\n• Boiled eggs (if eggetarian)';
    }

    return {
      answer: `Here are great protein sources suited for your **${diet}** lifestyle:\n\n${foodList}\n\nYou can also find freshly prepared protein meal boxes and ingredients in the VitaCare Store.`,
      suggestions: ['Explore High Protein in Store', 'Log a Meal'],
      relatedProducts: storeProducts.filter(p => p.category === 'HIGH PROTEIN').slice(0, 3),
    };
  }

  // 7. General fallback grounded in actual data
  if (todayMeals.length === 0) {
    return {
      answer: `Hello! I'm your VitaCare AI Coach. I don't have enough logged information for today yet. Once you log your meals and activities, I can provide personalized nutritional observations and practical wellness guidance. How can I help you today?`,
      suggestions: ['What should I eat tomorrow?', 'Why is fiber important?', 'Protein options for my diet'],
      relatedProducts: storeProducts.slice(0, 2),
    };
  }

  const cal = todayMeals.reduce((s, m) => s + m.totalNutrition.calories, 0);
  const prot = todayMeals.reduce((s, m) => s + m.totalNutrition.proteinGrams, 0);

  return {
    answer: `Based on your logged data today, you have recorded ${todayMeals.length} meal(s) totaling **${cal} kcal** and **${prot}g protein**. Your daily estimated targets are ${targets.calories || 2000} kcal and ${targets.proteinGrams || 60}g protein. How else can I assist your wellness routine?`,
    suggestions: ['How much protein is remaining?', "Plan tomorrow's meals", 'View VitaCare Store'],
    relatedProducts: storeProducts.slice(0, 2),
  };
};
