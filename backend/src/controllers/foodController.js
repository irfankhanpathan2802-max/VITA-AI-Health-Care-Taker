import { runFoodAnalysisPipeline } from '../services/foodVisionService.js';
import { lookupProductByBarcode } from '../services/barcodeService.js';
import { calculateFoodNutrition, calculateMealTotals } from '../services/nutritionService.js';

/**
 * Controller for Multi-Stage Food Vision & Nutrition Agent
 */
export const analyzeFoodImageController = async (req, res) => {
  try {
    const file = req.file;
    const { manualHint = '', filename = '', barcode = null, apiKey = '' } = req.body;
    const passedKey = apiKey || req.headers['x-gemini-key'];

    const result = await runFoodAnalysisPipeline({
      buffer: file ? file.buffer : null,
      filename: file ? (file.originalname || file.filename) : filename,
      mimetype: file ? file.mimetype : 'image/jpeg',
      manualHint,
      barcode,
      apiKey: passedKey,
    });

    if (!result.foodDetection || !result.foodDetection.isFood) {
      return res.status(200).json({
        success: false,
        ...result,
      });
    }

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('analyzeFoodImageController error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to analyze meal image at this time. Please try manual entry or retake with clear lighting.',
      error: error.message,
    });
  }
};

/**
 * Controller to lookup packaged products by barcode
 */
export const barcodeLookupController = async (req, res) => {
  try {
    const { barcode } = req.params;
    if (!barcode) {
      return res.status(400).json({ success: false, message: 'Barcode is required.' });
    }

    const result = await lookupProductByBarcode(barcode);
    return res.status(200).json({
      success: result.found,
      ...result,
    });
  } catch (error) {
    console.error('barcodeLookupController error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to lookup barcode.',
      error: error.message,
    });
  }
};

/**
 * Controller to recalculate meal nutrition upon portion modification
 */
export const calculateNutritionController = async (req, res) => {
  try {
    const { items = [] } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Items array is required.' });
    }

    const processedItems = items.map((item) => {
      const nutritionResult = calculateFoodNutrition({
        foodName: item.name,
        quantity: item.portion?.value || item.quantity || 1,
        unit: item.portion?.unit || item.unit || 'serving',
      });

      return {
        name: nutritionResult.name,
        alternateNames: item.alternateNames || [],
        portion: {
          value: nutritionResult.quantity,
          unit: nutritionResult.unit,
          estimated: item.portion?.estimated ?? true,
        },
        nutrition: nutritionResult.nutrition,
        nutritionSource: nutritionResult.nutritionSource,
        confidence: item.confidence || 0.92,
      };
    });

    const mealNutrition = calculateMealTotals(processedItems);

    return res.status(200).json({
      success: true,
      items: processedItems,
      nutrition: mealNutrition,
    });
  } catch (error) {
    console.error('calculateNutritionController error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate nutrition.',
      error: error.message,
    });
  }
};
