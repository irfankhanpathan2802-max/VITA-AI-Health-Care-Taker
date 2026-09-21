import React from 'react';
import { Camera, Mic, Edit3, X } from 'lucide-react';

export const AddMealModal = ({ isOpen, onClose, onSelectMethod, initialMealType = 'breakfast' }) => {
  if (!isOpen) return null;

  const mealName = initialMealType.charAt(0).toUpperCase() + initialMealType.slice(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Log {mealName}
          </span>
          <h3 className="text-xl font-extrabold text-gray-900 mt-2">How would you like to log?</h3>
          <p className="text-xs text-gray-500 mt-1">
            Choose your preferred method to record your meal.
          </p>
        </div>

        <div className="space-y-3">
          {/* Option 1: TAKE PHOTO */}
          <button
            onClick={() => onSelectMethod('camera', initialMealType)}
            className="w-full p-4 rounded-2xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all flex items-center gap-4 text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 group-hover:text-emerald-800">TAKE PHOTO</h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Instant AI food validation and item identification from meal photos.
              </p>
            </div>
          </button>

          {/* Option 2: VOICE INPUT */}
          <button
            onClick={() => onSelectMethod('voice', initialMealType)}
            className="w-full p-4 rounded-2xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all flex items-center gap-4 text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-800">VOICE INPUT</h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Speak naturally (e.g. "I had two eggs, two rotis and dal for breakfast").
              </p>
            </div>
          </button>

          {/* Option 3: MANUAL ENTRY */}
          <button
            onClick={() => onSelectMethod('manual', initialMealType)}
            className="w-full p-4 rounded-2xl border border-gray-200 hover:border-amber-500 hover:bg-amber-50/40 transition-all flex items-center gap-4 text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Edit3 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 group-hover:text-amber-800">MANUAL ENTRY</h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Search verified foods, adjust portion quantities, and customize items.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
