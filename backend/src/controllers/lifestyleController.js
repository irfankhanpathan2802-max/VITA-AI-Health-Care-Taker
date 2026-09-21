import { Lifestyle, Profile, WaterLog } from '../models/index.js';
import { analyzeLifestyle } from '../services/lifestyleAdvisor.js';

export const getLifestyleInsights = async (req, res) => {
  try {
    const userId = req.user._id;

    const [lifestyle, profile] = await Promise.all([
      Lifestyle.findOne({ userId }),
      Profile.findOne({ userId }),
    ]);

    const insights = analyzeLifestyle(lifestyle || {}, profile || {});

    return res.json({
      success: true,
      lifestyle: lifestyle || null,
      insights,
    });
  } catch (error) {
    console.error('getLifestyleInsights error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve lifestyle analysis.' });
  }
};

export const logWater = async (req, res) => {
  try {
    const userId = req.user._id;
    const { amountMl = 250, date = new Date().toISOString().split('T')[0] } = req.body;

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const log = await WaterLog.create({
      userId,
      date,
      amountMl: Number(amountMl),
      timeLogged: formattedTime,
    });

    const allTodayWater = await WaterLog.find({ userId, date });
    const totalWaterMl = allTodayWater.reduce((sum, w) => sum + (w.amountMl || 0), 0);

    return res.status(201).json({
      success: true,
      message: `${amountMl}ml water logged.`,
      log,
      totalWaterMl,
    });
  } catch (error) {
    console.error('logWater error:', error);
    return res.status(500).json({ success: false, message: 'Failed to log water intake.' });
  }
};

export const getTodayWater = async (req, res) => {
  try {
    const userId = req.user._id;
    const date = req.query.date || new Date().toISOString().split('T')[0];

    const logs = await WaterLog.find({ userId, date });
    const totalWaterMl = logs.reduce((sum, w) => sum + (w.amountMl || 0), 0);

    return res.json({
      success: true,
      date,
      totalWaterMl,
      logsCount: logs.length,
      logs,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to get water logs.' });
  }
};
