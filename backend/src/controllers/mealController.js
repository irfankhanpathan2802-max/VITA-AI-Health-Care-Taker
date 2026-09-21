import { Meal, NutritionTarget } from '../models/index.js';
import { FOOD_DATABASE, findFoodByName } from '../services/nutritionEngine.js';

export const getMealsByDate = async (req, res) => {
  try {
    const userId = req.user._id;
    const dateStr = req.query.date || new Date().toISOString().split('T')[0];

    // Fetch actual logged meals for this date
    const meals = await Meal.find({ userId, date: dateStr }, { createdAt: -1 });

    // Calculate totals strictly from actual logged meals
    const totalNutrition = meals.reduce((acc, m) => ({
      calories: acc.calories + (m.totalNutrition?.calories || 0),
      proteinGrams: Math.round((acc.proteinGrams + (m.totalNutrition?.proteinGrams || 0)) * 10) / 10,
      carbsGrams: Math.round((acc.carbsGrams + (m.totalNutrition?.carbsGrams || 0)) * 10) / 10,
      fatsGrams: Math.round((acc.fatsGrams + (m.totalNutrition?.fatsGrams || 0)) * 10) / 10,
      fiberGrams: Math.round((acc.fiberGrams + (m.totalNutrition?.fiberGrams || 0)) * 10) / 10,
    }), { calories: 0, proteinGrams: 0, carbsGrams: 0, fatsGrams: 0, fiberGrams: 0 });

    const target = await NutritionTarget.findOne({ userId });

    return res.json({
      success: true,
      date: dateStr,
      hasData: meals.length > 0,
      mealsCount: meals.length,
      meals,
      totalNutrition: meals.length > 0 ? totalNutrition : null,
      target: target || null,
    });
  } catch (error) {
    console.error('getMealsByDate error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve meals.' });
  }
};

export const addMeal = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      mealType,
      date = new Date().toISOString().split('T')[0],
      timeLogged,
      source = 'manual',
      items = [],
      notes = '',
      imageUrl = '',
    } = req.body;

    if (!mealType || !['breakfast', 'lunch', 'snacks', 'dinner'].includes(mealType)) {
      return res.status(400).json({ success: false, message: 'Valid meal type (breakfast, lunch, snacks, dinner) is required.' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Please add at least one food item.' });
    }

    const now = new Date();
    const formattedTime = timeLogged || now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Calculate total nutrition for this meal
    const totalNutrition = items.reduce((acc, item) => ({
      calories: acc.calories + (Number(item.calories) || 0),
      proteinGrams: Math.round((acc.proteinGrams + (Number(item.proteinGrams) || 0)) * 10) / 10,
      carbsGrams: Math.round((acc.carbsGrams + (Number(item.carbsGrams) || 0)) * 10) / 10,
      fatsGrams: Math.round((acc.fatsGrams + (Number(item.fatsGrams) || 0)) * 10) / 10,
      fiberGrams: Math.round((acc.fiberGrams + (Number(item.fiberGrams) || 0)) * 10) / 10,
    }), { calories: 0, proteinGrams: 0, carbsGrams: 0, fatsGrams: 0, fiberGrams: 0 });

    const meal = await Meal.create({
      userId,
      date,
      mealType,
      timeLogged: formattedTime,
      source,
      items,
      totalNutrition,
      notes,
      imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} logged successfully.`,
      meal,
    });
  } catch (error) {
    console.error('addMeal error:', error);
    return res.status(500).json({ success: false, message: 'Failed to record meal.' });
  }
};

export const deleteMeal = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const meal = await Meal.findById(id);
    if (!meal) {
      return res.status(404).json({ success: false, message: 'Meal entry not found.' });
    }

    if (meal.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this meal.' });
    }

    await Meal.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: 'Meal removed successfully.',
    });
  } catch (error) {
    console.error('deleteMeal error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete meal.' });
  }
};

export const searchFoodDatabase = (req, res) => {
  try {
    const { query = '' } = req.query;
    if (!query) {
      return res.json({ success: true, foods: FOOD_DATABASE.slice(0, 10) });
    }
    const q = query.toLowerCase().trim();
    const matches = FOOD_DATABASE.filter(f =>
      f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
    );
    return res.json({ success: true, foods: matches });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error searching food database.' });
  }
};
