import { User, Profile, Lifestyle, NutritionTarget, Reminder } from '../models/index.js';
import { calculateNutritionTargets } from '../services/nutritionEngine.js';
import { getDefaultReminders } from '../services/reminderService.js';

export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const [profile, lifestyle, targets] = await Promise.all([
      Profile.findOne({ userId }),
      Lifestyle.findOne({ userId }),
      NutritionTarget.findOne({ userId }),
    ]);

    return res.json({
      success: true,
      profile: profile || null,
      lifestyle: lifestyle || null,
      targets: targets || null,
    });
  } catch (error) {
    console.error('getProfile error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve profile data.' });
  }
};

export const completeOnboarding = async (req, res) => {
  try {
    const userId = req.user._id;
    const { personalInfo, lifestyle, goals, healthInfo } = req.body;

    // 1. Create or update Profile
    const profile = await Profile.findOneAndUpdate(
      { userId },
      {
        userId,
        name: personalInfo?.name || req.user.fullName,
        age: Number(personalInfo?.age) || 28,
        gender: personalInfo?.gender || 'Male',
        heightCm: Number(personalInfo?.heightCm) || 170,
        weightKg: Number(personalInfo?.weightKg) || 68,
        goals: goals || ['Better nutrition awareness'],
        healthConditions: healthInfo?.healthConditions || [],
        medications: healthInfo?.medications || [],
      },
      { upsert: true, new: true }
    );

    // 2. Create or update Lifestyle
    const userLifestyle = await Lifestyle.findOneAndUpdate(
      { userId },
      {
        userId,
        workType: lifestyle?.workType || 'Desk job',
        workActivity: lifestyle?.workActivity || 'Mostly sitting',
        sittingDurationHours: Number(lifestyle?.sittingDurationHours) || 8,
        standingDurationHours: Number(lifestyle?.standingDurationHours) || 2,
        screenTimeHours: Number(lifestyle?.screenTimeHours) || 7,
        exerciseLevel: lifestyle?.exerciseLevel || 'Sedentary',
        dailySteps: Number(lifestyle?.dailySteps) || 0,
        sleepTime: lifestyle?.sleepTime || '23:00',
        wakeUpTime: lifestyle?.wakeUpTime || '07:00',
        sleepDurationHours: Number(lifestyle?.sleepDurationHours) || 8,
        sleepConsistency: lifestyle?.sleepConsistency || 'Mostly consistent',
        mealRoutine: {
          breakfastTime: lifestyle?.mealRoutine?.breakfastTime || '09:00',
          lunchTime: lifestyle?.mealRoutine?.lunchTime || '13:30',
          snackTime: lifestyle?.mealRoutine?.snackTime || '17:00',
          dinnerTime: lifestyle?.mealRoutine?.dinnerTime || '20:30',
        },
        dietPreference: lifestyle?.dietPreference || 'Vegetarian',
        foodPreferences: lifestyle?.foodPreferences || [],
        foodsDisliked: lifestyle?.foodsDisliked || [],
        allergies: lifestyle?.allergies || [],
      },
      { upsert: true, new: true }
    );

    // 3. Compute personalized nutrition targets
    const targetsData = calculateNutritionTargets(profile, userLifestyle);
    const targets = await NutritionTarget.findOneAndUpdate(
      { userId },
      { userId, ...targetsData },
      { upsert: true, new: true }
    );

    // 4. Create default reminders
    const defaultReminders = getDefaultReminders(userId);
    for (const r of defaultReminders) {
      await Reminder.findOneAndUpdate(
        { userId, type: r.type },
        r,
        { upsert: true }
      );
    }

    // 5. Update user isOnboarded flag
    await User.findByIdAndUpdate(userId, { isOnboarded: true });

    return res.status(200).json({
      success: true,
      message: 'Onboarding complete! Your personalized wellness profile has been configured.',
      profile,
      lifestyle: userLifestyle,
      targets,
    });
  } catch (error) {
    console.error('completeOnboarding error:', error);
    return res.status(500).json({ success: false, message: 'Failed to complete onboarding. Please try again.' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, age, gender, heightCm, weightKg, goals, healthConditions, medications } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { userId },
      {
        name,
        age: Number(age),
        gender,
        heightCm: Number(heightCm),
        weightKg: Number(weightKg),
        goals,
        healthConditions,
        medications,
      },
      { new: true, upsert: true }
    );

    const lifestyle = await Lifestyle.findOne({ userId });
    const targetsData = calculateNutritionTargets(profile, lifestyle || {});
    const targets = await NutritionTarget.findOneAndUpdate(
      { userId },
      { userId, ...targetsData },
      { new: true, upsert: true }
    );

    return res.json({
      success: true,
      message: 'Profile updated successfully. Nutrition targets have been recalculated.',
      profile,
      targets,
    });
  } catch (error) {
    console.error('updateProfile error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

export const updateLifestyle = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = req.body;

    const lifestyle = await Lifestyle.findOneAndUpdate(
      { userId },
      { ...updateData },
      { new: true, upsert: true }
    );

    const profile = await Profile.findOne({ userId });
    const targetsData = calculateNutritionTargets(profile || {}, lifestyle);
    const targets = await NutritionTarget.findOneAndUpdate(
      { userId },
      { userId, ...targetsData },
      { new: true, upsert: true }
    );

    return res.json({
      success: true,
      message: 'Lifestyle settings updated successfully.',
      lifestyle,
      targets,
    });
  } catch (error) {
    console.error('updateLifestyle error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update lifestyle profile.' });
  }
};
