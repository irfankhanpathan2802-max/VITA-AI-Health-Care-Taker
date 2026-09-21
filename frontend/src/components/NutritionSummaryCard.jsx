import React from 'react';
import { Flame, Dumbbell, Wheat, Droplets, Sparkles, AlertCircle } from 'lucide-react';

export const NutritionSummaryCard = ({ totalNutrition, target, waterLoggedMl = 0, hasMeals = false }) => {
  // If no meals logged yet, show strict empty state format as required
  const caloriesLogged = hasMeals && totalNutrition ? totalNutrition.calories : null;
  const proteinLogged = hasMeals && totalNutrition ? totalNutrition.proteinGrams : 0;
  const carbsLogged = hasMeals && totalNutrition ? totalNutrition.carbsGrams : 0;
  const fatsLogged = hasMeals && totalNutrition ? totalNutrition.fatsGrams : 0;
  const fiberLogged = hasMeals && totalNutrition ? totalNutrition.fiberGrams : 0;

  const targetCalories = target?.calories || 2000;
  const targetProtein = target?.proteinGrams || 60;
  const targetCarbs = target?.carbsGrams || 250;
  const targetFats = target?.fatsGrams || 65;
  const targetFiber = target?.fiberGrams || 30;
  const targetWater = target?.waterMl || 2500;

  const calcPercent = (val, max) => {
    if (!val || !max) return 0;
    return Math.min(100, Math.round((val / max) * 100));
  };

  const getRemainingText = (logged, max, unit = 'g') => {
    if (!hasMeals) return null;
    const diff = max - logged;
    if (diff > 0) {
      return `Approximately ${Math.round(diff * 10) / 10}${unit} remaining based on your current target.`;
    }
    return `Estimated target reached!`;
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
            Daily Nutritional Requirements
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight mt-1.5 flex items-center gap-2">
            Nutrients You Should Take Today
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {hasMeals
              ? 'Calculated target vs. your actual consumed nutrition across today’s meals.'
              : 'Target requirements calculated for your body profile. Fill your meals below to track.'}
          </p>
        </div>

        <div className="text-left sm:text-right bg-emerald-50/60 sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-emerald-100 w-full sm:w-auto">
          <span className="text-xs font-semibold text-gray-500 block">Daily Target Energy</span>
          <span className="text-lg font-extrabold text-emerald-800">
            {caloriesLogged !== null ? caloriesLogged : 0} <span className="text-xs font-semibold text-gray-500">/ {targetCalories} kcal</span>
          </span>
          {caloriesLogged !== null && (
            <span className="text-[11px] font-bold text-emerald-600 block">
              {targetCalories - caloriesLogged > 0 ? `${targetCalories - caloriesLogged} kcal remaining` : 'Target reached!'}
            </span>
          )}
        </div>
      </div>

      {/* Main Calories Bar */}
      <div className="mb-8 bg-[#FBFBFA] p-5 rounded-2xl border border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-gray-800">Calories</span>
              <span className="text-xs text-gray-400 block">Daily Energy Expenditure</span>
            </div>
          </div>
          <div className="text-right">
            {caloriesLogged === null ? (
              <span className="text-sm font-semibold text-gray-400 italic">No data yet</span>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-gray-900">{caloriesLogged}</span>
                <span className="text-xs text-gray-400 font-medium">/ {targetCalories} kcal</span>
              </div>
            )}
          </div>
        </div>

        <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-700"
            style={{ width: `${calcPercent(caloriesLogged || 0, targetCalories)}%` }}
          />
        </div>

        {caloriesLogged !== null && (
          <p className="text-xs text-gray-500 mt-2">
            {getRemainingText(caloriesLogged, targetCalories, ' kcal')}
          </p>
        )}
      </div>

      {/* Macronutrient Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Protein */}
        <div className="bg-[#FAFBF9] p-4 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Dumbbell className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-gray-700">Protein</span>
            </div>
            <span className="text-xs font-extrabold text-gray-900">
              {proteinLogged}g <span className="text-gray-400 font-normal">/ {targetProtein}g</span>
            </span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-1.5">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${calcPercent(proteinLogged, targetProtein)}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-500 leading-tight">
            {hasMeals ? getRemainingText(proteinLogged, targetProtein, 'g') : '0 logged / target'}
          </p>
        </div>

        {/* Carbohydrates */}
        <div className="bg-[#FAFBF9] p-4 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Wheat className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-gray-700">Carbs</span>
            </div>
            <span className="text-xs font-extrabold text-gray-900">
              {carbsLogged}g <span className="text-gray-400 font-normal">/ {targetCarbs}g</span>
            </span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-1.5">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${calcPercent(carbsLogged, targetCarbs)}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-500 leading-tight">
            {hasMeals ? getRemainingText(carbsLogged, targetCarbs, 'g') : '0 logged / target'}
          </p>
        </div>

        {/* Healthy Fats */}
        <div className="bg-[#FAFBF9] p-4 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-gray-700">Fats</span>
            </div>
            <span className="text-xs font-extrabold text-gray-900">
              {fatsLogged}g <span className="text-gray-400 font-normal">/ {targetFats}g</span>
            </span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-1.5">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${calcPercent(fatsLogged, targetFats)}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-500 leading-tight">
            {hasMeals ? getRemainingText(fatsLogged, targetFats, 'g') : '0 logged / target'}
          </p>
        </div>

        {/* Dietary Fiber */}
        <div className="bg-[#FAFBF9] p-4 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                <Wheat className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-gray-700">Fiber</span>
            </div>
            <span className="text-xs font-extrabold text-gray-900">
              {fiberLogged}g <span className="text-gray-400 font-normal">/ {targetFiber}g</span>
            </span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-1.5">
            <div
              className="bg-teal-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${calcPercent(fiberLogged, targetFiber)}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-500 leading-tight">
            {hasMeals ? getRemainingText(fiberLogged, targetFiber, 'g') : '0 logged / target'}
          </p>
        </div>
      </div>

      {/* Hydration Bar */}
      <div className="bg-[#F0FDF4] p-4 rounded-2xl border border-emerald-200/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-bold text-emerald-950">Hydration Tracking</span>
            <span className="text-xs text-emerald-700/80 block">
              {waterLoggedMl > 0 ? `${waterLoggedMl}ml recorded today` : 'Hydration: No data yet'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-40 bg-emerald-200/60 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${calcPercent(waterLoggedMl, targetWater)}%` }}
            />
          </div>
          <span className="text-xs font-bold text-emerald-900 whitespace-nowrap">
            {waterLoggedMl} / {targetWater} ml
          </span>
        </div>
      </div>
    </div>
  );
};
