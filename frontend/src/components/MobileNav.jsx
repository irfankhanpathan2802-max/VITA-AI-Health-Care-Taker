import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Package, BarChart3, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const MobileNav = ({ onOpenAddMeal }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-200/80 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center py-1.5 px-3 rounded-lg text-xs font-semibold ${
            isActive('/dashboard') ? 'text-emerald-600 font-bold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          Home
        </Link>

        <button
          onClick={onOpenAddMeal}
          className="flex flex-col items-center py-1 px-3 -mt-4 group"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-bold text-emerald-800 mt-1">Add Meal</span>
        </button>

        <Link
          to="/store"
          className={`flex flex-col items-center py-1.5 px-3 rounded-lg text-xs font-semibold ${
            isActive('/store') ? 'text-emerald-600 font-bold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Package className="w-5 h-5 mb-0.5" />
          Store
        </Link>

        <Link
          to="/reports"
          className={`flex flex-col items-center py-1.5 px-3 rounded-lg text-xs font-semibold ${
            isActive('/reports') ? 'text-emerald-600 font-bold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <BarChart3 className="w-5 h-5 mb-0.5" />
          Reports
        </Link>

        <Link
          to="/coach"
          className={`flex flex-col items-center py-1.5 px-3 rounded-lg text-xs font-semibold ${
            isActive('/coach') ? 'text-emerald-600 font-bold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Bot className="w-5 h-5 mb-0.5" />
          Coach
        </Link>
      </div>
    </div>
  );
};
