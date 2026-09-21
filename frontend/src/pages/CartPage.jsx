import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export const CartPage = () => {
  const { cart, totalAmount, totalItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const items = cart?.items || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
          Your Cart
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          {totalItems === 0 ? 'Your cart is currently empty.' : `${totalItems} item(s) selected for delivery.`}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">Your cart is empty</h3>
          <p className="text-xs text-gray-400 mt-1 mb-6">
            Explore our curated healthy-food marketplace and add nutrient-dense essentials.
          </p>
          <Link
            to="/store"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            Browse VitaCare Store
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{item.productName}</h4>
                    <span className="text-xs font-extrabold text-emerald-700 block mt-0.5">
                      ₹{item.price}
                    </span>
                    {item.proteinGrams > 0 && (
                      <span className="text-[10px] text-gray-400">
                        {item.proteinGrams}g Protein per serving
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden text-xs">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-1.5 hover:bg-gray-100 text-gray-600"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 font-bold text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-1.5 hover:bg-gray-100 text-gray-600"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary / Checkout Panel */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs h-fit space-y-4">
            <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-semibold text-gray-900">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Doorstep Delivery</span>
                <span className="font-semibold text-emerald-700">FREE</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100 text-sm font-extrabold text-gray-950">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
