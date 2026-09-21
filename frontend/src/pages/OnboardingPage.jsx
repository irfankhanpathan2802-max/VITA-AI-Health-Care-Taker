import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Activity,
  Moon,
  Clock,
  Utensils,
  Heart,
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { apiRequest } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { TagInput } from '../components/TagInput.jsx';

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [step, setStep] = useState(1);
  const totalSteps = 7;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.fullName || '',
    age: 28,
    gender: 'Male',
    heightCm: 172,
    weightKg: 70,
  });

  const [lifestyle, setLifestyle] = useState({
    workType: 'Desk job',
    workActivity: 'Mostly sitting',
    sittingDurationHours: 8,
    standingDurationHours: 2,
    screenTimeHours: 7,
    exerciseLevel: 'Lightly active',
    dailySteps: 5000,
  });

  const [sleep, setSleep] = useState({
    sleepTime: '23:00',
    wakeUpTime: '07:00',
    sleepDurationHours: 8,
    sleepConsistency: 'Mostly consistent',
  });

  const [mealRoutine, setMealRoutine] = useState({
    breakfastTime: '09:00',
    lunchTime: '13:30',
    snackTime: '17:00',
    dinnerTime: '20:30',
  });

  const [diet, setDiet] = useState({
    dietPreference: 'Vegetarian',
    foodPreferences: ['Ragi', 'Dal', 'Paneer', 'Sprouts', 'Fruits'],
    foodsDisliked: ['Bitter Gourd'],
    allergies: [],
  });

  const [healthInfo, setHealthInfo] = useState({
    healthConditions: [],
    medications: [],
  });

  const [goals, setGoals] = useState(['Better nutrition awareness', 'Improve protein intake']);

  // Available options
  const goalOptions = [
    'Better nutrition awareness',
    'Improve protein intake',
    'Improve food variety',
    'Healthy weight management',
    'Better hydration habits',
    'Better sleep routine',
    'More physical activity',
    'Build consistent meal habits',
    'General wellness',
  ];

  const toggleGoal = (goal) => {
    setGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const handleFinish = async () => {
    try {
      setIsSubmitting(true);
      const res = await apiRequest('/profile/onboarding', {
        method: 'POST',
        body: JSON.stringify({
          personalInfo,
          lifestyle: {
            ...lifestyle,
            ...sleep,
            mealRoutine,
            ...diet,
          },
          goals,
          healthInfo,
        }),
      });

      if (res.success) {
        updateUser({ isOnboarded: true });
        navigate('/dashboard');
      }
    } catch (err) {
      alert('Failed to save profile: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-[#F2F7F2] to-[#FBFBFA]">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center text-xs font-bold text-gray-500 mb-2">
            <span className="text-emerald-700 uppercase tracking-wider">Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}% Completed</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: PERSONAL INFORMATION */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                Step 1: Personal Information
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-2">Let's understand you better.</h2>
              <p className="text-xs text-gray-500 mt-1">
                Your age, height, and weight help us calculate personalized metabolic and nutrient targets.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Your Name</label>
                <input
                  type="text"
                  value={personalInfo.name}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Age</label>
                  <input
                    type="number"
                    min="12"
                    max="100"
                    value={personalInfo.age}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, age: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Biological Sex</label>
                  <select
                    value={personalInfo.gender}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium bg-gray-50"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    min="100"
                    max="250"
                    value={personalInfo.heightCm}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, heightCm: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    min="30"
                    max="250"
                    value={personalInfo.weightKg}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, weightKg: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: LIFESTYLE & WORK */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                Step 2: Work & Activity
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-2">Your Daily Routine</h2>
              <p className="text-xs text-gray-500 mt-1">
                How you spend your working hours directly influences your daily energy and movement requirements.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Work Type</label>
                <select
                  value={lifestyle.workType}
                  onChange={(e) => setLifestyle({ ...lifestyle, workType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium bg-gray-50"
                >
                  <option value="Desk job">Desk job</option>
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Driver">Driver</option>
                  <option value="Physically active worker">Physically active worker</option>
                  <option value="Homemaker">Homemaker</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Daily Work/Activity Pattern</label>
                <select
                  value={lifestyle.workActivity}
                  onChange={(e) => setLifestyle({ ...lifestyle, workActivity: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium bg-gray-50"
                >
                  <option value="Mostly sitting">Mostly sitting</option>
                  <option value="Mostly standing">Mostly standing</option>
                  <option value="Mixed">Mixed</option>
                  <option value="Physically active">Physically active</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Sitting (hrs/day)</label>
                  <input
                    type="number"
                    min="0"
                    max="18"
                    value={lifestyle.sittingDurationHours}
                    onChange={(e) => setLifestyle({ ...lifestyle, sittingDurationHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Standing (hrs/day)</label>
                  <input
                    type="number"
                    min="0"
                    max="18"
                    value={lifestyle.standingDurationHours}
                    onChange={(e) => setLifestyle({ ...lifestyle, standingDurationHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Screen Time (hrs)</label>
                  <input
                    type="number"
                    min="0"
                    max="18"
                    value={lifestyle.screenTimeHours}
                    onChange={(e) => setLifestyle({ ...lifestyle, screenTimeHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Exercise Level</label>
                  <select
                    value={lifestyle.exerciseLevel}
                    onChange={(e) => setLifestyle({ ...lifestyle, exerciseLevel: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium bg-gray-50"
                  >
                    <option value="Sedentary">Sedentary (little or no exercise)</option>
                    <option value="Lightly active">Lightly active (1-3 days/week)</option>
                    <option value="Moderately active">Moderately active (3-5 days/week)</option>
                    <option value="Very active">Very active (6-7 days/week)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Average Daily Steps</label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={lifestyle.dailySteps}
                    onChange={(e) => setLifestyle({ ...lifestyle, dailySteps: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SLEEP */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full">
                Step 3: Sleep Routine
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-2">Rest & Recovery</h2>
              <p className="text-xs text-gray-500 mt-1">
                Sleep regulates hormones that control hunger, satiety, and metabolic recovery.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Usual Sleep Time</label>
                  <input
                    type="time"
                    value={sleep.sleepTime}
                    onChange={(e) => setSleep({ ...sleep, sleepTime: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium bg-gray-50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Usual Wake-Up Time</label>
                  <input
                    type="time"
                    value={sleep.wakeUpTime}
                    onChange={(e) => setSleep({ ...sleep, wakeUpTime: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Average Sleep (Hours)</label>
                  <input
                    type="number"
                    min="3"
                    max="14"
                    step="0.5"
                    value={sleep.sleepDurationHours}
                    onChange={(e) => setSleep({ ...sleep, sleepDurationHours: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Sleep Consistency</label>
                  <select
                    value={sleep.sleepConsistency}
                    onChange={(e) => setSleep({ ...sleep, sleepConsistency: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium bg-gray-50"
                  >
                    <option value="Very consistent">Very consistent</option>
                    <option value="Mostly consistent">Mostly consistent</option>
                    <option value="Irregular">Irregular</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: MEAL ROUTINE */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full">
                Step 4: Meal Routine
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-2">When do you usually eat?</h2>
              <p className="text-xs text-gray-500 mt-1">
                Configured meal times power our polite reminders and missed meal notices.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Breakfast Time</label>
                <input
                  type="time"
                  value={mealRoutine.breakfastTime}
                  onChange={(e) => setMealRoutine({ ...mealRoutine, breakfastTime: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium bg-gray-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Lunch Time</label>
                <input
                  type="time"
                  value={mealRoutine.lunchTime}
                  onChange={(e) => setMealRoutine({ ...mealRoutine, lunchTime: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium bg-gray-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Snack Time</label>
                <input
                  type="time"
                  value={mealRoutine.snackTime}
                  onChange={(e) => setMealRoutine({ ...mealRoutine, snackTime: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium bg-gray-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Dinner Time</label>
                <input
                  type="time"
                  value={mealRoutine.dinnerTime}
                  onChange={(e) => setMealRoutine({ ...mealRoutine, dinnerTime: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium bg-gray-50"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: DIET & ALLERGIES */}
        {step === 5 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                Step 5: Dietary Preferences
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-2">Food Preferences & Diet</h2>
              <p className="text-xs text-gray-500 mt-1">
                Tailors food suggestions and VitaCare Store product matches to your diet.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Dietary Preference</label>
                <select
                  value={diet.dietPreference}
                  onChange={(e) => setDiet({ ...diet, dietPreference: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium bg-gray-50"
                >
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-vegetarian">Non-vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Allergies or Intolerances</label>
                <TagInput
                  tags={diet.allergies}
                  onChange={(newTags) => setDiet({ ...diet, allergies: newTags })}
                  placeholder="Type allergy (e.g. Peanuts, Gluten) and press comma..."
                />
                <span className="text-[11px] text-gray-400 mt-1 block">Type items and press comma (,) or Enter. Spaces are fully supported.</span>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Foods You Dislike</label>
                <TagInput
                  tags={diet.foodsDisliked}
                  onChange={(newTags) => setDiet({ ...diet, foodsDisliked: newTags })}
                  placeholder="Type food (e.g. Bitter Gourd, Mushrooms) and press comma..."
                />
                <span className="text-[11px] text-gray-400 mt-1 block">Type items like "Bitter Gourd" and press comma (,) or Enter.</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: HEALTH INFORMATION (VOLUNTARY) */}
        {step === 6 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full">
                Step 6: Health Information (Voluntary)
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-2">Health Background</h2>
              <p className="text-xs text-gray-500 mt-1">
                You may voluntarily provide any relevant health background to refine your wellness suggestions.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900 leading-relaxed">
                <span className="font-bold block">Important Notice:</span>
                VitaCare does not diagnose, treat, or infer medical conditions. If health conditions affect your nutrition, please seek advice from a licensed medical professional or registered dietitian.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Health Conditions (Voluntary)
                </label>
                <TagInput
                  tags={healthInfo.healthConditions}
                  onChange={(newTags) => setHealthInfo({ ...healthInfo, healthConditions: newTags })}
                  placeholder="e.g. Hypertension, Diabetes (type and press comma)..."
                />
                <span className="text-[11px] text-gray-400 mt-1 block">Type items and press comma (,) or Enter. Spaces supported.</span>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Current Medications (Voluntary)
                </label>
                <TagInput
                  tags={healthInfo.medications}
                  onChange={(newTags) => setHealthInfo({ ...healthInfo, medications: newTags })}
                  placeholder="e.g. Multivitamin, Omega-3 (type and press comma)..."
                />
                <span className="text-[11px] text-gray-400 mt-1 block">Type items and press comma (,) or Enter.</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: USER GOALS */}
        {step === 7 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                Step 7: Focus Goals
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-2">What do you want to focus on?</h2>
              <p className="text-xs text-gray-500 mt-1">
                Select one or more realistic wellness focus areas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {goalOptions.map((g, idx) => {
                const selected = goals.includes(g);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleGoal(g)}
                    className={`p-3.5 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                      selected
                        ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 shadow-xs'
                        : 'border-gray-200 bg-gray-50/50 text-gray-700 hover:bg-gray-100/60'
                    }`}
                  >
                    <span>{g}</span>
                    {selected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div></div>
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all hover:scale-105"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 disabled:opacity-50"
            >
              {isSubmitting ? 'Calculating Targets...' : 'Complete Profile & View Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
