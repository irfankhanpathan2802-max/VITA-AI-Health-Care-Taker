import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf,
  ArrowRight,
  ShieldCheck,
  Brain,
  Camera,
  Mic,
  Activity,
  Heart,
  Calendar,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { CameraFoodModal } from '../components/CameraFoodModal.jsx';

export const LandingPage = () => {
  const { isAuthenticated, activateDemoMode } = useAuth();
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-gradient-to-b from-[#F2F7F2] via-[#FBFBFA] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-300 text-emerald-800 text-xs font-bold mb-6 animate-in fade-in">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              AI-Powered Preventive Healthcare & Nutrition
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-[1.15] mb-6">
              Understand your lifestyle.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
                Eat smarter.
              </span>{' '}
              Build healthier habits.
            </h1>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
              VitaCare uses AI to understand your daily activities, lifestyle and nutrition patterns and provide personalized preventive wellness guidance.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-600/30 hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth?mode=register"
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-600/30 hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/auth?mode=login"
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm border border-gray-200 transition-all flex items-center justify-center"
                  >
                    Log In
                  </Link>
                </>
              )}

              <button
                onClick={activateDemoMode}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-sm border border-emerald-300/60 transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Explore Demo Mode
              </button>

              <button
                onClick={() => setIsCameraOpen(true)}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2"
                title="Scan food directly from the home page"
              >
                <Camera className="w-4 h-4 animate-pulse" />
                Scan Meal with Camera
              </button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                No fake or fabricated data
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Photo, voice & manual logging
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Curated healthy food marketplace
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-950/60 px-3 py-1 rounded-full border border-rose-800/60">
              The Modern Health Paradox
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 mb-4">
              Generic diets fail because they ignore how you actually live.
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              Most health apps tell you what to eat without knowing whether you sit for 9 hours at a desk, commute in heavy traffic, work night shifts, or struggle with inconsistent meal times. Without context, nutrition advice is impossible to sustain.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <Clock className="w-5 h-5 text-amber-400 mb-2" />
                <span className="font-bold block text-gray-100 mb-1">Erratic Meal Timings</span>
                <p className="text-gray-400">Skipped breakfasts and late heavy dinners disrupt natural circadian digestion.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <Activity className="w-5 h-5 text-rose-400 mb-2" />
                <span className="font-bold block text-gray-100 mb-1">Prolonged Inactivity</span>
                <p className="text-gray-400">Desk-bound lifestyles reduce metabolic burn and impair glucose regulation.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <HelpCircle className="w-5 h-5 text-emerald-400 mb-2" />
                <span className="font-bold block text-gray-100 mb-1">Food Access Gap</span>
                <p className="text-gray-400">Knowing you need protein is useless when clean, nutritious food is hard to get.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE SOLUTION & CORE CYCLE */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          The VitaCare Solution
        </span>
        <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-4">
          The Complete Preventive Wellness Cycle
        </h2>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          "Don't just tell people what they should eat. Help them understand what they need, remind them when they need it, and make suitable food easier to access."
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
          {[
            { step: '1', title: 'UNDERSTAND', desc: 'Age, work, sleep, routine' },
            { step: '2', title: 'TRACK', desc: 'Photo, voice, manual' },
            { step: '3', title: 'ANALYZE', desc: 'Macros vs targets' },
            { step: '4', title: 'RECOMMEND', desc: 'Actionable guidance' },
            { step: '5', title: 'REMIND', desc: 'Polite meal notices' },
            { step: '6', title: 'ACT', desc: 'Eat balanced meals' },
            { step: '7', title: 'ACCESS FOOD', desc: 'VitaCare Store' },
            { step: '8', title: 'TRACK AGAIN', desc: 'Continuous wellness' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:border-emerald-500 transition-colors">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center justify-center mx-auto mb-2">
                {item.step}
              </span>
              <h4 className="text-xs font-bold text-gray-900 tracking-tight">{item.title}</h4>
              <p className="text-[10px] text-gray-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. AI FOOD LOGGING (CAMERA + VOICE) */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Frictionless Logging
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-3 mb-4">
              AI Food Camera & Natural Voice Input
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Logging meals shouldn't feel like a chore. Point your camera at your plate or speak naturally.
              Our strict validation engine accurately identifies foods and portions, and always asks for your confirmation before saving.
            </p>

            <div className="space-y-4 text-xs text-gray-700">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-gray-100">
                <Camera className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-900 block">Strict Food Detection</span>
                  Non-food objects are immediately flagged. You review detected items and portion quantities before saving.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-gray-100">
                <Mic className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-900 block">Conversational Voice Recognition</span>
                  Speak naturally: "I had two eggs, two rotis and dal for breakfast". Confirm or edit with a tap.
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-100">
            <img
              src="/images/ragi_java.jpg"
              alt="Traditional Sprouted Ragi Java"
              className="w-full h-80 object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-lg">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-emerald-800">Verified Meal: Traditional Ragi Java</span>
                <span className="font-extrabold text-emerald-700">140 kcal • 5.2g Protein</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LIFESTYLE INTELLIGENCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAFBF9] rounded-3xl p-8 sm:p-12 border border-gray-200/80">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Lifestyle Intelligence
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2 mb-3">
              Your Daily Work, Screen Time & Sleep Analyzed
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We look beyond calories. VitaCare cross-references your work type, sitting duration, screen exposure, and sleep consistency to provide practical ergonomic and circadian recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
              <Activity className="w-5 h-5 text-emerald-600 mb-2" />
              <h4 className="font-bold text-gray-900 mb-1">Sitting vs Standing</h4>
              <p className="text-gray-500 leading-relaxed">Detects prolonged sedentary stretches and prompts quick 2-minute posture & circulation breaks.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
              <Clock className="w-5 h-5 text-blue-600 mb-2" />
              <h4 className="font-bold text-gray-900 mb-1">Screen Strain Relief</h4>
              <p className="text-gray-500 leading-relaxed">Automated reminders for the 20-20-20 rule to reduce digital eye fatigue during long desk hours.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
              <Sparkles className="w-5 h-5 text-purple-600 mb-2" />
              <h4 className="font-bold text-gray-900 mb-1">Circadian Recovery</h4>
              <p className="text-gray-500 leading-relaxed">Evening wind-down notices aligned with your configured sleep and wake routine.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VITACARE STORE & MONTHLY SUBSCRIPTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            VitaCare Store & Marketplace
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-3">
            Real Food Access, Connected to Your AI Insights
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            When our afternoon nutrition alert detects a protein gap, VitaCare shows you matching fresh foods and meal boxes ready for delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <div>
              <img
                src="/images/boiled_eggs.jpg"
                alt="Farm-Fresh Boiled Eggs"
                className="w-full h-36 object-cover rounded-2xl mb-3"
              />
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">HIGH PROTEIN</span>
              <h4 className="text-sm font-bold text-gray-900 mt-1">Farm-Fresh Range Eggs (Boiled)</h4>
              <p className="text-xs text-gray-500 mt-1">Organic pasture-raised eggs, rich in bioavailable protein and omega-3s.</p>
            </div>
            <Link to="/store" className="mt-4 text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              Explore Store <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <div>
              <img
                src="/images/bread_omelette.jpg"
                alt="Fresh Whole-Wheat Bread Omelette"
                className="w-full h-36 object-cover rounded-2xl mb-3"
              />
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">HIGH PROTEIN BREAKFAST</span>
              <h4 className="text-sm font-bold text-gray-900 mt-1">Fresh Bread Omelette</h4>
              <p className="text-xs text-gray-500 mt-1">Double-egg fluffy whole-wheat bread omelette with 18.5g high-quality protein.</p>
            </div>
            <Link to="/store" className="mt-4 text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              Explore Store <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <div>
              <img
                src="/images/fruits.jpg"
                alt="Fresh Fruits & Seeds"
                className="w-full h-36 object-cover rounded-2xl mb-3"
              />
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full">FRUITS & FRESH FOODS</span>
              <h4 className="text-sm font-bold text-gray-900 mt-1">Antioxidant Fruits & Super Seeds</h4>
              <p className="text-xs text-gray-500 mt-1">Handpicked organic papaya, apples, raw almonds, and omega-3 seeds.</p>
            </div>
            <Link to="/store" className="mt-4 text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              Explore Store <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <div>
              <img
                src="/images/rolled_oats.jpg"
                alt="Gluten-Free Rolled Oats"
                className="w-full h-36 object-cover rounded-2xl mb-3"
              />
              <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full">HEALTHY BREAKFAST</span>
              <h4 className="text-sm font-bold text-gray-900 mt-1">Gluten-Free Rolled Oats Porridge</h4>
              <p className="text-xs text-gray-500 mt-1">High beta-glucan whole rolled oats served warm with berries and chia seeds.</p>
            </div>
            <Link to="/store" className="mt-4 text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              Explore Store <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-3xl p-8 sm:p-14 text-white text-center shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Start Your Personalized Wellness Journey Today
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Create an account, tell us about your daily lifestyle, and experience intelligent preventive healthcare built around you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/auth?mode=register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-sm shadow-md transition-all hover:scale-105"
            >
              Create Free Account
            </Link>
            <button
              onClick={activateDemoMode}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-900/40 hover:bg-emerald-900/60 text-white font-bold text-sm border border-emerald-400/40 transition-all"
            >
              Explore Live Demo
            </button>
          </div>
        </div>
      </section>

      <CameraFoodModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        mealType="lunch"
        onMealSaved={() => {
          setIsCameraOpen(false);
          alert('Meal scanned successfully! Log in or explore dashboard to view your nutrition.');
        }}
      />
    </div>
  );
};
