import { FOOD_DATABASE } from './nutritionEngine.js';

const NUMBER_WORDS = {
  one: 1, a: 1, an: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
  seven: 7, eight: 8, nine: 9, ten: 10, half: 0.5, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5
};

export const parseVoiceMealTranscript = (transcript = '') => {
  if (!transcript || typeof transcript !== 'string' || transcript.trim().length === 0) {
    return {
      success: false,
      message: "We couldn't understand the meal. Please try again.",
      understoodItems: [],
    };
  }

  const text = transcript.toLowerCase();

  // Detect meal type
  let understoodMealType = 'lunch'; // default fallback
  if (text.includes('breakfast')) understoodMealType = 'breakfast';
  else if (text.includes('lunch')) understoodMealType = 'lunch';
  else if (text.includes('dinner')) understoodMealType = 'dinner';
  else if (text.includes('snack')) understoodMealType = 'snacks';

  const extractedItems = [];

  const STOP_WORDS = new Set(['with', 'cooked', 'whole', 'fresh', 'plain', 'firm', 'drink', 'piece', 'bowl', 'serving', 'plate', 'handful']);

  // Match items from database with intelligent keyword and synonym matching
  for (const food of FOOD_DATABASE) {
    const rawTokens = food.name.toLowerCase().split(/[ ()/,]+/).filter(k => k.length > 2 && !STOP_WORDS.has(k));
    
    // Check if any significant token or alias matches the transcript
    const matchesToken = rawTokens.some(token => {
      // Check singular, plural (token + 's', or token ending in 's' trimmed)
      const singular = token.endsWith('s') ? token.slice(0, -1) : token;
      const plural = token + 's';
      const regex = new RegExp(`\\b(${token}|${singular}|${plural})\\b`, 'i');
      return regex.test(text);
    });

    if (matchesToken) {
      // Look for a number preceding the matched food keyword
      const words = text.split(/\s+/);
      let matchedWordIdx = -1;
      for (let i = 0; i < words.length; i++) {
        const cleanWord = words[i].replace(/[^a-zA-Z0-9]/g, '');
        if (rawTokens.some(token => cleanWord.startsWith(token) || token.startsWith(cleanWord) || (cleanWord.endsWith('s') && cleanWord.slice(0, -1) === token))) {
          matchedWordIdx = i;
          break;
        }
      }

      let quantity = 1;
      if (matchedWordIdx > 0) {
        const prevWord = words[matchedWordIdx - 1].replace(/[^a-zA-Z0-9]/g, '');
        if (NUMBER_WORDS[prevWord] !== undefined) {
          quantity = NUMBER_WORDS[prevWord];
        } else if (!isNaN(Number(prevWord)) && Number(prevWord) > 0) {
          quantity = Number(prevWord);
        }
      }

      // Check if already extracted
      if (!extractedItems.some(i => i.name === food.name)) {
        extractedItems.push({
          name: food.name,
          quantity: quantity,
          unit: food.unit,
          calories: Math.round(food.calories * quantity),
          proteinGrams: Math.round(food.proteinGrams * quantity * 10) / 10,
          carbsGrams: Math.round(food.carbsGrams * quantity * 10) / 10,
          fatsGrams: Math.round(food.fatsGrams * quantity * 10) / 10,
          fiberGrams: Math.round(food.fiberGrams * quantity * 10) / 10,
        });
      }
    }
  }

  if (extractedItems.length === 0) {
    return {
      success: false,
      message: "We couldn't identify specific foods from the speech. Please try speaking clearly or enter manually.",
      understoodItems: [],
    };
  }

  const totalEstimatedNutrition = extractedItems.reduce((acc, item) => ({
    calories: acc.calories + item.calories,
    proteinGrams: Math.round((acc.proteinGrams + item.proteinGrams) * 10) / 10,
    carbsGrams: Math.round((acc.carbsGrams + item.carbsGrams) * 10) / 10,
    fatsGrams: Math.round((acc.fatsGrams + item.fatsGrams) * 10) / 10,
    fiberGrams: Math.round((acc.fiberGrams + item.fiberGrams) * 10) / 10,
  }), { calories: 0, proteinGrams: 0, carbsGrams: 0, fatsGrams: 0, fiberGrams: 0 });

  return {
    success: true,
    understoodMealType,
    understoodItems: extractedItems,
    totalEstimatedNutrition,
    originalTranscript: transcript,
    message: 'We understood your meal as follows. Please confirm or edit portions.',
  };
};
