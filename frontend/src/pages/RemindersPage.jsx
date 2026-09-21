import React, { useState, useEffect } from 'react';
import { Bell, Clock, Check, Power, Utensils, Droplets, Activity, Monitor, Moon, Save } from 'lucide-react';
import { apiRequest } from '../services/api.js';

export const RemindersPage = () => {
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await apiRequest('/reminders');
        if (res.success && res.reminders) {
          setReminders(res.reminders);
        }
      } catch (err) {
        console.error('Failed to load reminders:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReminders();
  }, []);

  const handleToggle = async (id, currentEnabled) => {
    try {
      const res = await apiRequest(`/reminders/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ enabled: !currentEnabled }),
      });
      if (res.success) {
        setReminders(prev => prev.map(r => r._id === id ? res.reminder : r));
      }
    } catch (err) {
      alert('Failed to update reminder: ' + err.message);
    }
  };

  const handleTimeChange = async (id, newTime) => {
    try {
      const res = await apiRequest(`/reminders/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ time: newTime }),
      });
      if (res.success) {
        setReminders(prev => prev.map(r => r._id === id ? res.reminder : r));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err) {
      console.error('Failed to update reminder time:', err);
    }
  };

  const getIcon = (type) => {
    if (['breakfast', 'lunch', 'snack', 'dinner'].includes(type)) return Utensils;
    if (type === 'hydration') return Droplets;
    if (type === 'movement') return Activity;
    if (type === 'screen') return Monitor;
    return Moon;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Smart Reminders
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-2 tracking-tight">
          Reminder Preferences
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Configure notification times for meal logging, hydration, movement intervals, and sleep wind-down.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          Reminder settings updated successfully.
        </div>
      )}

      {/* Reminders List */}
      <div className="space-y-3">
        {reminders.map((rem) => {
          const Icon = getIcon(rem.type);
          return (
            <div
              key={rem._id}
              className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                rem.enabled
                  ? 'bg-white border-gray-200 shadow-xs'
                  : 'bg-gray-50/70 border-gray-200/60 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  rem.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-500'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{rem.title}</h4>
                  <span className="text-xs text-gray-400 capitalize">
                    Type: {rem.type} • Days: {rem.days?.join(', ') || 'All Days'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                {/* Time Picker */}
                <input
                  type="time"
                  value={rem.time}
                  disabled={!rem.enabled}
                  onChange={(e) => handleTimeChange(rem._id, e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 bg-white disabled:bg-gray-100 shadow-xs"
                />

                {/* Enable/Disable Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggle(rem._id, rem.enabled)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    rem.enabled ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
                  }`}
                  title={rem.enabled ? 'Disable reminder' : 'Enable reminder'}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
