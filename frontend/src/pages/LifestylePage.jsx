import React, { useState, useEffect } from 'react';
import {
  Activity,
  Clock,
  Eye,
  Moon,
  CheckCircle,
  Briefcase,
  Monitor,
  Flame,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { apiRequest } from '../services/api.js';

export const LifestylePage = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await apiRequest('/lifestyle/insights');
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load lifestyle insights:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInsights();
  }, []);

  const lifestyle = data?.lifestyle || {};
  const insights = data?.insights || {};

  const getIcon = (category) => {
    if (category.includes('Movement')) return Activity;
    if (category.includes('Visual')) return Eye;
    if (category.includes('Rest')) return Moon;
    return Clock;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Lifestyle Intelligence
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-2 tracking-tight">
          My Lifestyle
        </h1>
        <p className="text-xs text-gray-500 mt-1 max-w-xl">
          Practical preventive guidance based on your work patterns, movement balance, screen time, and circadian rest.
        </p>
      </div>

      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <Briefcase className="w-5 h-5 text-gray-700 mb-2" />
          <span className="text-[10px] font-bold text-gray-400 block uppercase">Work Type</span>
          <span className="text-sm font-extrabold text-gray-900">{lifestyle.workType || 'Desk job'}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <Clock className="w-5 h-5 text-amber-600 mb-2" />
          <span className="text-[10px] font-bold text-gray-400 block uppercase">Daily Sitting</span>
          <span className="text-sm font-extrabold text-gray-900">{lifestyle.sittingDurationHours || 8} hrs</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <Activity className="w-5 h-5 text-emerald-600 mb-2" />
          <span className="text-[10px] font-bold text-gray-400 block uppercase">Daily Standing</span>
          <span className="text-sm font-extrabold text-gray-900">{lifestyle.standingDurationHours || 2} hrs</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <Monitor className="w-5 h-5 text-blue-600 mb-2" />
          <span className="text-[10px] font-bold text-gray-400 block uppercase">Screen Time</span>
          <span className="text-sm font-extrabold text-gray-900">{lifestyle.screenTimeHours || 7} hrs</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <Moon className="w-5 h-5 text-purple-600 mb-2" />
          <span className="text-[10px] font-bold text-gray-400 block uppercase">Sleep Duration</span>
          <span className="text-sm font-extrabold text-gray-900">{lifestyle.sleepDurationHours || 8} hrs</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <TrendingUp className="w-5 h-5 text-teal-600 mb-2" />
          <span className="text-[10px] font-bold text-gray-400 block uppercase">Daily Steps</span>
          <span className="text-sm font-extrabold text-gray-900">{lifestyle.dailySteps || 5000}</span>
        </div>
      </div>

      {/* Routine Timing Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 mb-4">Configured Meal & Sleep Schedule</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
            <span className="text-gray-400 block text-[10px] font-bold uppercase">Breakfast</span>
            <span className="text-sm font-extrabold text-gray-900 mt-1 block">
              {lifestyle.mealRoutine?.breakfastTime || '09:00'}
            </span>
          </div>

          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
            <span className="text-gray-400 block text-[10px] font-bold uppercase">Lunch</span>
            <span className="text-sm font-extrabold text-gray-900 mt-1 block">
              {lifestyle.mealRoutine?.lunchTime || '13:30'}
            </span>
          </div>

          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
            <span className="text-gray-400 block text-[10px] font-bold uppercase">Snack</span>
            <span className="text-sm font-extrabold text-gray-900 mt-1 block">
              {lifestyle.mealRoutine?.snackTime || '17:00'}
            </span>
          </div>

          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
            <span className="text-gray-400 block text-[10px] font-bold uppercase">Dinner</span>
            <span className="text-sm font-extrabold text-gray-900 mt-1 block">
              {lifestyle.mealRoutine?.dinnerTime || '20:30'}
            </span>
          </div>

          <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-100 col-span-2 sm:col-span-1">
            <span className="text-purple-700 block text-[10px] font-bold uppercase">Sleep Window</span>
            <span className="text-sm font-extrabold text-purple-900 mt-1 block">
              {lifestyle.sleepTime || '23:00'} - {lifestyle.wakeUpTime || '07:00'}
            </span>
          </div>
        </div>
      </div>

      {/* Practical AI Guidance Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Personalized Preventive Guidance</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.recommendations?.map((rec, idx) => {
            const Icon = getIcon(rec.category);
            return (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                      {rec.category}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      rec.priority === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {rec.priority} Priority
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <Icon className="w-4 h-4 text-emerald-600" />
                    {rec.title}
                  </h4>

                  <p className="text-xs text-gray-500 mb-3 italic">
                    "{rec.observation}"
                  </p>

                  <p className="text-xs text-gray-700 leading-relaxed bg-[#FAFBF9] p-3 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-900 block mb-0.5">Practical Suggestion:</span>
                    {rec.suggestion}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Non-Diagnostic Disclaimer */}
      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 leading-relaxed">
          {insights.disclaimer || 'Guidance is for preventive wellness and educational purposes only. It is not intended as medical advice or diagnosis.'}
        </p>
      </div>
    </div>
  );
};
