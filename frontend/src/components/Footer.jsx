import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldAlert, Heart, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-16 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">VitaCare</span>
            </div>
            <p className="text-sm text-gray-500 max-w-md leading-relaxed mb-4">
              AI-Powered Preventive Healthcare, Nutrition & Lifestyle Wellness Platform.
              Helping you understand your daily lifestyle, eat smarter, and build lasting healthy habits.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full max-w-max border border-emerald-200">
              <Heart className="w-3.5 h-3.5 fill-emerald-600" />
              Designed with care for modern health and wellness
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/dashboard" className="hover:text-emerald-600 transition-colors">Daily Dashboard</Link></li>
              <li><Link to="/lifestyle" className="hover:text-emerald-600 transition-colors">Lifestyle Intelligence</Link></li>
              <li><Link to="/reports" className="hover:text-emerald-600 transition-colors">Nutrition Reports</Link></li>
              <li><Link to="/coach" className="hover:text-emerald-600 transition-colors">AI Wellness Coach</Link></li>
            </ul>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">VitaCare Store</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/store?category=HIGH+PROTEIN" className="hover:text-emerald-600 transition-colors">High Protein Foods</Link></li>
              <li><Link to="/store?category=HEALTHY+BREAKFAST" className="hover:text-emerald-600 transition-colors">Ragi & Millets</Link></li>
              <li><Link to="/store?category=FRUITS+%26+FRESH+FOODS" className="hover:text-emerald-600 transition-colors">Fresh Fruits & Nuts</Link></li>
              <li><Link to="/subscriptions" className="hover:text-emerald-600 transition-colors">Monthly Subscriptions</Link></li>
            </ul>
          </div>
        </div>

        {/* Medical & Legal Disclaimer */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 mb-8 flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-bold text-amber-950 block mb-0.5">Medical & Wellness Disclaimer</span>
            VitaCare provides personalized preventive wellness guidance, lifestyle observations, and nutritional estimations based strictly on user-provided data. It is not intended as medical advice, clinical diagnosis, prescription, or treatment. Nutritional targets are estimates and not prescriptions. Always consult a qualified physician, registered dietitian, or healthcare professional regarding medical conditions or dietary changes.
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-4 pt-6 border-t border-gray-100">
          <p>© 2026 VitaCare Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-600 cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
