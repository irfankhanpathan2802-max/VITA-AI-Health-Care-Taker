/**
 * Evaluates lifestyle metrics and generates preventive wellness guidance.
 * Strictly adheres to non-diagnostic, preventive healthcare rules.
 */
export const analyzeLifestyle = (lifestyle = {}, profile = {}) => {
  const recommendations = [];

  const sittingHours = Number(lifestyle.sittingDurationHours) || 8;
  const standingHours = Number(lifestyle.standingDurationHours) || 2;
  const screenTime = Number(lifestyle.screenTimeHours) || 7;
  const sleepDuration = Number(lifestyle.sleepDurationHours) || 7;
  const workType = lifestyle.workType || 'Desk job';

  // 1. Sitting vs Standing ergonomics
  if (sittingHours >= 7) {
    recommendations.push({
      category: 'Movement & Ergonomics',
      title: 'Prolonged Sitting Interval Notice',
      observation: `Your work routine involves approximately ${sittingHours} hours of sitting daily.`,
      suggestion: 'Incorporate 2-3 minute standing or walking breaks every 45-60 minutes to promote circulation and reduce postural fatigue.',
      icon: 'Activity',
      priority: 'high'
    });
  }

  // 2. Screen Time
  if (screenTime >= 6) {
    recommendations.push({
      category: 'Visual & Mental Wellness',
      title: 'Digital Screen Strain Management',
      observation: `You logged an average of ${screenTime} hours of daily screen time.`,
      suggestion: 'Practice the 20-20-20 rule: every 20 minutes, shift your eyes to an object 20 feet away for at least 20 seconds.',
      icon: 'Eye',
      priority: 'medium'
    });
  }

  // 3. Sleep Routine
  if (sleepDuration < 7) {
    recommendations.push({
      category: 'Rest & Recovery',
      title: 'Sleep Duration Awareness',
      observation: `Logged sleep average is ${sleepDuration} hours, which is below the recommended 7-9 hour range.`,
      suggestion: 'Gradually adjust your evening wind-down routine by dimming lights 45 minutes prior to sleep and maintaining consistent sleep and wake-up times.',
      icon: 'Moon',
      priority: 'high'
    });
  } else if (sleepDuration >= 7 && sleepDuration <= 9) {
    recommendations.push({
      category: 'Rest & Recovery',
      title: 'Healthy Sleep Range',
      observation: `Your logged sleep duration (${sleepDuration} hours) aligns well with standard recovery guidelines.`,
      suggestion: 'Keep your sleep and wake schedule consistent even on weekends to support natural circadian rhythms.',
      icon: 'CheckCircle',
      priority: 'low'
    });
  }

  // 4. Meal Timings
  const routine = lifestyle.mealRoutine || {};
  if (routine.breakfastTime && routine.lunchTime && routine.dinnerTime) {
    recommendations.push({
      category: 'Nutritional Rhythm',
      title: 'Consistent Meal Scheduling',
      observation: `Scheduled routine: Breakfast at ${routine.breakfastTime}, Lunch at ${routine.lunchTime}, Dinner at ${routine.dinnerTime}.`,
      suggestion: 'Eating within consistent time windows supports digestive efficiency and stable energy levels throughout your work day.',
      icon: 'Clock',
      priority: 'medium'
    });
  }

  return {
    summary: `Lifestyle profile indicates a ${workType} routine with ${sittingHours}h sitting and ${screenTime}h screen exposure.`,
    recommendations,
    disclaimer: 'Guidance is for preventive wellness and educational purposes only. It is not intended as medical advice or diagnosis.'
  };
};
