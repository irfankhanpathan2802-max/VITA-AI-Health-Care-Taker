import { Reminder, Lifestyle, Meal, NutritionTarget } from '../models/index.js';
import { checkMissedMeals, getDefaultReminders } from '../services/reminderService.js';

export const getReminders = async (req, res) => {
  try {
    const userId = req.user._id;

    let reminders = await Reminder.find({ userId });
    if (!reminders || reminders.length === 0) {
      const defaults = getDefaultReminders(userId);
      reminders = await Reminder.insertMany(defaults);
    }

    return res.json({
      success: true,
      reminders,
    });
  } catch (error) {
    console.error('getReminders error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve reminders.' });
  }
};

export const updateReminder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { enabled, time, days } = req.body;

    const reminder = await Reminder.findById(id);
    if (!reminder) {
      return res.status(404).json({ success: false, message: 'Reminder not found.' });
    }

    if (reminder.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const updated = await Reminder.findByIdAndUpdate(
      id,
      {
        ...(enabled !== undefined && { enabled }),
        ...(time && { time }),
        ...(days && { days }),
      },
      { new: true }
    );

    return res.json({
      success: true,
      message: 'Reminder updated.',
      reminder: updated,
    });
  } catch (error) {
    console.error('updateReminder error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update reminder.' });
  }
};

export const getMissedMealAlerts = async (req, res) => {
  try {
    const userId = req.user._id;
    const todayStr = new Date().toISOString().split('T')[0];

    const [lifestyle, todayMeals, targets] = await Promise.all([
      Lifestyle.findOne({ userId }),
      Meal.find({ userId, date: todayStr }),
      NutritionTarget.findOne({ userId }),
    ]);

    const notices = checkMissedMeals(lifestyle || {}, todayMeals || [], targets || {});

    return res.json({
      success: true,
      notices,
    });
  } catch (error) {
    console.error('getMissedMealAlerts error:', error);
    return res.status(500).json({ success: false, message: 'Failed to check missed meals.' });
  }
};

export const rolloverMissedProtein = async (req, res) => {
  try {
    const userId = req.user._id;
    const { mealType, proteinGrams = 20 } = req.body;

    let target = await NutritionTarget.findOne({ userId });
    if (!target) {
      target = await NutritionTarget.create({
        userId,
        calories: 2000,
        proteinGrams: 70,
        carbsGrams: 230,
        fatsGrams: 55,
        fiberGrams: 30,
        waterMl: 2500,
      });
    }

    const previousProtein = target.proteinGrams;
    const updatedProtein = previousProtein + Number(proteinGrams);

    await NutritionTarget.findOneAndUpdate(
      { userId },
      { proteinGrams: updatedProtein },
      { new: true }
    );

    return res.json({
      success: true,
      message: `Added ${proteinGrams}g missed protein to your goal! Your updated protein target is now ${updatedProtein}g.`,
      newTargetProtein: updatedProtein,
    });
  } catch (error) {
    console.error('rolloverMissedProtein error:', error);
    return res.status(500).json({ success: false, message: 'Failed to rollover missed protein.' });
  }
};

