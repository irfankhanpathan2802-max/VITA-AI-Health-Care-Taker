import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Check, Pause, Play, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { apiRequest } from '../services/api.js';
import { SubscriptionCard } from '../components/SubscriptionCard.jsx';

export const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState(null);
  const [frequency, setFrequency] = useState('Monthly');
  const [deliveryAddress, setDeliveryAddress] = useState('Default saved profile address');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const availablePlans = [
    {
      title: 'High Protein Plan',
      tagline: 'Athletic Recovery & Muscle Maintenance',
      price: 3499,
      frequency: 'Monthly',
      isPopular: true,
      description: 'Hand-crafted high-protein meal boxes, organic paneer/tofu, sprouted legumes, and egg/plant protein packs.',
      features: [
        '10x Clean High-Protein Meal Boxes',
        '2x Organic Malai Paneer (250g)',
        '4x Sprouted Moong & Chickpea Mix',
        '2x Free-Range Eggs or Tofu Packs',
        'Scheduled doorstep delivery every week',
      ],
    },
    {
      title: 'Healthy Breakfast Plan',
      tagline: 'Circadian Energy & High Fiber',
      price: 2199,
      frequency: 'Monthly',
      isPopular: false,
      description: 'Sprouted ragi flour, instant Ragi Java blends, rolled oats, and antioxidant seeds for sustained morning energy.',
      features: [
        '2x Instant Ragi Java Wellness Mix (350g)',
        '2x Heritage Sprouted Ragi Flour (500g)',
        '2x Gluten-Free Rolled Oats (500g)',
        '1x Super 5 Seed Mix (200g)',
        'Free doorstep delivery every 10 days',
      ],
    },
    {
      title: 'Balanced Nutrition Plan',
      tagline: 'Whole Food Metabolic Health',
      price: 2999,
      frequency: 'Monthly',
      isPopular: false,
      description: 'A complete synergy of clean meal boxes, seasonal fresh fruits, whole pulses, and raw California nuts.',
      features: [
        '6x Clean Meal Boxes',
        '2x Seasonal Antioxidant Fruit Boxes (1.5kg)',
        '2x Organic Sprouted Legume Packs',
        '1x Raw Almonds & Walnuts (250g)',
        'Bi-weekly doorstep deliveries',
      ],
    },
    {
      title: 'Customized Wellness Plan',
      tagline: 'Tailored to Your Health Profile',
      price: 3999,
      frequency: 'Monthly',
      isPopular: false,
      description: 'Dynamic subscription formulated around your exact dietary preference, allergy exclusions, and calorie targets.',
      features: [
        '8x Custom Protein & Fiber Meal Boxes',
        '2x Sprouted Millets & Ragi Mix',
        '2x Seasonal Fresh Fruit Boxes',
        '4x Fox Nuts & Healthy Snacks',
        'Direct dietitian alignment consultation',
      ],
    },
  ];

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      const res = await apiRequest('/store/subscriptions');
      if (res.success && res.subscriptions) {
        setSubscriptions(res.subscriptions);
      }
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleOpenSubscribe = (plan) => {
    setSelectedPlanForModal(plan);
  };

  const handleConfirmSubscribe = async () => {
    if (!selectedPlanForModal) return;

    try {
      setIsSubscribing(true);
      const res = await apiRequest('/store/subscriptions', {
        method: 'POST',
        body: JSON.stringify({
          planType: selectedPlanForModal.title,
          frequency,
          deliveryAddress,
        }),
      });

      if (res.success) {
        setSelectedPlanForModal(null);
        fetchSubscriptions();
      }
    } catch (err) {
      alert('Subscription failed: ' + err.message);
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await apiRequest(`/store/subscriptions/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.success) {
        setSubscriptions(prev => prev.map(s => s._id === id ? res.subscription : s));
      }
    } catch (err) {
      alert('Failed to update subscription: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Recurring Healthy Food Deliveries
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-2 tracking-tight">
          VitaCare Plans & Subscriptions
        </h1>
        <p className="text-xs text-gray-500 mt-0.5 max-w-xl">
          Automate your preventive wellness with scheduled deliveries of fresh meals, sprouted ragi, and high-protein essentials.
        </p>
      </div>

      {/* Active User Subscriptions Section */}
      {subscriptions.length > 0 && (
        <div className="bg-[#FAFBF9] rounded-3xl p-6 sm:p-8 border border-gray-200/80 space-y-4">
          <h3 className="text-base font-bold text-gray-900">Your Active Subscriptions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subscriptions.map((sub) => (
              <div key={sub._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{sub.planType}</h4>
                      <span className="text-xs text-gray-400 capitalize">{sub.frequency} Plan</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      sub.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {sub.status}
                    </span>
                  </div>

                  <span className="text-base font-extrabold text-emerald-700 block mb-3">
                    ₹{sub.price} <span className="text-xs text-gray-400 font-normal">/ {sub.frequency.toLowerCase()}</span>
                  </span>

                  <div className="text-xs text-gray-600 space-y-1 mb-4">
                    <p>Next delivery: <strong className="text-gray-900">{sub.nextDeliveryDate}</strong></p>
                    <p className="line-clamp-1">Includes: {sub.includedItems?.join(', ')}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-50">
                  {sub.status === 'Active' ? (
                    <button
                      onClick={() => handleStatusChange(sub._id, 'Paused')}
                      className="flex-1 py-1.5 rounded-xl border border-amber-300 text-amber-800 hover:bg-amber-50 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      Pause Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(sub._id, 'Active')}
                      className="flex-1 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Resume Plan
                    </button>
                  )}
                  <button
                    onClick={() => handleStatusChange(sub._id, 'Cancelled')}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Plans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {availablePlans.map((plan, idx) => (
          <SubscriptionCard key={idx} plan={plan} onSubscribe={handleOpenSubscribe} />
        ))}
      </div>

      {/* Subscription Confirmation Modal */}
      {selectedPlanForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setSelectedPlanForModal(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                Confirm Subscription
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 mt-2">
                {selectedPlanForModal.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Scheduled delivery tailored to your wellness targets.
              </p>
            </div>

            <div className="space-y-4 mb-6 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Delivery Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-semibold bg-gray-50"
                >
                  <option value="Daily">Daily Delivery</option>
                  <option value="Weekly">Weekly Delivery</option>
                  <option value="Monthly">Monthly Delivery</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Delivery Address</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-medium"
                />
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex justify-between items-center">
                <span className="font-bold text-emerald-950">Subscription Total:</span>
                <span className="text-base font-extrabold text-emerald-700">
                  ₹{selectedPlanForModal.price} / {frequency.toLowerCase()}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 mb-6 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                You will not be automatically charged without your explicit confirmation. You can pause or cancel your subscription at any time.
              </span>
            </div>

            <button
              onClick={handleConfirmSubscribe}
              disabled={isSubscribing}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 disabled:opacity-50"
            >
              {isSubscribing ? 'Activating Plan...' : `Confirm & Activate ${selectedPlanForModal.title}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
