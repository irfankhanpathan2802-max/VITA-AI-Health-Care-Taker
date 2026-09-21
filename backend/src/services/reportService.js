import { FOOD_DATABASE } from './nutritionEngine.js';

/**
 * Generate End-of-Day Report using strictly logged meals and targets.
 * Never fabricates or fills in missing data.
 */
export const generateDailyReport = (dateStr, meals = [], target = {}, waterLogs = [], lifestyle = {}) => {
  const mealCategories = ['breakfast', 'lunch', 'snacks', 'dinner'];
  const completedMeals = [];
  const unloggedMeals = [];

  mealCategories.forEach(cat => {
    const found = meals.find(m => m.mealType === cat);
    if (found) {
      completedMeals.push({
        mealType: cat,
        timeLogged: found.timeLogged,
        itemsCount: found.items.length,
        calories: found.totalNutrition.calories,
        proteinGrams: found.totalNutrition.proteinGrams,
        carbsGrams: found.totalNutrition.carbsGrams,
        fatsGrams: found.totalNutrition.fatsGrams,
        fiberGrams: found.totalNutrition.fiberGrams,
      });
    } else {
      unloggedMeals.push(cat);
    }
  });

  const totalLogged = meals.reduce((acc, m) => ({
    calories: acc.calories + (m.totalNutrition?.calories || 0),
    proteinGrams: Math.round((acc.proteinGrams + (m.totalNutrition?.proteinGrams || 0)) * 10) / 10,
    carbsGrams: Math.round((acc.carbsGrams + (m.totalNutrition?.carbsGrams || 0)) * 10) / 10,
    fatsGrams: Math.round((acc.fatsGrams + (m.totalNutrition?.fatsGrams || 0)) * 10) / 10,
    fiberGrams: Math.round((acc.fiberGrams + (m.totalNutrition?.fiberGrams || 0)) * 10) / 10,
  }), { calories: 0, proteinGrams: 0, carbsGrams: 0, fatsGrams: 0, fiberGrams: 0 });

  const totalWaterLogged = waterLogs.reduce((acc, w) => acc + (w.amountMl || 0), 0);

  // Analysis observations
  const observations = [];
  if (meals.length === 0) {
    observations.push('No meals have been logged for this date yet.');
  } else {
    // Protein evaluation
    if (target.proteinGrams) {
      const diff = target.proteinGrams - totalLogged.proteinGrams;
      if (diff > 10) {
        observations.push(`Protein logged: ${totalLogged.proteinGrams}g / estimated target ${target.proteinGrams}g. Your logged meals provided less protein than your estimated target today.`);
      } else if (Math.abs(diff) <= 10) {
        observations.push(`Protein logged: ${totalLogged.proteinGrams}g / estimated target ${target.proteinGrams}g. Your protein intake was close to your daily estimated target.`);
      } else {
        observations.push(`Protein logged: ${totalLogged.proteinGrams}g / estimated target ${target.proteinGrams}g. Protein intake reached your estimated target.`);
      }
    }

    // Fiber evaluation
    if (target.fiberGrams && totalLogged.fiberGrams < (target.fiberGrams - 10)) {
      observations.push(`Fiber logged: ${totalLogged.fiberGrams}g against an estimated target of ${target.fiberGrams}g. Increasing whole grains, legumes, and fresh greens can help support healthy digestion.`);
    }

    // Unlogged meals notice
    if (unloggedMeals.length > 0) {
      observations.push(`Note: ${unloggedMeals.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(', ')} were not logged today.`);
    }
  }

  // Suggestions for tomorrow
  const suggestionsForTomorrow = [];
  const diet = lifestyle.dietPreference || 'Vegetarian';

  if (totalLogged.proteinGrams < (target.proteinGrams || 60)) {
    if (diet === 'Non-vegetarian') {
      suggestionsForTomorrow.push({
        name: 'Boiled Eggs or Grilled Chicken Breast',
        reason: 'Adding lean protein at breakfast or lunch can help you comfortably meet your daily estimated protein target.',
        nutrition: '12-30g protein per serving',
        image: '/images/boiled_eggs.jpg'
      });
    } else {
      suggestionsForTomorrow.push({
        name: 'Sprouted Moong Salad or Paneer / Tofu',
        reason: 'Plant and dairy proteins are nutrient-dense options to support your estimated protein target.',
        nutrition: '8-18g protein per serving',
        image: '/images/sprouts.jpg'
      });
    }
  }

  suggestionsForTomorrow.push({
    name: 'Ragi Java or Rolled Oats Porridge',
    reason: 'A complex carbohydrate breakfast with high soluble fiber provides sustained morning energy.',
    nutrition: '4-6g protein, 4.5g fiber',
    image: '/images/ragi_java.jpg'
  });

  return {
    date: dateStr,
    hasData: meals.length > 0,
    mealsLoggedCount: meals.length,
    completedMeals,
    unloggedMeals,
    totalLogged,
    target: {
      calories: target.calories || 2000,
      proteinGrams: target.proteinGrams || 60,
      carbsGrams: target.carbsGrams || 250,
      fatsGrams: target.fatsGrams || 65,
      fiberGrams: target.fiberGrams || 30,
      waterMl: target.waterMl || 2500,
    },
    waterLoggedMl: totalWaterLogged,
    observations,
    suggestionsForTomorrow,
  };
};

/**
 * Generate 7-Day Weekly Report handling missing data properly ("No data" instead of 0).
 */
export const generateWeeklyReport = (daysData = [], targets = {}) => {
  let totalMealsLogged = 0;
  let totalCaloriesLogged = 0;
  let totalProteinLogged = 0;
  let daysWithDataCount = 0;

  const weeklyTrend = daysData.map(day => {
    const mealsCount = day.meals ? day.meals.length : 0;
    totalMealsLogged += mealsCount;

    if (mealsCount === 0) {
      return {
        date: day.date,
        dayName: day.dayName,
        status: 'No data logged',
        hasData: false,
        calories: null,
        proteinGrams: null,
        fiberGrams: null,
        mealsLogged: 0,
        unloggedMeals: ['breakfast', 'lunch', 'snacks', 'dinner'],
      };
    }

    daysWithDataCount++;
    const cal = day.meals.reduce((s, m) => s + (m.totalNutrition?.calories || 0), 0);
    const prot = day.meals.reduce((s, m) => s + (m.totalNutrition?.proteinGrams || 0), 0);
    const fib = day.meals.reduce((s, m) => s + (m.totalNutrition?.fiberGrams || 0), 0);

    totalCaloriesLogged += cal;
    totalProteinLogged += prot;

    const loggedTypes = day.meals.map(m => m.mealType);
    const unlogged = ['breakfast', 'lunch', 'snacks', 'dinner'].filter(t => !loggedTypes.includes(t));

    return {
      date: day.date,
      dayName: day.dayName,
      status: unlogged.length === 0 ? 'Complete' : `${unlogged.map(u => u.charAt(0).toUpperCase() + u.slice(1)).join(', ')} not logged`,
      hasData: true,
      calories: Math.round(cal),
      proteinGrams: Math.round(prot * 10) / 10,
      fiberGrams: Math.round(fib * 10) / 10,
      mealsLogged: mealsCount,
      unloggedMeals: unlogged,
    };
  });

  const avgCalories = daysWithDataCount > 0 ? Math.round(totalCaloriesLogged / daysWithDataCount) : null;
  const avgProtein = daysWithDataCount > 0 ? Math.round((totalProteinLogged / daysWithDataCount) * 10) / 10 : null;

  return {
    totalMealsLogged,
    daysWithDataCount,
    averageCalories: avgCalories !== null ? `${avgCalories} kcal` : 'No data available',
    averageProtein: avgProtein !== null ? `${avgProtein}g` : 'No data available',
    weeklyTrend,
    targetProtein: targets.proteinGrams || 60,
    targetCalories: targets.calories || 2000,
  };
};

/**
 * Generate 30-Day Monthly Report with macro distribution and consistency
 */
export const generateMonthlyReport = (monthlyDays = [], targets = {}) => {
  let loggedDaysCount = 0;
  let completeDaysCount = 0;
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;
  let totalFiber = 0;

  const chartData = monthlyDays.map(day => {
    const meals = day.meals || [];
    if (meals.length === 0) {
      return {
        date: day.date,
        calories: null,
        protein: null,
        carbs: null,
        fats: null,
        hasData: false,
      };
    }

    loggedDaysCount++;
    if (meals.length >= 3) completeDaysCount++;

    const cal = meals.reduce((s, m) => s + (m.totalNutrition?.calories || 0), 0);
    const p = meals.reduce((s, m) => s + (m.totalNutrition?.proteinGrams || 0), 0);
    const c = meals.reduce((s, m) => s + (m.totalNutrition?.carbsGrams || 0), 0);
    const f = meals.reduce((s, m) => s + (m.totalNutrition?.fatsGrams || 0), 0);
    const fib = meals.reduce((s, m) => s + (m.totalNutrition?.fiberGrams || 0), 0);

    totalCalories += cal;
    totalProtein += p;
    totalCarbs += c;
    totalFats += f;
    totalFiber += fib;

    return {
      date: day.date.slice(5), // MM-DD
      calories: Math.round(cal),
      protein: Math.round(p),
      carbs: Math.round(c),
      fats: Math.round(f),
      hasData: true,
    };
  });

  const consistencyRate = monthlyDays.length > 0 ? Math.round((loggedDaysCount / monthlyDays.length) * 100) : 0;

  // Group into 4 distinct weeks
  const fourWeeks = [
    { weekNumber: 1, label: 'Week 1', days: monthlyDays.slice(0, 7) },
    { weekNumber: 2, label: 'Week 2', days: monthlyDays.slice(7, 14) },
    { weekNumber: 3, label: 'Week 3', days: monthlyDays.slice(14, 21) },
    { weekNumber: 4, label: 'Week 4', days: monthlyDays.slice(21) },
  ];

  const fourWeeksBreakdown = fourWeeks.map(w => {
    let wDaysWithData = 0;
    let wCal = 0;
    let wProt = 0;
    w.days.forEach(d => {
      const ms = d.meals || [];
      if (ms.length > 0) {
        wDaysWithData++;
        wCal += ms.reduce((s, m) => s + (m.totalNutrition?.calories || 0), 0);
        wProt += ms.reduce((s, m) => s + (m.totalNutrition?.proteinGrams || 0), 0);
      }
    });

    return {
      weekNumber: w.weekNumber,
      label: w.label,
      daysLogged: wDaysWithData,
      totalDays: w.days.length,
      averageCalories: wDaysWithData > 0 ? Math.round(wCal / wDaysWithData) : null,
      averageProtein: wDaysWithData > 0 ? Math.round((wProt / wDaysWithData) * 10) / 10 : null,
      consistencyRate: w.days.length > 0 ? `${Math.round((wDaysWithData / w.days.length) * 100)}%` : '0%',
    };
  });

  return {
    loggedDaysCount,
    completeDaysCount,
    totalDays: monthlyDays.length,
    consistencyRate: `${consistencyRate}%`,
    averageCalories: loggedDaysCount > 0 ? Math.round(totalCalories / loggedDaysCount) : 'No data',
    averageProtein: loggedDaysCount > 0 ? Math.round(totalProtein / loggedDaysCount) : 'No data',
    chartData,
    fourWeeksBreakdown,
  };
};
