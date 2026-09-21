/**
 * VitaCare Concierge & Enquiry AI Service
 * Dedicated assistant for user enquiries regarding VitaCare platform features,
 * subscriptions, food marketplace sourcing, delivery schedules, privacy, and health guidelines.
 */

const ENQUIRY_KNOWLEDGE_BASE = [
  {
    topic: 'subscriptions',
    keywords: ['subscription', 'plan', 'monthly', 'weekly', 'box', 'pause', 'cancel', 'delivery schedule'],
    answer:
      'VitaCare offers customizable healthy-food subscriptions (Weekly & Monthly) across categories like High Protein, Balanced Nutrition, and Fresh Breakfast. You can pause, adjust delivery dates, or customize items anytime from the Subscriptions page with no lock-in.',
    actionLink: '/subscriptions',
    actionText: 'Manage Subscriptions',
  },
  {
    topic: 'food_sourcing',
    keywords: ['source', 'sourcing', 'fresh', 'organic', 'quality', 'store', 'market', 'where do you get'],
    answer:
      'All VitaCare Market products are sourced from certified organic farms, certified dairy cooperatives, and verified whole-food partners. We strictly ban artificial preservatives, refined palm oils, and synthetic fillers.',
    actionLink: '/store',
    actionText: 'Browse VitaCare Store',
  },
  {
    topic: 'protein_calculation',
    keywords: ['protein', 'target', 'calculate', 'formula', 'how much protein', 'grams'],
    answer:
      'Your daily protein target is calculated using scientific baseline metrics (Mifflin-St Jeor) adjusted for your weight, activity level, and focus goals. For active or protein-focused goals, we target 1.4g to 1.6g of protein per kg of body weight.',
    actionLink: '/profile',
    actionText: 'View My Targets',
  },
  {
    topic: 'camera_scanner',
    keywords: ['camera', 'photo', 'scanner', 'detection', 'food not detected', 'vision'],
    answer:
      'Our AI Camera Scanner inspects meals for authentic food presence and rejects non-food items (desks, phones, chairs). You can capture live snapshots with your webcam or phone camera, upload device files/folders, or paste Google Drive image links.',
    actionLink: '/dashboard',
    actionText: 'Open Food Scanner',
  },
  {
    topic: 'missed_meals',
    keywords: ['missed', 'missed meal', 'compensation', 'shortfall', 'skip breakfast', 'skipped'],
    answer:
      'When a meal is missed, VitaCare calculates your estimated macronutrient shortfall (e.g. ~20g protein for breakfast) and suggests practical whole-food compensations or ready-to-eat items from Vita Market so you stay on track without crash dieting.',
    actionLink: '/store?category=HIGH+PROTEIN',
    actionText: 'High Protein Store',
  },
  {
    topic: 'medical_disclaimer',
    keywords: ['medical', 'doctor', 'treatment', 'cure', 'disease', 'diagnosis', 'prescribe'],
    answer:
      'Important Notice: VitaCare is an AI-powered preventive wellness platform. We do not diagnose, treat, or prescribe medication for medical conditions. For clinical conditions or medical dietary restrictions, always consult a licensed physician or registered dietitian.',
    actionLink: null,
    actionText: null,
  },
  {
    topic: 'contact_support',
    keywords: ['support', 'help', 'contact', 'customer care', 'email', 'phone'],
    answer:
      'Our customer care team is available 7 days a week from 8:00 AM to 8:00 PM IST. You can reach us at care@vitacare.health or call 1800-VITA-CARE for any order or account assistance.',
    actionLink: null,
    actionText: null,
  },
];

export const answerUserEnquiry = async ({ enquiry = '' }) => {
  if (!enquiry || typeof enquiry !== 'string' || enquiry.trim().length === 0) {
    return {
      success: false,
      message: 'Please provide an enquiry message.',
    };
  }

  const query = enquiry.toLowerCase().trim();

  // Search knowledge base for best keyword match
  let bestMatch = null;
  let highestScore = 0;

  for (const item of ENQUIRY_KNOWLEDGE_BASE) {
    let score = 0;
    for (const keyword of item.keywords) {
      if (query.includes(keyword)) {
        score += keyword.length;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && highestScore > 0) {
    return {
      success: true,
      enquiry,
      topic: bestMatch.topic,
      answer: bestMatch.answer,
      actionLink: bestMatch.actionLink,
      actionText: bestMatch.actionText,
      confidence: 'high',
    };
  }

  // General fallback response
  return {
    success: true,
    enquiry,
    topic: 'general_assistance',
    answer: `Thank you for your enquiry regarding "${enquiry}". VitaCare is your dedicated preventive health companion. You can track daily meals via Camera, Voice, or Manual logging, monitor lifestyle habits, configure reminders, and explore our verified Healthy Food Market. If you have a specific question about your account or subscriptions, please let us know!`,
    actionLink: '/store',
    actionText: 'Explore VitaCare Store',
    confidence: 'standard',
  };
};
