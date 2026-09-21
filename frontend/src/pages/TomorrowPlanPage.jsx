import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Plus, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';

export const TomorrowPlanPage = () => {
  const [plan, setPlan] = useState(null);
  const [addedItems, setAddedItems] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await apiRequest('/ai/tomorrow-plan');
        if (res.success && res.plan) {
          setPlan(res.plan);
        }
      } catch (err) {
        console.error('Failed to load tomorrow plan:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlan();
  }, []);

  const handleAddToPlan = (idx) => {
    setAddedItems(prev => ({ ...prev, [idx]: true }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full max-w-max border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Intelligent Nutrition Planning</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-2 tracking-tight">
          Tomorrow's Nutrition Plan
        </h1>
        <p className="text-xs text-gray-500 mt-0.5 max-w-2xl leading-relaxed">
          {plan?.observation || "Personalized meal strategy designed to maintain steady energy and fulfill your wellness targets tomorrow."}
        </p>
      </div>

      {/* Plan Food Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {plan?.planCards?.map((card, idx) => {
          const isAdded = !!addedItems[idx];
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-gray-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs">
                    {card.mealCategory}
                  </div>
                  {card.tag && (
                    <div className="absolute bottom-3 right-3 bg-emerald-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {card.tag}
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{card.name}</h3>
                  <span className="text-xs font-extrabold text-emerald-700 block mb-2">
                    {card.nutrition}
                  </span>
                  <p className="text-xs text-gray-500 leading-relaxed bg-[#FBFBFA] p-3 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-700 block mb-0.5">Why suggested:</span>
                    {card.whySuggested}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => handleAddToPlan(idx)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isAdded
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Added to Tomorrow's Plan
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      Add to Tomorrow's Plan
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggested Store Products Section */}
      {plan?.recommendedStoreProducts && plan.recommendedStoreProducts.length > 0 && (
        <div className="bg-[#FAFBF9] rounded-3xl p-6 sm:p-8 border border-gray-200/80">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Direct Store Access
              </span>
              <h3 className="text-lg font-bold text-gray-900 mt-1">Available in VitaCare Store</h3>
              <p className="text-xs text-gray-500">Fresh foods and meal boxes matching tomorrow's recommendations.</p>
            </div>

            <Link
              to="/store"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              Browse Full Store <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plan.recommendedStoreProducts.map((prod, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between gap-3">
                <img src={prod.image} alt={prod.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-gray-900 truncate">{prod.name}</h4>
                  <span className="text-xs font-extrabold text-emerald-700 block">₹{prod.price}</span>
                  <span className="text-[10px] text-gray-400">{prod.nutrition?.proteinGrams}g Protein</span>
                </div>
                <button
                  onClick={() => addToCart(prod._id, 1)}
                  className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors shrink-0"
                  title="Add to cart"
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
