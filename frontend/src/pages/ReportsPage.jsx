import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Droplets,
  Flame,
  Dumbbell,
  Wheat,
  FileText,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { apiRequest } from '../services/api.js';

export const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' | 'weekly' | 'monthly'
  const [dailyData, setDailyData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        if (activeTab === 'daily') {
          const res = await apiRequest(`/reports/daily?date=${selectedDate}`);
          if (res.success) setDailyData(res.report);
        } else if (activeTab === 'weekly') {
          const res = await apiRequest('/reports/weekly');
          if (res.success) setWeeklyData(res.report);
        } else if (activeTab === 'monthly') {
          const res = await apiRequest('/reports/monthly');
          if (res.success) setMonthlyData(res.report);
        }
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, [activeTab, selectedDate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Nutrition & Wellness Insights
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-2 tracking-tight">
            Progress & Trend Reports
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Grounded strictly in your logged meals. Missing data is never fabricated or defaulted to zero.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-2xl bg-gray-100 text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl transition-all ${
              activeTab === 'daily' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            End-of-Day Report
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl transition-all ${
              activeTab === 'weekly' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Weekly Report
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl transition-all ${
              activeTab === 'monthly' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Monthly Trends
          </button>
        </div>
      </div>

      {/* 1. END-OF-DAY REPORT */}
      {activeTab === 'daily' && dailyData && (
        <div className="space-y-6 animate-in fade-in">
          {/* Date Picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-600">Report for:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 bg-white"
            />
          </div>

          {!dailyData.hasData ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-800">No data logged for this date</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                No meals have been recorded for {selectedDate}. VitaCare does not fabricate zero-calorie records.
              </p>
            </div>
          ) : (
            <>
              {/* Daily Macro Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
                  <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-gray-600">
                    <Flame className="w-4 h-4 text-orange-600" />
                    Calories
                  </div>
                  <span className="text-xl font-extrabold text-gray-950">
                    {dailyData.totalLogged.calories} <span className="text-xs text-gray-400 font-medium">/ {dailyData.target.calories} kcal</span>
                  </span>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
                  <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-gray-600">
                    <Dumbbell className="w-4 h-4 text-emerald-600" />
                    Protein
                  </div>
                  <span className="text-xl font-extrabold text-emerald-700">
                    {dailyData.totalLogged.proteinGrams}g <span className="text-xs text-gray-400 font-medium">/ {dailyData.target.proteinGrams}g</span>
                  </span>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
                  <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-gray-600">
                    <Wheat className="w-4 h-4 text-amber-600" />
                    Fiber
                  </div>
                  <span className="text-xl font-extrabold text-gray-950">
                    {dailyData.totalLogged.fiberGrams}g <span className="text-xs text-gray-400 font-medium">/ {dailyData.target.fiberGrams}g</span>
                  </span>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
                  <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-gray-600">
                    <Droplets className="w-4 h-4 text-blue-600" />
                    Hydration
                  </div>
                  <span className="text-xl font-extrabold text-blue-700">
                    {dailyData.waterLoggedMl}ml <span className="text-xs text-gray-400 font-medium">/ {dailyData.target.waterMl}ml</span>
                  </span>
                </div>
              </div>

              {/* Completed vs Unlogged Meals */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
                <h3 className="text-base font-bold text-gray-900 mb-4">Meal Consistency Breakdown</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {['breakfast', 'lunch', 'snacks', 'dinner'].map((type) => {
                    const found = dailyData.completedMeals.find(m => m.mealType === type);
                    return (
                      <div
                        key={type}
                        className={`p-4 rounded-2xl border ${
                          found ? 'bg-emerald-50/50 border-emerald-200' : 'bg-gray-50 border-gray-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-gray-900 capitalize">{type}</span>
                          {found ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Not Logged</span>
                          )}
                        </div>
                        {found ? (
                          <p className="text-xs text-emerald-800 font-medium mt-1">
                            {found.calories} kcal • {found.proteinGrams}g P
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400 mt-1">No meal recorded</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Observations & Suggestions for Tomorrow */}
              <div className="bg-[#FAFBF9] rounded-3xl p-6 sm:p-8 border border-gray-200/80 space-y-4">
                <h3 className="text-base font-bold text-gray-900">Nutrition Observations</h3>
                <ul className="space-y-2">
                  {dailyData.observations.map((obs, idx) => (
                    <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{obs}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-3">
                    Practical Suggestions for Tomorrow:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {dailyData.suggestionsForTomorrow.map((sug, idx) => (
                      <div key={idx} className="bg-white p-3.5 rounded-2xl border border-gray-200/70 flex items-center gap-3">
                        <img src={sug.image} alt={sug.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                        <div>
                          <h5 className="text-xs font-bold text-gray-900">{sug.name}</h5>
                          <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{sug.reason}</p>
                          <span className="text-[10px] font-bold text-emerald-700 mt-1 block">{sug.nutrition}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 2. WEEKLY REPORT */}
      {activeTab === 'weekly' && weeklyData && (
        <div className="space-y-6 animate-in fade-in">
          {/* Weekly Averages */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
              <span className="text-xs font-bold text-gray-400 block mb-1 uppercase">Total Meals Logged</span>
              <span className="text-2xl font-extrabold text-gray-950">{weeklyData.totalMealsLogged}</span>
              <span className="text-xs text-gray-500 block mt-0.5">Over {weeklyData.daysWithDataCount} days with data</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
              <span className="text-xs font-bold text-gray-400 block mb-1 uppercase">Avg. Daily Energy</span>
              <span className="text-2xl font-extrabold text-emerald-700">{weeklyData.averageCalories}</span>
              <span className="text-xs text-gray-400 block mt-0.5">Target: {weeklyData.targetCalories} kcal</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
              <span className="text-xs font-bold text-gray-400 block mb-1 uppercase">Avg. Daily Protein</span>
              <span className="text-2xl font-extrabold text-emerald-700">{weeklyData.averageProtein}</span>
              <span className="text-xs text-gray-400 block mt-0.5">Target: {weeklyData.targetProtein}g</span>
            </div>
          </div>

          {/* 7-Day Day-by-Day Table with No Data distinction */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs overflow-x-auto">
            <h3 className="text-base font-bold text-gray-900 mb-4">Past 7 Days Consistency</h3>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px]">
                  <th className="pb-3 font-bold">Day</th>
                  <th className="pb-3 font-bold">Date</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold">Calories</th>
                  <th className="pb-3 font-bold">Protein</th>
                  <th className="pb-3 font-bold">Fiber</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {weeklyData.weeklyTrend.map((d, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="py-3 font-bold text-gray-900">{d.dayName}</td>
                    <td className="py-3 text-gray-500">{d.date}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        d.status === 'Complete'
                          ? 'bg-emerald-100 text-emerald-800'
                          : d.status === 'No data logged'
                          ? 'bg-gray-100 text-gray-500 italic'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-gray-800">
                      {d.calories !== null ? `${d.calories} kcal` : <span className="text-gray-400 italic">No data</span>}
                    </td>
                    <td className="py-3 font-semibold text-gray-800">
                      {d.proteinGrams !== null ? `${d.proteinGrams}g` : <span className="text-gray-400 italic">No data</span>}
                    </td>
                    <td className="py-3 font-semibold text-gray-800">
                      {d.fiberGrams !== null ? `${d.fiberGrams}g` : <span className="text-gray-400 italic">No data</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Weekly Protein & Calorie Bar Chart */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
            <h3 className="text-base font-bold text-gray-900 mb-6">Weekly Protein & Energy Comparison</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData.weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="dayName" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="calories" fill="#10B981" name="Calories (kcal)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="proteinGrams" fill="#3B82F6" name="Protein (g)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 3. MONTHLY REPORT */}
      {activeTab === 'monthly' && monthlyData && (
        <div className="space-y-6 animate-in fade-in">
          {/* Monthly Consistency Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
              <span className="text-xs font-bold text-gray-400 block mb-1 uppercase">Logging Consistency</span>
              <span className="text-2xl font-extrabold text-emerald-700">{monthlyData.consistencyRate}</span>
              <span className="text-xs text-gray-400 block mt-0.5">{monthlyData.loggedDaysCount} of {monthlyData.totalDays} days</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
              <span className="text-xs font-bold text-gray-400 block mb-1 uppercase">Complete Days</span>
              <span className="text-2xl font-extrabold text-gray-900">{monthlyData.completeDaysCount}</span>
              <span className="text-xs text-gray-400 block mt-0.5">3+ meals logged</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
              <span className="text-xs font-bold text-gray-400 block mb-1 uppercase">Monthly Avg Calories</span>
              <span className="text-2xl font-extrabold text-gray-900">
                {monthlyData.averageCalories !== 'No data' ? `${monthlyData.averageCalories} kcal` : 'No data'}
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
              <span className="text-xs font-bold text-gray-400 block mb-1 uppercase">Monthly Avg Protein</span>
              <span className="text-2xl font-extrabold text-emerald-700">
                {monthlyData.averageProtein !== 'No data' ? `${monthlyData.averageProtein}g` : 'No data'}
              </span>
            </div>
          </div>

          {/* 30-Day Trend Chart */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
            <h3 className="text-base font-bold text-gray-900 mb-6">30-Day Nutrition Trend</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} />
                  <YAxis stroke="#9ca3af" fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="protein" stroke="#10B981" strokeWidth={2} name="Protein (g)" connectNulls={false} />
                  <Line type="monotone" dataKey="calories" stroke="#F59E0B" strokeWidth={2} name="Calories (kcal)" connectNulls={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4-Week Month-End Analysis */}
          {monthlyData.fourWeeksBreakdown && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
                    4-Week Month-End Review
                  </span>
                  <h3 className="text-lg font-extrabold text-gray-950 mt-2">
                    Month-End Report: 4-Week Progression
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Comparative breakdown across all 4 weeks to track your consistency and nutritional adaptation.
                  </p>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs">
                  Consistency: {monthlyData.consistencyRate}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {monthlyData.fourWeeksBreakdown.map((w) => (
                  <div
                    key={w.weekNumber}
                    className="p-5 rounded-2xl border border-gray-100 bg-[#FAFBF9] hover:bg-emerald-50/20 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-gray-900">{w.weekLabel}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {w.consistencyRate}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-600 pt-1 border-t border-gray-200/60">
                      <div className="flex justify-between">
                        <span>Days Logged:</span>
                        <span className="font-bold text-gray-900">{w.loggedDays} / {w.totalDays}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Energy:</span>
                        <span className="font-bold text-gray-900">
                          {w.averageCalories !== 'No data' ? `${w.averageCalories} kcal` : 'No data'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Protein:</span>
                        <span className="font-bold text-emerald-700">
                          {w.averageProtein !== 'No data' ? `${w.averageProtein}g` : 'No data'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
