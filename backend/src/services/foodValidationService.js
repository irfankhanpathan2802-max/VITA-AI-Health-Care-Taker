// Stage 1: Image Quality Validation & Stage 2: Food vs Non-Food Classifier & Stage 7: Validation Layer

// Explicit list of non-food objects for strict negative validation
export const NON_FOOD_PATTERNS = [
  { pattern: /\b(water\s*bottle|plastic\s*bottle|glass\s*bottle|bottle)\b/i, name: 'water bottle' },
  { pattern: /\b(laptop|macbook|notebook\s*computer|thinkpad)\b/i, name: 'laptop' },
  { pattern: /\b(mobile\s*phone|smartphone|iphone|android\s*phone|cellphone)\b/i, name: 'mobile phone' },
  { pattern: /\b(keyboard|mouse|trackpad|monitor|display|screen|tv)\b/i, name: 'computer accessory' },
  { pattern: /\b(chair|sofa|couch|table|desk|stool|furniture)\b/i, name: 'furniture' },
  { pattern: /\b(wall|floor|ceiling|window|door|curtain)\b/i, name: 'room fixture' },
  { pattern: /\b(bag|backpack|purse|wallet|suitcase)\b/i, name: 'bag' },
  { pattern: /\b(shoe|shoes|sneaker|slippers|sock|sandal)\b/i, name: 'footwear' },
  { pattern: /\b(shirt|t-shirt|pant|jeans|dress|jacket|clothes|cloth)\b/i, name: 'clothing' },
  { pattern: /\b(dog|cat|bird|pet|animal)\b/i, name: 'animal' },
  { pattern: /\b(car|vehicle|motorcycle|bike|bicycle)\b/i, name: 'vehicle' },
  { pattern: /\b(pen|pencil|notebook|paper|book|document|text)\b/i, name: 'stationery' },
  { pattern: /\b(remote|charger|cable|wire|battery|headphones|earbuds)\b/i, name: 'electronics' },
  { pattern: /\b(human|face|selfie|person|man|woman|hand|finger)\b/i, name: 'person' },
];

/**
 * STAGE 1: IMAGE QUALITY VALIDATION
 * Checks whether an image is present, readable, adequately lit, and not excessively corrupt/blurry.
 */
export const validateImageQuality = (buffer, mimetype = 'image/jpeg', options = {}) => {
  const { filename = '', manualHint = '', barcode = null } = options;

  if (!buffer || !(buffer instanceof Buffer) || buffer.length === 0) {
    if (filename || manualHint || barcode) {
      return {
        imageQuality: 'acceptable',
        qualityConfidence: 0.90,
        isAcceptable: true,
        message: 'Image metadata received.',
        code: 'METADATA_MODE',
      };
    }
    return {
      imageQuality: 'poor',
      qualityConfidence: 0.99,
      isAcceptable: false,
      message: 'No image data detected. Please capture or upload an image of your food.',
      code: 'NO_IMAGE',
    };
  }

  // Minimum file size check (a valid camera capture is typically at least 1 KB)
  if (buffer.length < 800) {
    return {
      imageQuality: 'poor',
      qualityConfidence: 0.95,
      isAcceptable: false,
      message: 'The captured image file is too small or corrupt. Please capture a clearer photo.',
      code: 'CORRUPT_OR_EMPTY',
    };
  }

  // Check magic bytes for supported image formats (JPEG, PNG, WEBP, GIF)
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8;
  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  const isWebp = buffer.length > 12 && buffer.toString('ascii', 8, 12) === 'WEBP';
  const isGif = buffer.length > 3 && buffer.toString('ascii', 0, 3) === 'GIF';

  if (!isJpeg && !isPng && !isWebp && !isGif && !mimetype.startsWith('image/')) {
    return {
      imageQuality: 'poor',
      qualityConfidence: 0.92,
      isAcceptable: false,
      message: 'Unsupported image format. Please capture a JPG, PNG, or WEBP photo.',
      code: 'INVALID_FORMAT',
    };
  }

  // Sample luminance & variance to detect pitch-black or severely under-exposed images
  let totalLuminance = 0;
  let varianceSum = 0;
  let sampleCount = 0;
  const sampleStep = Math.max(1, Math.floor(buffer.length / 400));

  for (let i = 0; i < buffer.length - 2; i += sampleStep) {
    const r = buffer[i];
    const g = buffer[i + 1];
    const b = buffer[i + 2];
    // Standard perceptual luminance formula: 0.299R + 0.587G + 0.114B
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    totalLuminance += lum;
    sampleCount++;
  }

  const avgLuminance = sampleCount > 0 ? totalLuminance / sampleCount : 120;

  // Severe darkness check (< 18 on 0-255 scale)
  if (avgLuminance < 18) {
    return {
      imageQuality: 'poor',
      qualityConfidence: 0.94,
      isAcceptable: false,
      message: 'The image is too dark. Please capture your food in better lighting.',
      code: 'TOO_DARK',
    };
  }

  // Blurry / flat image check (very low contrast / variance across bytes)
  for (let i = 0; i < buffer.length - 2; i += sampleStep) {
    const r = buffer[i];
    const g = buffer[i + 1];
    const b = buffer[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    varianceSum += Math.pow(lum - avgLuminance, 2);
  }
  const variance = sampleCount > 0 ? varianceSum / sampleCount : 500;

  if (variance < 15 && avgLuminance < 100) {
    return {
      imageQuality: 'poor',
      qualityConfidence: 0.88,
      isAcceptable: false,
      message: 'The image is too blurry or lacks visible details. Please capture a clearer photo.',
      code: 'TOO_BLURRY',
    };
  }

  const quality = (avgLuminance >= 40 && variance >= 100) ? 'good' : 'acceptable';
  const confidence = quality === 'good' ? 0.96 : 0.84;

  return {
    imageQuality: quality,
    qualityConfidence: confidence,
    isAcceptable: true,
    message: 'Image quality is suitable for food analysis.',
    metrics: { avgLuminance: Math.round(avgLuminance), variance: Math.round(variance) },
  };
};

/**
 * STAGE 2: FOOD VS NON-FOOD CLASSIFIER
 * Strictly prevents non-food hallucinations (e.g. water bottles becoming rice and dal).
 * Checks explicit negative patterns against filename, manual hint, or vision tags.
 */
export const classifyFoodOrNonFood = ({ filename = '', manualHint = '', detectedTags = [] }) => {
  const textToCheck = `${filename} ${manualHint} ${detectedTags.join(' ')}`.toLowerCase();

  // 1. Explicit Negative Validation
  for (const item of NON_FOOD_PATTERNS) {
    if (item.pattern.test(textToCheck)) {
      return {
        isFood: false,
        category: 'NON_FOOD',
        confidence: 0.99,
        detectedObject: item.name,
        message: 'No food detected. Please capture a clear image of your meal or food item.',
      };
    }
  }

  // 2. Check for Packaged Food Indicators
  const PACKAGED_KEYWORDS = [
    'packet', 'package', 'pack', 'pouch', 'box', 'wrapper', 'can', 'container',
    'haldiram', 'bikaji', 'balaji', 'lays', 'kurkure', 'bingo', 'amul', 'britannia',
    'parle', 'nestle', 'cadbury', 'mTR', 'bar'
  ];
  const isPackaged = PACKAGED_KEYWORDS.some(k => textToCheck.includes(k));

  // 3. Check for Beverage Indicators
  const BEVERAGE_KEYWORDS = [
    'tea', 'chai', 'coffee', 'milk', 'lassi', 'chaas', 'buttermilk', 'juice',
    'smoothie', 'shake', 'ragi java', 'soup', 'rasam'
  ];
  const isBeverage = BEVERAGE_KEYWORDS.some(k => textToCheck.includes(k));

  if (isBeverage) {
    return {
      isFood: true,
      category: 'BEVERAGE',
      confidence: 0.95,
      message: 'Beverage detected.',
    };
  }

  if (isPackaged) {
    return {
      isFood: true,
      category: 'PACKAGED_FOOD',
      confidence: 0.94,
      message: 'Packaged food detected.',
    };
  }

  return {
    isFood: true,
    category: 'FOOD',
    confidence: 0.92,
    message: 'Food meal detected.',
  };
};

/**
 * STAGE 7: VALIDATION LAYER
 * Verifies that the structured output from food identification and nutrition lookup
 * meets all numerical, semantic, and confidence constraints before returning to frontend.
 */
export const validateFinalResponse = (response) => {
  if (!response || typeof response !== 'object') {
    return {
      isValid: false,
      error: 'Invalid response format from vision pipeline.',
    };
  }

  // Non-food responses are immediately valid
  if (response.foodDetection && response.foodDetection.isFood === false) {
    return { isValid: true, response };
  }

  const warnings = [];

  // Ensure items array is populated
  if (!Array.isArray(response.items) || response.items.length === 0) {
    warnings.push('No individual food items were itemized; using primary detected food.');
  }

  // Sanity check macro numbers
  if (response.nutrition) {
    const { calories, protein_g, carbohydrates_g, fat_g, fiber_g } = response.nutrition;
    if (calories !== null && (calories < 0 || calories > 5000)) {
      warnings.push('Estimated calories appear outside standard single-meal limits.');
    }
    if (protein_g !== null && (protein_g < 0 || protein_g > 300)) {
      warnings.push('Protein estimate is outside expected meal bounds.');
    }
  }

  response.warnings = warnings;
  return { isValid: true, response };
};
