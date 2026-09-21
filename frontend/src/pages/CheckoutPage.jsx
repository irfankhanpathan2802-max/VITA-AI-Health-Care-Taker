import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowRight, CreditCard, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { apiRequest } from '../services/api.js';

export const CheckoutPage = () => {
  const { cart, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: 'Hyderabad',
    state: 'Telangana',
    postalCode: '500081',
  });
  const [paymentMethod, setPaymentMethod] = useState('simulated_card');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine) {
      alert('Please fill out all address fields.');
      return;
    }

    try {
      setIsPlacingOrder(true);
      const res = await apiRequest('/store/checkout', {
        method: 'POST',
        body: JSON.stringify({ shippingAddress }),
      });

      if (res.success) {
        clearCart();
        navigate('/orders');
      }
    } catch (err) {
      alert('Checkout error: ' + err.message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
          Checkout & Delivery
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Enter your delivery destination and confirm your healthy food order.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipping Address */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-600" />
            Shipping & Doorstep Delivery Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Full Recipient Name</label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={shippingAddress.fullName}
                onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Contact Mobile Number</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={shippingAddress.phone}
                onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Street Address / Flat / Landmark</label>
            <input
              type="text"
              placeholder="Flat 402, Green Valley Apartments, Road No. 12"
              value={shippingAddress.addressLine}
              onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">State</label>
              <input
                type="text"
                value={shippingAddress.state}
                onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">PIN Code</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium"
              />
            </div>
          </div>
        </div>

        {/* Payment Simulation UI */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            Payment Method (Prototype Simulation)
          </h3>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-bold">Simulated Secure Payment Gateway (Free Prototype)</span>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-200/80 text-emerald-900">
              Auto-Approved
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 text-sm font-extrabold text-gray-900">
            <span>Total Payable:</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPlacingOrder}
          className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ShieldCheck className="w-4 h-4" />
          {isPlacingOrder ? 'Processing Order...' : `Pay ₹${totalAmount} & Confirm Delivery`}
        </button>
      </form>
    </div>
  );
};
