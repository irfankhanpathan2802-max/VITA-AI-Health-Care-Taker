import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

// Ensures viewport starts at the top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

import { Navbar } from './components/Navbar.jsx';
import { MobileNav } from './components/MobileNav.jsx';
import { Footer } from './components/Footer.jsx';
import { AddMealModal } from './components/AddMealModal.jsx';
import { CameraFoodModal } from './components/CameraFoodModal.jsx';
import { VoiceMealModal } from './components/VoiceMealModal.jsx';
import { ManualMealModal } from './components/ManualMealModal.jsx';
import { EnquiryAssistantWidget } from './components/EnquiryAssistantWidget.jsx';

import { LandingPage } from './pages/LandingPage.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { OnboardingPage } from './pages/OnboardingPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { LifestylePage } from './pages/LifestylePage.jsx';
import { RemindersPage } from './pages/RemindersPage.jsx';
import { ReportsPage } from './pages/ReportsPage.jsx';
import { TomorrowPlanPage } from './pages/TomorrowPlanPage.jsx';
import { AICoachPage } from './pages/AICoachPage.jsx';
import { StorePage } from './pages/StorePage.jsx';
import { CartPage } from './pages/CartPage.jsx';
import { CheckoutPage } from './pages/CheckoutPage.jsx';
import { OrdersPage } from './pages/OrdersPage.jsx';
import { SubscriptionsPage } from './pages/SubscriptionsPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { AdminPage } from './pages/AdminPage.jsx';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs text-gray-500 font-semibold">
        Loading VitaCare...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  if (user && !user.isOnboarded && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Direct Auth Handler for root route (shows Create Account or Login directly)
const AuthRouteHandler = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs text-gray-500 font-semibold">
        Loading VitaCare...
      </div>
    );
  }

  if (isAuthenticated) {
    if (user && !user.isOnboarded) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthPage />;
};

function AppContent() {
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState('lunch');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);

  const handleOpenAddMeal = (type = 'lunch') => {
    setActiveMealType(type);
    setIsAddMealOpen(true);
  };

  const handleSelectMethod = (method, type) => {
    setIsAddMealOpen(false);
    setActiveMealType(type);
    if (method === 'camera') setIsCameraOpen(true);
    else if (method === 'voice') setIsVoiceOpen(true);
    else if (method === 'manual') setIsManualOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFA]">
      <ScrollToTop />
      <Navbar />

      <main className="flex-1 pb-16 md:pb-0">
        <Routes>
          {/* Root Route: Shows Create Account or Login directly when opened */}
          <Route
            path="/"
            element={
              <AuthRouteHandler />
            }
          />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/store" element={<StorePage />} />

          {/* Onboarding */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Main Features */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lifestyle"
            element={
              <ProtectedRoute>
                <LifestylePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reminders"
            element={
              <ProtectedRoute>
                <RemindersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tomorrow-plan"
            element={
              <ProtectedRoute>
                <TomorrowPlanPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coach"
            element={
              <ProtectedRoute>
                <AICoachPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscriptions"
            element={
              <ProtectedRoute>
                <SubscriptionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Sticky Bottom Mobile Navigation */}
      <MobileNav onOpenAddMeal={() => handleOpenAddMeal('lunch')} />

      {/* Global Add Meal Modals triggered from Mobile Nav or anywhere */}
      <AddMealModal
        isOpen={isAddMealOpen}
        onClose={() => setIsAddMealOpen(false)}
        onSelectMethod={handleSelectMethod}
        initialMealType={activeMealType}
      />
      <CameraFoodModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        mealType={activeMealType}
        onMealSaved={() => window.location.reload()}
      />
      <VoiceMealModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        mealType={activeMealType}
        onMealSaved={() => window.location.reload()}
      />
      <ManualMealModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        initialMealType={activeMealType}
        onMealSaved={() => window.location.reload()}
      />

      {/* Global Concierge & Enquiry AI Assistant */}
      <EnquiryAssistantWidget />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
