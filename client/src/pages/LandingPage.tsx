import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bot, 
  ShieldCheck, 
  Clock, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  Zap, 
  Droplets, 
  Wind, 
  Bike, 
  Car, 
  Disc, 
  Refrigerator, 
  Wrench, 
  Sparkles, 
  Paintbrush, 
  Laptop, 
  Hammer,
  HelpCircle,
  Award,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { TrustBadgeModal } from '../components/TrustBadgeModal';

// Icon mapper for categories
const iconMap: Record<string, any> = {
  Droplets,
  Wind,
  Bike,
  Car,
  Disc,
  Refrigerator,
  Zap,
  Wrench,
  Sparkles,
  Paintbrush,
  Laptop,
  Hammer
};

export const LandingPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<any[]>([]);
  const [featuredTechnicians, setFeaturedTechnicians] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechForTrust, setSelectedTechForTrust] = useState<any | null>(null);

  useEffect(() => {
    // Fetch categories
    api.get('/services/categories')
      .then(res => {
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      })
      .catch(() => {});

    // Fetch technicians
    api.get('/technicians/search')
      .then(res => {
        if (res.data.success) {
          setFeaturedTechnicians(res.data.technicians.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/categories?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/categories');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-slate-900 text-white pt-16 pb-24 lg:pt-20 lg:pb-32">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-950/80 border border-teal-500/30 px-4 py-1.5 text-xs sm:text-sm font-semibold text-teal-300 mb-6 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-ping" />
            <span>{t.heroBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            {t.heroHeadline}
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.heroSubheadline}
          </p>

          {/* Search bar & AI Diagnostic CTA */}
          <div className="mt-8 max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative flex items-center shadow-2xl rounded-2xl bg-white p-2 border border-slate-200">
              <Search className="h-5 w-5 text-slate-400 ml-3 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden py-2"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white hover:bg-teal-500 transition shadow-md flex items-center gap-1.5"
              >
                <span>{t.searchButton}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Quick Helper Links */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
              <span className="text-slate-400">Try smart shortcuts:</span>
              <Link
                to="/ai-assistant"
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-900/60 text-teal-300 border border-teal-700/60 px-3 py-1 font-semibold hover:bg-teal-800 transition"
              >
                <Bot className="h-3.5 w-3.5 text-teal-400" />
                <span>AI Problem Diagnostic</span>
              </Link>
              <Link
                to="/technicians?emergency=true"
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-950/70 text-red-300 border border-red-700/60 px-3 py-1 font-semibold hover:bg-red-900 transition"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                <span>Emergency 25-Min SOS</span>
              </Link>
              <Link
                to="/passport"
                className="inline-flex items-center gap-1.5 rounded-lg bg-navy-800 text-slate-300 border border-navy-700 px-3 py-1 font-semibold hover:bg-navy-700 transition"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Service Passport</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR SERVICE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 pb-16">
        <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-xl border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
                {t.popularCategoriesTitle}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {t.popularCategoriesSubtitle}
              </p>
            </div>
            <Link
              to="/categories"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 hover:text-teal-700 transition"
            >
              <span>View All 12 Categories</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const IconComp = iconMap[cat.icon] || Wrench;
              return (
                <Link
                  key={cat._id}
                  to={`/categories/${cat.slug}`}
                  className="group flex flex-col items-center text-center p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-teal-300 hover:shadow-lg transition transform hover:-translate-y-1"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white group-hover:bg-teal-50 text-slate-700 group-hover:text-teal-600 shadow-sm border border-slate-200 group-hover:border-teal-200 transition mb-3">
                    <IconComp className="h-7 w-7 transition" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-navy-900 line-clamp-2">
                    {language === 'ta' && cat.nameTa ? cat.nameTa : cat.name}
                  </h3>
                  <span className="text-[11px] text-teal-600 font-semibold mt-1">
                    {cat.serviceCount || 2}+ services
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="bg-white py-16 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
              {t.howItWorksTitle}
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Three seamless steps from initial diagnosis to verified job completion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-teal-400 font-extrabold text-lg mb-4 shadow-sm">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{t.howItWorksStep1}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.howItWorksDesc1}</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-white font-extrabold text-lg mb-4 shadow-sm">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{t.howItWorksStep2}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.howItWorksDesc2}</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-teal-400 font-extrabold text-lg mb-4 shadow-sm">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{t.howItWorksStep3}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.howItWorksDesc3}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SMART FEATURES SHOWCASE */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-extrabold tracking-wider text-teal-600">The Intelligent Edge</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
            Built for Transparency & Reliability
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Features engineered to eliminate service anxiety and hidden costs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Smart Feature A */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 mb-4">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-900 mb-1.5">AI Smart Diagnostic</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Describe "AC running but not cooling" and get instant probable causes, follow-up diagnostics, price estimates, and 1-click booking.
            </p>
            <Link to="/ai-assistant" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700">
              Try Interactive AI Assistant <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Smart Feature D */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-900 mb-1.5">Digital Service Passport</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Keep verified service records for your AC, RO, bike, and appliances. Automatically calculates next maintenance countdowns.
            </p>
            <Link to="/passport" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700">
              Open Digital Passport Vault <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Smart Feature F */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 mb-4">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-900 mb-1.5">Service Trust Score</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Transparent 100-point index combining Aadhaar KYC, punctuality rate, completion ratio, and zero-complaint record.
            </p>
            <Link to="/technicians" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700">
              Compare Verified Technicians <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Smart Feature C */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-4">
              <Disc className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-900 mb-1.5">Transparent Price Estimator</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Itemized breakdowns for visit charges, labor, and parts. Any extra work requires customer digital approval before starting.
            </p>
          </div>

          {/* Smart Feature G */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-900 mb-1.5">Before & After Service Proof</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Technicians upload side-by-side photographic evidence of replaced parts and completed repairs before final billing.
            </p>
          </div>

          {/* Smart Feature E */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 mb-4">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-900 mb-1.5">Emergency SOS Mode</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Urgent toggle that instantly dispatches only currently available nearby professionals with verified 25-minute ETA.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FEATURED VERIFIED PROFESSIONALS */}
      <section className="bg-slate-100 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-teal-600">Top Service Partners</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
                {t.featuredProsTitle}
              </h2>
            </div>
            <Link
              to="/technicians"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 hover:text-teal-700 transition"
            >
              <span>Explore All Verified Pros</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTechnicians.map((tech) => (
              <div key={tech._id} className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={tech.userId?.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80'}
                        alt={tech.userId?.name}
                        className="h-14 w-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                      />
                      <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                          {tech.userId?.name}
                          <CheckCircle2 className="h-4 w-4 text-teal-600 fill-teal-100" />
                        </h3>
                        <p className="text-xs text-slate-500">{tech.experienceYears} {t.experienceYears}</p>
                        <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 mt-0.5">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          <span>{tech.rating}</span>
                          <span className="text-slate-400">({tech.reviewCount} {t.reviewsCount})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tech.skills?.map((sk: string, idx: number) => (
                      <span key={idx} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                        {sk}
                      </span>
                    ))}
                  </div>

                  {/* Trust score pill */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-teal-50/70 border border-teal-100 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-teal-600" />
                      <span className="text-xs font-semibold text-teal-900">Trust Score</span>
                    </div>
                    <button
                      onClick={() => setSelectedTechForTrust(tech)}
                      className="text-xs font-extrabold text-teal-700 hover:underline flex items-center gap-1"
                    >
                      <span>{tech.trustScore} / 100</span>
                      <span className="text-[10px] text-teal-500 font-normal">(Why?)</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Visiting Charge</span>
                    <span className="text-sm font-bold text-slate-900">₹{tech.visitingFee || 149}</span>
                  </div>
                  <Link
                    to={`/booking/new?technicianId=${tech.userId?._id}`}
                    className="rounded-xl bg-navy-900 px-4 py-2 text-xs font-bold text-white hover:bg-navy-800 transition shadow-xs"
                  >
                    {t.bookNow}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Everything you need to know about ServEase AI bookings and warranties.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-5 border border-slate-200">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
              How does the AI Diagnostic Assistant work?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              When you enter an issue such as "My RO purifier is making loud vibration noise," our built-in NLP engine evaluates the symptom, pinpoints the likely mechanical or filtration causes, asks relevant diagnostic questions, and provides an upfront price range before booking.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-slate-200">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
              What happens if extra spare parts are needed during repair?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Technicians cannot charge hidden fees. If extra work or parts are needed, the technician must submit a revised quote through the app. You will receive an instant notification to review and digitally approve the quote before extra work commences.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-slate-200">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
              What is the Digital Service Passport?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              It is a lifelong maintenance digital log for your registered home appliances and vehicles. It tracks all past repairs, warranties, and calculates automatic maintenance reminders so you never miss an essential filter change or oil service.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-slate-200">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
              Are emergency bookings really dispatched in 25 minutes?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Yes. In Emergency SOS Mode, the platform matches only currently online and available technicians stationed within a 4-kilometer radius of your address, with real-time route telemetry and zero fabricated guarantees.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Score Breakdown Modal */}
      {selectedTechForTrust && (
        <TrustBadgeModal
          isOpen={!!selectedTechForTrust}
          onClose={() => setSelectedTechForTrust(null)}
          technicianName={selectedTechForTrust.userId?.name || 'Technician'}
          trustScore={selectedTechForTrust.trustScore || 90}
          trustFactors={selectedTechForTrust.trustFactors}
        />
      )}
    </div>
  );
};
