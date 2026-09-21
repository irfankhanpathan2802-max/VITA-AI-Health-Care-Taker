import { Meal, NutritionTarget, WaterLog, Lifestyle } from '../models/index.js';
import { generateDailyReport, generateWeeklyReport, generateMonthlyReport } from '../services/reportService.js';

export const getDailyReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const dateStr = req.query.date || new Date().toISOString().split('T')[0];

    const [meals, target, waterLogs, lifestyle] = await Promise.all([
      Meal.find({ userId, date: dateStr }),
      NutritionTarget.findOne({ userId }),
      WaterLog.find({ userId, date: dateStr }),
      Lifestyle.findOne({ userId }),
    ]);

    const report = generateDailyReport(
      dateStr,
      meals || [],
      target || {},
      waterLogs || [],
      lifestyle || {}
    );

    return res.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error('getDailyReport error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate daily report.' });
  }
};

export const getWeeklyReport = async (req, res) => {
  try {
    const userId = req.user._id;

    // Build array of past 7 days
    const daysData = [];
    const now = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = dayNames[d.getDay()];

      const meals = await Meal.find({ userId, date: dateStr });
      daysData.push({
        date: dateStr,
        dayName,
        meals: meals || [],
      });
    }

    const target = await NutritionTarget.findOne({ userId });
    const weeklyReport = generateWeeklyReport(daysData, target || {});

    return res.json({
      success: true,
      report: weeklyReport,
    });
  } catch (error) {
    console.error('getWeeklyReport error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate weekly report.' });
  }
};

export const getMonthlyReport = async (req, res) => {
  try {
    const userId = req.user._id;

    // Build array of past 30 days
    const monthlyDays = [];
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const meals = await Meal.find({ userId, date: dateStr });
      monthlyDays.push({
        date: dateStr,
        meals: meals || [],
      });
    }

    const target = await NutritionTarget.findOne({ userId });
    const monthlyReport = generateMonthlyReport(monthlyDays, target || {});

    return res.json({
      success: true,
      report: monthlyReport,
    });
  } catch (error) {
    console.error('getMonthlyReport error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate monthly report.' });
  }
};
