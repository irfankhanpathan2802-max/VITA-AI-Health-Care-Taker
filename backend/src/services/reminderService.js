/**
 * Evaluates current time and logged meals against configured meal routine
 * to detect unlogged meals with polite, non-assuming wording.
 */
export const checkMissedMeals = (lifestyle = {}, loggedMeals = [], targets = {}) => {
  const routine = lifestyle.mealRoutine || {
    breakfastTime: '09:00',
    lunchTime: '13:30',
    snackTime: '17:00',
    dinnerTime: '20:30',
  };

  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeMinutes = currentHours * 60 + currentMinutes;

  const parseTimeToMinutes = (timeStr = '00:00') => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const loggedTypes = new Set(loggedMeals.map(m => m.mealType));
  const notices = [];

  const dailyProteinTarget = targets?.proteinGrams || 70;

  // Breakfast check (30 mins after scheduled breakfast)
  const breakfastMin = parseTimeToMinutes(routine.breakfastTime);
  if (currentTimeMinutes >= breakfastMin + 30 && !loggedTypes.has('breakfast')) {
    const missedProtein = Math.round(dailyProteinTarget * 0.25) || 20;
    notices.push({
      mealType: 'breakfast',
      message: 'You missed breakfast today!',
      subtext: `You have an estimated shortfall of ~${missedProtein}g protein today. Instead, you can take this missed protein via high-protein snacks or order healthy breakfast & protein items directly from Vita Market.`,
      missedProteinGrams: missedProtein,
      scheduledTime: routine.breakfastTime,
      storeLink: '/store?category=HIGH+PROTEIN',
      storeActionText: 'Order from Vita Market',
      suggestedCompensation: 'Sprouted Moong Salad, Boiled Eggs, or Greek Yogurt',
    });
  }

  // Lunch check (30 mins after scheduled lunch)
  const lunchMin = parseTimeToMinutes(routine.lunchTime);
  if (currentTimeMinutes >= lunchMin + 30 && !loggedTypes.has('lunch')) {
    const missedProtein = Math.round(dailyProteinTarget * 0.35) || 28;
    notices.push({
      mealType: 'lunch',
      message: 'Lunch has not been logged yet.',
      subtext: `You have an estimated shortfall of ~${missedProtein}g protein. Compensate with high-protein afternoon snacks or explore ready-to-eat meals from Vita Market.`,
      missedProteinGrams: missedProtein,
      scheduledTime: routine.lunchTime,
      storeLink: '/store?category=HIGH+PROTEIN',
      storeActionText: 'Order from Vita Market',
      suggestedCompensation: 'Paneer, Grilled Chicken, Tofu, or Dal Khichdi',
    });
  }

  // Dinner check (30 mins after scheduled dinner)
  const dinnerMin = parseTimeToMinutes(routine.dinnerTime);
  if (currentTimeMinutes >= dinnerMin + 30 && !loggedTypes.has('dinner')) {
    const missedProtein = Math.round(dailyProteinTarget * 0.30) || 24;
    notices.push({
      mealType: 'dinner',
      message: 'Dinner has not been logged.',
      subtext: `Complete your day by logging dinner, or compensate with ~${missedProtein}g light bedtime protein.`,
      missedProteinGrams: missedProtein,
      scheduledTime: routine.dinnerTime,
      storeLink: '/store?category=HEALTHY+READY-TO-EAT',
      storeActionText: 'Order from Vita Market',
      suggestedCompensation: 'Warm Milk, Almonds, or a Light Protein Salad',
    });
  }

  return notices;
};

export const getDefaultReminders = (userId) => [
  { userId, type: 'breakfast', title: 'Breakfast Logging Reminder', time: '09:30', enabled: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { userId, type: 'lunch', title: 'Lunch Logging Reminder', time: '14:00', enabled: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { userId, type: 'snack', title: 'Snack Logging Reminder', time: '17:30', enabled: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { userId, type: 'dinner', title: 'Dinner Logging Reminder', time: '21:00', enabled: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { userId, type: 'hydration', title: 'Hydration Break', time: '11:00', enabled: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { userId, type: 'movement', title: 'Posture & Movement Break', time: '15:00', enabled: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  { userId, type: 'screen', title: 'Screen Eye-Rest Interval', time: '16:00', enabled: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  { userId, type: 'sleep', title: 'Wind-Down for Sleep', time: '22:15', enabled: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
];
