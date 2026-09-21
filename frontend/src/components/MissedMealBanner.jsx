import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Plus, ShoppingBag, X, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export const MissedMealBanner = ({ notices = [], onLogMeal, onDismiss }) => {
  if (!notices || notices.length === 0) return null;

  return (
    <div className="space-y-3 mb-6 animate-in fade-in">
      {notices.map((notice, idx) => (
        <div
          key={idx}
          className="bg-gradient-to-r from-gray-950 via-gray-900 to-emerald-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-emerald-900/40 relative overflow-hidden"
        >
          {/* Subtle decorative glow */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-extrabold text-gray-100 tracking-tight">
                    {notice.message}
                  </h4>
                  {notice.missedProteinGrams && (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] font-bold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-rose-400" />
                      ~{notice.missedProteinGrams}g Protein Shortfall
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">
                  {notice.subtext}
                </p>

                {notice.suggestedCompensation && (
                  <p className="text-[11px] text-emerald-300 font-medium flex items-center gap-1 pt-0.5">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    Quick fix: {notice.suggestedCompensation}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 self-start lg:self-center shrink-0 pt-2 lg:pt-0">
              {notice.storeLink && (
                <Link
                  to={notice.storeLink}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-900/50 transition-all hover:scale-[1.02]"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {notice.storeActionText || 'Order from Vita Market'}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}

              <button
                onClick={() => onLogMeal(notice.mealType)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-100 text-xs font-bold flex items-center gap-1.5 border border-white/15 transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                Log Missed {notice.mealType ? notice.mealType.charAt(0).toUpperCase() + notice.mealType.slice(1) : 'Meal'}
              </button>

              {onDismiss && (
                <button
                  onClick={() => onDismiss(idx)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors ml-1"
                  title="Dismiss notice"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
