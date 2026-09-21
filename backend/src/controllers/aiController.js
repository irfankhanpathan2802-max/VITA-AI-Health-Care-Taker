import { analyzeFoodImage } from '../services/aiVisionService.js';
import { parseVoiceMealTranscript } from '../services/aiVoiceService.js';
import { askAICoach } from '../services/aiCoachService.js';
import { getAfternoonNutritionAlert, generateTomorrowsPlan } from '../services/recommendationService.js';
import { answerUserEnquiry } from '../services/aiEnquiryService.js';
import { Meal, NutritionTarget, Lifestyle, Profile, Product } from '../models/index.js';

export const analyzePhoto = async (req, res) => {
  try {
    const file = req.file;
    const { manualHint = '', filename = '' } = req.body;

    const result = await analyzeFoodImage({
      filename: file ? file.filename : filename,
      originalname: file ? file.originalname : filename,
      mimetype: file ? file.mimetype : 'image/jpeg',
      manualHint,
    });

    if (!result.isFood) {
      return res.status(200).json({
        success: false,
        isFood: false,
        message: result.message || 'Food not detected. Please capture a clear image of your meal or food.',
        detectedItems: [],
      });
    }

    return res.status(200).json({
      success: true,
      isFood: true,
      message: result.message,
      detectedItems: result.detectedItems,
      totalEstimatedNutrition: result.totalEstimatedNutrition,
    });
  } catch (error) {
    console.error('analyzePhoto error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to process image at this time. Please try manual entry or retake the photo.',
    });
  }
};

export const parseVoice = async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript || typeof transcript !== 'string') {
      return res.status(400).json({ success: false, message: 'Please provide speech transcript.' });
    }

    const result = parseVoiceMealTranscript(transcript);

    if (!result.success) {
      return res.status(200).json({
        success: false,
        message: result.message,
        understoodItems: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
      understoodMealType: result.understoodMealType,
      understoodItems: result.understoodItems,
      totalEstimatedNutrition: result.totalEstimatedNutrition,
      originalTranscript: result.originalTranscript,
    });
  } catch (error) {
    console.error('parseVoice error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process voice input.' });
  }
};

export const chatWithCoach = async (req, res) => {
  try {
    const userId = req.user._id;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty.' });
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const [todayMeals, targets, lifestyle, profile, products] = await Promise.all([
      Meal.find({ userId, date: todayStr }),
      NutritionTarget.findOne({ userId }),
      Lifestyle.findOne({ userId }),
      Profile.findOne({ userId }),
      Product.find({}),
    ]);

    const coachResponse = await askAICoach({
      question: message,
      user: req.user,
      profile: profile || {},
      lifestyle: lifestyle || {},
      targets: targets || {},
      todayMeals: todayMeals || [],
      storeProducts: products || [],
    });

    return res.json({
      success: true,
      response: coachResponse,
    });
  } catch (error) {
    console.error('chatWithCoach error:', error);
    return res.status(500).json({ success: false, message: 'AI Coach is temporarily unavailable.' });
  }
};

export const getTomorrowsNutritionPlan = async (req, res) => {
  try {
    const userId = req.user._id;
    const todayStr = new Date().toISOString().split('T')[0];

    const [todayMeals, target, lifestyle, products] = await Promise.all([
      Meal.find({ userId, date: todayStr }),
      NutritionTarget.findOne({ userId }),
      Lifestyle.findOne({ userId }),
      Product.find({}),
    ]);

    const plan = generateTomorrowsPlan({
      todayMeals: todayMeals || [],
      target: target || {},
      lifestyle: lifestyle || {},
      storeProducts: products || [],
    });

    return res.json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error('getTomorrowsNutritionPlan error:', error);
    return res.status(500).json({ success: false, message: "Failed to generate tomorrow's plan." });
  }
};

export const getAfternoonAlert = async (req, res) => {
  try {
    const userId = req.user._id;
    const todayStr = new Date().toISOString().split('T')[0];

    const [todayMeals, target, lifestyle, products] = await Promise.all([
      Meal.find({ userId, date: todayStr }),
      NutritionTarget.findOne({ userId }),
      Lifestyle.findOne({ userId }),
      Product.find({}),
    ]);

    const alert = getAfternoonNutritionAlert({
      todayMeals: todayMeals || [],
      target: target || {},
      lifestyle: lifestyle || {},
      storeProducts: products || [],
    });

    return res.json({
      success: true,
      alert,
    });
  } catch (error) {
    console.error('getAfternoonAlert error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve nutrition alert.' });
  }
};

export const handleEnquiry = async (req, res) => {
  try {
    const { enquiry } = req.body;

    if (!enquiry || typeof enquiry !== 'string') {
      return res.status(400).json({ success: false, message: 'Please provide an enquiry message.' });
    }

    const result = await answerUserEnquiry({ enquiry });

    return res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('handleEnquiry error:', error);
    return res.status(500).json({ success: false, message: 'Enquiry assistant is temporarily unavailable.' });
  }
};

