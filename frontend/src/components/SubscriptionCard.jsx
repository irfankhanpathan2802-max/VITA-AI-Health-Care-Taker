import React from 'react';
import { Check, Calendar, Sparkles, ArrowRight } from 'lucide-react';

export const SubscriptionCard = ({ plan, onSubscribe }) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group">
      {plan.isPopular && (
        <div className="absolute -top-3 right-6 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Most Popular
        </div>
      )}

      <div>
        <div className="mb-4">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {plan.tagline}
          </span>
          <h3 className="text-lg font-extrabold text-gray-900 mt-2">{plan.title}</h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{plan.description}</p>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-100">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-gray-950">₹{plan.price}</span>
            <span className="text-xs font-semibold text-gray-400">/ {plan.frequency.toLowerCase()}</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium block mt-1">
            Includes free scheduled doorstep delivery
          </span>
        </div>

        <div className="space-y-2.5 mb-6">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
            Included in this plan:
          </span>
          {plan.features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => onSubscribe(plan)}
        className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 group-hover:scale-[1.02]"
      >
        <span>Subscribe Now</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
