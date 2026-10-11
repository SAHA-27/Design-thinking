import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { CategoriesPage } from './pages/CategoriesPage';
import { ServiceDetailsPage } from './pages/ServiceDetailsPage';
import { TechnicianSearchPage } from './pages/TechnicianSearchPage';
import { BookingCheckoutPage } from './pages/BookingCheckoutPage';
import { LiveTrackingPage } from './pages/LiveTrackingPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { ServicePassportPage } from './pages/ServicePassportPage';
import { ServiceHistoryInvoicesPage } from './pages/ServiceHistoryInvoicesPage';
import { CustomerProfilePage } from './pages/CustomerProfilePage';
import { TechnicianDashboard } from './pages/TechnicianDashboard';
import { TechnicianBookingManagement } from './pages/TechnicianBookingManagement';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotificationsPage } from './pages/NotificationsPage';
import { ReviewsDisputesPage } from './pages/ReviewsDisputesPage';
import { CustomerEvidenceReviewPage } from './pages/CustomerEvidenceReviewPage';

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* 1. Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* 2. Sign Up & Login */}
                <Route path="/auth" element={<AuthPage />} />

                {/* 3. Customer Dashboard */}
                <Route path="/dashboard" element={<CustomerDashboard />} />

                {/* 4. Service Categories */}
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/categories/:slug" element={<CategoriesPage />} />

                {/* 5. Service Details */}
                <Route path="/services/:id" element={<ServiceDetailsPage />} />

                {/* 6. Technician Search & Comparison */}
                <Route path="/technicians" element={<TechnicianSearchPage />} />

                {/* 7. Booking & Checkout */}
                <Route path="/booking/new" element={<BookingCheckoutPage />} />

                {/* 8. Live Booking Tracking */}
                <Route path="/track/:id" element={<LiveTrackingPage />} />

                {/* 8b. ServEase ProofCare — Customer Evidence Review */}
                <Route path="/proofcare/review/:id" element={<CustomerEvidenceReviewPage />} />

                {/* 9. AI Service Assistant */}
                <Route path="/ai-assistant" element={<AIAssistantPage />} />

                {/* 10. Digital Service Passport */}
                <Route path="/passport" element={<ServicePassportPage />} />

                {/* 11. Service History & Invoices */}
                <Route path="/bookings" element={<ServiceHistoryInvoicesPage />} />
                <Route path="/history" element={<ServiceHistoryInvoicesPage />} />

                {/* 12. Customer Profile */}
                <Route path="/profile" element={<CustomerProfilePage />} />

                {/* 13. Technician Dashboard */}
                <Route path="/technician" element={<TechnicianDashboard />} />

                {/* 14. Technician Booking Management */}
                <Route path="/technician/bookings" element={<TechnicianBookingManagement />} />

                {/* 15. Admin Dashboard */}
                <Route path="/admin" element={<AdminDashboard />} />

                {/* 16. Notifications & Reminders */}
                <Route path="/notifications" element={<NotificationsPage />} />

                {/* 17. Reviews & Complaints */}
                <Route path="/reviews" element={<ReviewsDisputesPage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
