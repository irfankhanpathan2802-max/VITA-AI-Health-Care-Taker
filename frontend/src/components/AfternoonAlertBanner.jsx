import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, ShoppingBag, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export const AfternoonAlertBanner = ({ alertData }) => {
  const { addToCart } = useCart();

  if (!alertData) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-emerald-500/10 border border-amber-200/80 rounded-3xl p-6 mb-8 shadow-xs">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
                Afternoon Nutrition Notice
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900 mt-1">{alertData.headline}</h3>
            <p className="text-xs text-gray-600 mt-0.5">{alertData.recommendation}</p>
          </div>
        </div>

        <Link
          to="/store?category=HIGH+PROTEIN"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs shrink-0"
        >
          <ShoppingBag className="w-4 h-4" />
          View VitaCare Store
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Suggested Foods & Matching Products */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {alertData.foodSuggestions?.map((item, idx) => (
          <div key={idx} className="bg-white/90 backdrop-blur-xs p-3 rounded-2xl border border-gray-100 flex items-center gap-3">
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 rounded-xl object-cover shrink-0"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-gray-900 truncate">{item.name}</h4>
              <span className="text-[11px] font-semibold text-emerald-700 block">
                {item.proteinGrams}g Protein
              </span>
              <span className="text-[10px] text-gray-400">Approx. {item.calories} kcal</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
