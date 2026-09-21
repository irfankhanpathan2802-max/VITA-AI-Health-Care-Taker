import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [toasts, setToasts] = useState([]);
  const [missedMealAlerts, setMissedMealAlerts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const fetchMissedMeals = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await apiRequest('/reminders/missed-meals');
      if (res.success && res.notices) {
        setMissedMealAlerts(res.notices);
      }
    } catch (err) {
      // Non-blocking
    }
  };

  useEffect(() => {
    fetchMissedMeals();
    const interval = setInterval(fetchMissedMeals, 60000); // check every minute
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        missedMealAlerts,
        refreshMissedMeals: fetchMissedMeals,
      }}
    >
      {children}

      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-xl border flex items-center justify-between transition-all transform translate-y-0 ${
              toast.type === 'success'
                ? 'bg-emerald-900/90 text-white border-emerald-500/30 backdrop-blur-md'
                : toast.type === 'error'
                ? 'bg-rose-900/90 text-white border-rose-500/30 backdrop-blur-md'
                : 'bg-gray-900/90 text-white border-gray-700/40 backdrop-blur-md'
            }`}
          >
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-white/70 hover:text-white text-xs font-bold px-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
