import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Droplets,
  Calendar,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  RefreshCw,
  Sun,
  Moon,
  Sunrise,
  Camera,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiRequest } from '../services/api.js';
import { NutritionSummaryCard } from '../components/NutritionSummaryCard.jsx';
import { MealCard } from '../components/MealCard.jsx';
import { AddMealModal } from '../components/AddMealModal.jsx';
import { CameraFoodModal } from '../components/CameraFoodModal.jsx';
import { VoiceMealModal } from '../components/VoiceMealModal.jsx';
import { ManualMealModal } from '../components/ManualMealModal.jsx';
import { AfternoonAlertBanner } from '../components/AfternoonAlertBanner.jsx';
import { MissedMealBanner } from '../components/MissedMealBanner.jsx';

export const DashboardPage = () => {
  const { user } = useAuth();

  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [meals, setMeals] = useState([]);
  const [totalNutrition, setTotalNutrition] = useState(null);
  const [target, setTarget] = useState(null);
  const [waterLoggedMl, setWaterLoggedMl] = useState(0);
  const [afternoonAlert, setAfternoonAlert] = useState(null);
  const [missedMealNotices, setMissedMealNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState('breakfast');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      const [mealsRes, waterRes, alertRes, missedRes] = await Promise.all([
        apiRequest(`/meals?date=${dateStr}`),
        apiRequest(`/lifestyle/water?date=${dateStr}`),
        apiRequest('/ai/afternoon-alert'),
        apiRequest('/reminders/missed-meals'),
      ]);

      if (mealsRes.success) {
        setMeals(mealsRes.meals || []);
        setTotalNutrition(mealsRes.totalNutrition || null);
        setTarget(mealsRes.target || null);
      }

      if (waterRes.success) {
        setWaterLoggedMl(waterRes.totalWaterMl || 0);
      }

      if (alertRes.success) {
        setAfternoonAlert(alertRes.alert || null);
      }

      if (missedRes.success) {
        setMissedMealNotices(missedRes.notices || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateStr]);

  const handleOpenAddMeal = (type = 'breakfast') => {
    setActiveMealType(type);
    setIsAddMealOpen(true);
  };

  const handleSelectMethod = (method, type) => {
    setIsAddMealOpen(false);
    setActiveMealType(type);
    if (method === 'camera') setIsCameraOpen(true);
    else if (method === 'voice') setIsVoiceOpen(true);
    else if (method === 'manual') setIsManualOpen(true);
  };

  const handleDeleteMeal = async (mealId) => {
    if (!window.confirm('Are you sure you want to remove this logged meal?')) return;
    try {
      const res = await apiRequest(`/meals/${mealId}`, { method: 'DELETE' });
      if (res.success) {
        fetchDashboardData();
      }
    } catch (err) {
      alert('Failed to delete meal: ' + err.message);
    }
  };

  const handleLogWater = async (amount = 250) => {
    try {
      const res = await apiRequest('/lifestyle/water', {
        method: 'POST',
        body: JSON.stringify({ amountMl: amount, date: dateStr }),
      });
      if (res.success) {
        setWaterLoggedMl(res.totalWaterMl);
      }
    } catch (err) {
      console.error('Failed to log water:', err);
    }
  };

  const handleRolloverProtein = async (mealType, proteinGrams = 20) => {
    try {
      const res = await apiRequest('/reminders/rollover-missed', {
        method: 'POST',
        body: JSON.stringify({ mealType, proteinGrams }),
      });
      if (res.success) {
        alert(res.message || `Added ${proteinGrams}g missed protein to tomorrow's daily target!`);
        fetchDashboardData();
      }
    } catch (err) {
      alert('Failed to rollover protein: ' + err.message);
    }
  };

  // Greeting
  const currentHour = new Date().getHours();
  let greeting = 'Good morning';
  let GreetingIcon = Sunrise;
  if (currentHour >= 12 && currentHour < 17) {
    greeting = 'Good afternoon';
    GreetingIcon = Sun;
  } else if (currentHour >= 17) {
    greeting = 'Good evening';
    GreetingIcon = Moon;
  }

  // Find meals by type
  const breakfastMeal = meals.find(m => m.mealType === 'breakfast');
  const lunchMeal = meals.find(m => m.mealType === 'lunch');
  const snacksMeal = meals.find(m => m.mealType === 'snacks');
  const dinnerMeal = meals.find(m => m.mealType === 'dinner');

  // Overnight / Next-Day Check (after 8 PM, if calories/protein are significantly below target)
  const isNightTime = currentHour >= 20;
  const isBelowTarget = totalNutrition && target && (totalNutrition.proteinGrams < (target.proteinGrams * 0.7));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full max-w-max border border-emerald-200">
            <GreetingIcon className="w-3.5 h-3.5" />
            <span>{greeting}, {user?.fullName || 'Rahul'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-2 tracking-tight">
            Your Daily Wellness Overview
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {meals.length === 0
              ? 'No meals logged yet today. Add your first meal to start tracking.'
              : `${meals.length} meal(s) logged for today.`}
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Date Selector */}
          <input
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white shadow-xs"
          />

          {/* Instant Camera Scan CTA */}
          <button
            onClick={() => {
              setActiveMealType('lunch');
              setIsCameraOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gray-950 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.02] whitespace-nowrap"
            title="Instantly open camera to scan food"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            Scan Food
          </button>

          {/* Add Meal CTA */}
          <button
            onClick={() => handleOpenAddMeal('breakfast')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            + ADD MEAL
          </button>
        </div>
      </div>

      {/* 1. FOUR MAIN MEAL SLOTS AT TOP: Breakfast, Lunch, Snack, Dinner */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-black text-gray-950 tracking-tight">Today's Meals</h2>
            <p className="text-xs text-gray-500">
              Log or order your meals. Fill breakfast, lunch, snack, and dinner to track today's nutrition.
            </p>
          </div>

          <button
            onClick={() => handleOpenAddMeal('breakfast')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Log Another Meal
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MealCard
            mealType="breakfast"
            meal={breakfastMeal}
            onAddMeal={handleOpenAddMeal}
            onDeleteMeal={handleDeleteMeal}
            onRolloverProtein={handleRolloverProtein}
          />
          <MealCard
            mealType="lunch"
            meal={lunchMeal}
            onAddMeal={handleOpenAddMeal}
            onDeleteMeal={handleDeleteMeal}
            onRolloverProtein={handleRolloverProtein}
          />
          <MealCard
            mealType="snacks"
            meal={snacksMeal}
            onAddMeal={handleOpenAddMeal}
            onDeleteMeal={handleDeleteMeal}
            onRolloverProtein={handleRolloverProtein}
          />
          <MealCard
            mealType="dinner"
            meal={dinnerMeal}
            onAddMeal={handleOpenAddMeal}
            onDeleteMeal={handleDeleteMeal}
            onRolloverProtein={handleRolloverProtein}
          />
        </div>
      </div>

      {/* 2. Nutrients You Should Take Today */}
      <NutritionSummaryCard
        totalNutrition={totalNutrition}
        target={target}
        waterLoggedMl={waterLoggedMl}
        hasMeals={meals.length > 0}
      />

      {/* Afternoon Nutrition Alert (contextual only) */}
      {afternoonAlert && <AfternoonAlertBanner alertData={afternoonAlert} />}

      {/* Quick Hydration & Lifestyle Logging Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Quick Water Log */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-gray-900">Quick Water Intake</h4>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Logged today: <span className="font-bold text-gray-800">{waterLoggedMl} ml</span>
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleLogWater(250)}
              className="flex-1 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200 transition-colors"
            >
              +250ml Glass
            </button>
            <button
              onClick={() => handleLogWater(500)}
              className="flex-1 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200 transition-colors"
            >
              +500ml Bottle
            </button>
          </div>
        </div>

        {/* Tomorrow's Plan Card */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-3xl p-6 border border-emerald-200/60 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-gray-900">Tomorrow's Nutrition Plan</h4>
            </div>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Personalized food suggestions for tomorrow based on today's logged intake and your focus goals.
            </p>
          </div>

          <Link
            to="/tomorrow-plan"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
          >
            <span>View Tomorrow's Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* AI Wellness Coach Teaser */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-gray-900">Ask VitaCare AI Coach</h4>
            </div>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Have questions about your meals, protein progress, or fiber intake? Chat with your AI coach.
            </p>
          </div>

          <Link
            to="/coach"
            className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200 transition-colors flex items-center justify-center gap-1"
          >
            <span>Open AI Coach</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 24. OVERNIGHT / NEXT-DAY FOOD OPTION */}
      {isNightTime && isBelowTarget && (
        <div className="bg-gray-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-800/60">
              Evening Wellness Notice
            </span>
            <h3 className="text-lg font-bold text-white mt-2">
              Your logged nutrition today was below your estimated target.
            </h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Never compensate aggressively or overconsume at night. Instead, plan balanced, protein-rich meals for tomorrow to maintain steady consistency.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Link
              to="/tomorrow-plan"
              className="px-5 py-2.5 rounded-xl bg-white text-gray-900 text-xs font-bold hover:bg-gray-100 transition-colors"
            >
              PLAN TOMORROW
            </Link>
            <Link
              to="/store"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              VIEW VITACARE STORE
            </Link>
          </div>
        </div>
      )}

      {/* MODALS */}
      <AddMealModal
        isOpen={isAddMealOpen}
        onClose={() => setIsAddMealOpen(false)}
        onSelectMethod={handleSelectMethod}
        initialMealType={activeMealType}
      />

      <CameraFoodModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        mealType={activeMealType}
        onMealSaved={() => fetchDashboardData()}
      />

      <VoiceMealModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        mealType={activeMealType}
        onMealSaved={() => fetchDashboardData()}
      />

      <ManualMealModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        initialMealType={activeMealType}
        onMealSaved={() => fetchDashboardData()}
      />
    </div>
  );
};
