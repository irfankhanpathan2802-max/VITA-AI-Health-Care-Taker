import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Clock, Camera, Mic, Edit3, Utensils, AlertCircle, ShoppingBag, ArrowRight, Sparkles, Check } from 'lucide-react';

export const MealCard = ({ mealType, meal, onAddMeal, onDeleteMeal, onRolloverProtein }) => {
  const [isRolloverDone, setIsRolloverDone] = useState(false);
  const [isRollingOver, setIsRollingOver] = useState(false);

  const titles = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    snacks: 'Snack',
    dinner: 'Dinner',
  };

  const title = titles[mealType] || 'Meal';
  const isLogged = !!meal;

  // Determine if this meal is missed past its normal scheduled time
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  let isPastTime = false;
  if (mealType === 'breakfast' && currentHour >= 11) isPastTime = true;
  if (mealType === 'lunch' && (currentHour > 15 || (currentHour === 15 && currentMinute >= 30))) isPastTime = true;
  if (mealType === 'snacks' && (currentHour > 18 || (currentHour === 18 && currentMinute >= 30))) isPastTime = true;
  if (mealType === 'dinner' && currentHour >= 22) isPastTime = true;

  const isMissed = !isLogged && isPastTime;

  const getSourceIcon = (source) => {
    if (source === 'camera') return <Camera className="w-3.5 h-3.5 text-emerald-600" title="Logged via Photo" />;
    if (source === 'voice') return <Mic className="w-3.5 h-3.5 text-blue-600" title="Logged via Voice" />;
    return <Edit3 className="w-3.5 h-3.5 text-gray-500" title="Logged Manually" />;
  };

  const handleRollover = async () => {
    if (!onRolloverProtein) return;
    try {
      setIsRollingOver(true);
      await onRolloverProtein(mealType, 20);
      setIsRolloverDone(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRollingOver(false);
    }
  };

  return (
    <div className={`rounded-3xl p-6 border transition-all flex flex-col justify-between h-full ${
      isMissed
        ? 'bg-amber-50/40 border-amber-200/80 shadow-xs'
        : 'bg-white border-gray-100 shadow-xs hover:shadow-md'
    }`}>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
              isLogged
                ? 'bg-emerald-100 text-emerald-800'
                : isMissed
                ? 'bg-amber-100 text-amber-800'
                : 'bg-gray-100 text-gray-500'
            }`}>
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-extrabold text-gray-900 tracking-tight">{title}</h3>
                {isMissed && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                    Missed
                  </span>
                )}
              </div>
              {isLogged ? (
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                  <Clock className="w-3 h-3" />
                  <span>{meal.timeLogged}</span>
                  <span>•</span>
                  {getSourceIcon(meal.source)}
                  <span className="capitalize">{meal.source}</span>
                </div>
              ) : (
                <span className="text-xs text-gray-400 font-medium block">
                  {isMissed ? 'Past scheduled time' : 'Not logged yet'}
                </span>
              )}
            </div>
          </div>

          {isLogged && (
            <button
              onClick={() => onDeleteMeal(meal._id)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete meal record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content Body */}
        {isLogged ? (
          <div className="space-y-3">
            {/* Food items list */}
            <div className="space-y-1.5">
              {meal.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-gray-50 last:border-none">
                  <span className="font-semibold text-gray-800">
                    {item.quantity} {item.unit || ''} {item.name}
                  </span>
                  <span className="text-gray-500 font-medium">
                    {item.calories} kcal • <span className="text-emerald-700 font-bold">{item.proteinGrams}g P</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Total Meal Macros badge */}
            <div className="pt-2 flex flex-wrap gap-1.5 text-[11px]">
              <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-100">
                {meal.totalNutrition.calories} kcal
              </span>
              <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-100">
                {meal.totalNutrition.proteinGrams}g P
              </span>
              <span className="px-2 py-1 rounded-lg bg-amber-50 text-amber-800 font-bold border border-amber-100">
                {meal.totalNutrition.carbsGrams}g C
              </span>
              <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold border border-blue-100">
                {meal.totalNutrition.fatsGrams}g F
              </span>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="text-sm font-semibold text-gray-600 mb-1">
              {title} has not been logged.
            </p>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              {isMissed
                ? `You missed ${title.toLowerCase()} today. You can log it now, order healthy food, or rollover missed protein to tomorrow.`
                : `Fill your ${title.toLowerCase()} to keep today's total nutrients on track.`}
            </p>
          </div>
        )}
      </div>

      {/* Action footer */}
      <div className="pt-4 border-t border-gray-100 mt-4 space-y-2">
        {!isLogged ? (
          <>
            <button
              onClick={() => onAddMeal(mealType)}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/70 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              + Add {title}
            </button>

            <div className={`grid ${isMissed ? 'grid-cols-2' : 'grid-cols-1'} gap-2 pt-0.5`}>
              <Link
                to={
                  mealType === 'breakfast'
                    ? '/store?category=HEALTHY+BREAKFAST'
                    : mealType === 'lunch'
                    ? '/store?category=HIGH+PROTEIN'
                    : '/store?category=HEALTHY+READY-TO-EAT'
                }
                className="py-2 px-3 rounded-xl bg-gray-900 hover:bg-black text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 text-center shadow-xs"
                title={`Order ${title} from Vita Market`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Order {title}</span>
              </Link>

              {isMissed && (
                <button
                  type="button"
                  onClick={handleRollover}
                  disabled={isRollingOver || isRolloverDone}
                  className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center gap-1 text-center ${
                    isRolloverDone
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-white hover:bg-amber-50 text-amber-900 border-amber-300'
                  }`}
                  title="Add 20g missed protein to tomorrow's daily target"
                >
                  {isRolloverDone ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                      <span className="truncate">{isRollingOver ? 'Adding...' : '+20g Tomorrow'}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="pt-1">
            <Link
              to={
                mealType === 'breakfast'
                  ? '/store?category=HEALTHY+BREAKFAST'
                  : mealType === 'lunch'
                  ? '/store?category=HIGH+PROTEIN'
                  : '/store?category=HEALTHY+READY-TO-EAT'
              }
              className="w-full py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200/80 text-gray-800 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 text-center"
              title={`Order healthy ${title.toLowerCase()} from Vita Market`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Order {title} Food</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
