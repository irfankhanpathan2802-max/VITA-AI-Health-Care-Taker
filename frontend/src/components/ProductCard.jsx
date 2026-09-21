import React, { useState } from 'react';
import { ShoppingCart, Check, Star, Flame, Dumbbell } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    const success = await addToCart(product._id, 1);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Product Image */}
        <div className="relative h-48 overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/90 text-gray-800 backdrop-blur-xs shadow-xs">
              {product.category}
            </span>
          </div>

          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            {product.rating || 4.8}
          </div>
        </div>

        {/* Details */}
        <div className="p-5">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>

          {/* Macros Badges */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100">
              <Dumbbell className="w-3 h-3" />
              {product.nutrition?.proteinGrams || 0}g Protein
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-orange-50 text-orange-800 border border-orange-100">
              <Flame className="w-3 h-3" />
              {product.nutrition?.calories || 0} kcal
            </span>
          </div>
        </div>
      </div>

      {/* Footer / Price & Add to Cart */}
      <div className="px-5 pb-5 pt-2 border-t border-gray-50 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-400 block font-medium">Price</span>
          <span className="text-base font-extrabold text-gray-950">₹{product.price}</span>
        </div>

        <button
          onClick={handleAdd}
          disabled={added}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
            added
              ? 'bg-emerald-800 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-[1.02]'
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Added
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};
