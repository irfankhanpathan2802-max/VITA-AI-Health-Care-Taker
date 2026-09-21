import React, { useState, useEffect } from 'react';
import { User, Activity, Moon, Clock, Utensils, Heart, Check, Save, ShieldAlert } from 'lucide-react';
import { apiRequest } from '../services/api.js';
import { TagInput } from '../components/TagInput.jsx';

export const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [lifestyle, setLifestyle] = useState(null);
  const [targets, setTargets] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiRequest('/profile');
        if (res.success) {
          setProfile(res.profile || {});
          setLifestyle(res.lifestyle || {});
          setTargets(res.targets || {});
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const [pRes, lRes] = await Promise.all([
        apiRequest('/profile/profile', {
          method: 'PUT',
          body: JSON.stringify(profile),
        }),
        apiRequest('/profile/lifestyle', {
          method: 'PUT',
          body: JSON.stringify(lifestyle),
        }),
      ]);

      if (pRes.success || lRes.success) {
        if (pRes.targets) setTargets(pRes.targets);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile || !lifestyle) {
    return <div className="p-8 text-center text-xs text-gray-500">Loading your profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
          My Health & Lifestyle Profile
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Updating your metrics automatically recalculates your personalized daily nutrition targets.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          Profile updated successfully. Your daily targets have been refreshed.
        </div>
      )}

      {/* Recalculated Targets Banner */}
      {targets && (
        <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-white/10 px-2.5 py-0.5 rounded-full">
            Active Targets (Personalized Guidance)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4 text-center">
            <div className="bg-white/10 p-3 rounded-2xl">
              <span className="text-[10px] text-emerald-200 block uppercase">Calories</span>
              <span className="text-lg font-extrabold">{targets.calories} kcal</span>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl">
              <span className="text-[10px] text-emerald-200 block uppercase">Protein</span>
              <span className="text-lg font-extrabold">{targets.proteinGrams}g</span>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl">
              <span className="text-[10px] text-emerald-200 block uppercase">Carbs</span>
              <span className="text-lg font-extrabold">{targets.carbsGrams}g</span>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl">
              <span className="text-[10px] text-emerald-200 block uppercase">Fats</span>
              <span className="text-lg font-extrabold">{targets.fatsGrams}g</span>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl">
              <span className="text-[10px] text-emerald-200 block uppercase">Water</span>
              <span className="text-lg font-extrabold">{targets.waterMl}ml</span>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            Personal Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Age</label>
              <input
                type="number"
                value={profile.age || 28}
                onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Height (cm)</label>
              <input
                type="number"
                value={profile.heightCm || 170}
                onChange={(e) => setProfile({ ...profile, heightCm: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Weight (kg)</label>
              <input
                type="number"
                value={profile.weightKg || 70}
                onChange={(e) => setProfile({ ...profile, weightKg: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium"
              />
            </div>
          </div>
        </div>

        {/* Lifestyle & Work */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            Work & Activity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Daily Sitting (hrs)</label>
              <input
                type="number"
                value={lifestyle.sittingDurationHours || 8}
                onChange={(e) => setLifestyle({ ...lifestyle, sittingDurationHours: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Daily Standing (hrs)</label>
              <input
                type="number"
                value={lifestyle.standingDurationHours || 2}
                onChange={(e) => setLifestyle({ ...lifestyle, standingDurationHours: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Screen Time (hrs)</label>
              <input
                type="number"
                value={lifestyle.screenTimeHours || 7}
                onChange={(e) => setLifestyle({ ...lifestyle, screenTimeHours: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium"
              />
            </div>
          </div>
        </div>

        {/* Meal Timings */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            Meal Routine Timings
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Breakfast</label>
              <input
                type="time"
                value={lifestyle.mealRoutine?.breakfastTime || '09:00'}
                onChange={(e) => setLifestyle({
                  ...lifestyle,
                  mealRoutine: { ...lifestyle.mealRoutine, breakfastTime: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Lunch</label>
              <input
                type="time"
                value={lifestyle.mealRoutine?.lunchTime || '13:30'}
                onChange={(e) => setLifestyle({
                  ...lifestyle,
                  mealRoutine: { ...lifestyle.mealRoutine, lunchTime: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Snack</label>
              <input
                type="time"
                value={lifestyle.mealRoutine?.snackTime || '17:00'}
                onChange={(e) => setLifestyle({
                  ...lifestyle,
                  mealRoutine: { ...lifestyle.mealRoutine, snackTime: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Dinner</label>
              <input
                type="time"
                value={lifestyle.mealRoutine?.dinnerTime || '20:30'}
                onChange={(e) => setLifestyle({
                  ...lifestyle,
                  mealRoutine: { ...lifestyle.mealRoutine, dinnerTime: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium"
              />
            </div>
          </div>
        </div>

        {/* Dietary Preferences & Dislikes */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-emerald-600" />
            Dietary Preferences & Dislikes
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Diet Type</label>
              <select
                value={lifestyle.dietPreference || 'Vegetarian'}
                onChange={(e) => setLifestyle({ ...lifestyle, dietPreference: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium bg-gray-50"
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-vegetarian">Non-vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Foods You Dislike</label>
              <TagInput
                tags={lifestyle.foodsDisliked || []}
                onChange={(newTags) => setLifestyle({ ...lifestyle, foodsDisliked: newTags })}
                placeholder="e.g. Bitter Gourd, Mushrooms (press comma)..."
              />
              <span className="text-[11px] text-gray-400 mt-1 block">Type items like "Bitter Gourd" with spaces and press comma (,) or Enter.</span>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Allergies & Intolerances</label>
              <TagInput
                tags={lifestyle.allergies || []}
                onChange={(newTags) => setLifestyle({ ...lifestyle, allergies: newTags })}
                placeholder="e.g. Peanuts, Gluten (press comma)..."
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Updating Profile & Targets...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
};
