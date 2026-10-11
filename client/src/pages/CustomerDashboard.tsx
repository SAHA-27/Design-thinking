import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Bot, 
  Zap, 
  Wrench, 
  CreditCard, 
  FileText, 
  Sparkles,
  TrendingUp,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [bookings, setBookings] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [insights, setInsights] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, assetsRes, insightsRes] = await Promise.all([
          api.get('/bookings/my-bookings'),
          api.get('/passport/assets'),
          api.get('/passport/insights')
        ]);

        if (bookingsRes.data.success) setBookings(bookingsRes.data.bookings);
        if (assetsRes.data.success) setAssets(assetsRes.data.assets);
        if (insightsRes.data.success) setInsights(insightsRes.data.insights);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeBookings = bookings.filter(b => ['Pending', 'Accepted', 'Technician on the Way', 'In Progress'].includes(b.status));
  const completedBookings = bookings.filter(b => b.status === 'Completed');

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="h-4 w-4" />
              <span>Customer Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Hello, {user?.name || 'Customer'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Monitor active technician dispatches, view digital service passport countdowns, and manage household appliances.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/ai-assistant"
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-teal-500 transition shadow-sm"
            >
              <Bot className="h-4 w-4" />
              <span>AI Trouble Diagnostic</span>
            </Link>
            <Link
              to="/categories"
              className="inline-flex items-center gap-1.5 rounded-xl bg-navy-800 border border-slate-700 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-200 hover:bg-navy-700 transition"
            >
              <span>Book New Service</span>
            </Link>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Active Bookings</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">{activeBookings.length}</div>
              <span className="text-xs text-teal-600 font-medium">In live dispatch</span>
            </div>
            <div className="rounded-xl bg-teal-50 p-3 text-teal-600">
              <Clock className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Registered Assets</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">{assets.length}</div>
              <span className="text-xs text-emerald-600 font-medium">In Digital Passport</span>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">6-Month Budget Forecast</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
                ₹{insights?.estimated6MonthBudget || 2920}
              </div>
              <span className="text-xs text-purple-600 font-medium">Predictive maintenance</span>
            </div>
            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* ACTIVE BOOKINGS SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-navy-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-teal-600" />
              <span>Active Dispatches & In-Progress Services</span>
            </h2>
            <Link to="/bookings" className="text-xs font-bold text-teal-600 hover:underline">
              View All History
            </Link>
          </div>

          {activeBookings.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center border border-slate-200">
              <CheckCircle2 className="h-10 w-10 text-teal-500 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-semibold text-slate-800">No active bookings right now</p>
              <p className="text-xs text-slate-500 mt-1">All your appliances and vehicles are running smoothly.</p>
              <Link
                to="/categories"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-500 transition shadow-xs"
              >
                <span>Browse Services</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeBookings.map((b) => (
                <div key={b._id} className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    {/* Status & ID */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-slate-500">#{b.bookingNumber}</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        b.status === 'In Progress' 
                          ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                          : b.status === 'Technician on the Way'
                            ? 'bg-teal-100 text-teal-800 border border-teal-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-navy-900 mb-1">
                      {b.serviceId?.title || 'Home Service'}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                      "{b.problemDescription}"
                    </p>

                    {/* Pro details if assigned */}
                    {b.technicianId && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 mb-3">
                        <img
                          src={b.technicianId?.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80'}
                          alt={b.technicianId?.name}
                          className="h-10 w-10 rounded-full object-cover border border-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">{b.technicianId?.name}</div>
                          <div className="text-[11px] text-slate-500">Assigned Certified Specialist</div>
                        </div>
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-md">
                          ETA ~{b.tracking?.estimatedArrivalMins || 15}m
                        </span>
                      </div>
                    )}

                    {/* Revised Quote Alert Banner if pending */}
                    {b.revisedQuote?.status === 'pending' && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 mb-3 text-xs text-amber-900">
                        <div className="flex items-center gap-1.5 font-bold mb-1">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                          <span>Revised Quote Requires Your Approval</span>
                        </div>
                        <p className="text-amber-800 text-[11px]">
                          Technician quoted additional parts/labor (Total: ₹{b.revisedQuote.revisedTotal}). Click below to review.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Total Est.</span>
                      <span className="text-sm font-bold text-slate-900">₹{b.pricing?.total}</span>
                    </div>
                    <Link
                      to={`/track/${b._id}`}
                      className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-500 transition shadow-xs flex items-center gap-1.5"
                    >
                      <span>Live Tracking & Controls</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DIGITAL SERVICE PASSPORT PREVENTIVE REMINDERS */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-navy-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span>Digital Service Passport — Upcoming Maintenance Alert</span>
              </h2>
              <p className="text-xs text-slate-500">
                Automated schedule based on recommended service intervals for your registered appliances & vehicles.
              </p>
            </div>
            <Link
              to="/passport"
              className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
            >
              <span>Manage Passport Assets</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assets.map((asset) => (
              <div key={asset._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {asset.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      asset.healthStatus === 'Service Due'
                        ? 'bg-rose-100 text-rose-700 font-extrabold'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {asset.healthStatus}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{asset.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{asset.brand} • {asset.model || asset.serialOrPlateNumber}</p>
                  
                  <div className="mt-3 p-2.5 rounded-xl bg-white border border-slate-100 text-xs">
                    <div className="text-slate-400 text-[11px]">Next Due Date:</div>
                    <div className="font-bold text-slate-800">{asset.nextMaintenanceDate || '2026-11-15'}</div>
                  </div>
                </div>

                <Link
                  to={`/booking/new?assetId=${asset._id}`}
                  className="mt-4 w-full rounded-xl bg-white border border-slate-300 py-2 text-center text-xs font-bold text-slate-800 hover:border-teal-500 hover:text-teal-700 transition"
                >
                  Schedule Preventive Care
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK REBOOK PREVIOUS SERVICES */}
        {completedBookings.length > 0 && (
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-navy-900 flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-teal-600" />
              <span>1-Click Quick Rebook</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {completedBookings.map((cb) => (
                <div key={cb._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{cb.serviceId?.title || 'Periodic Service'}</h4>
                    <p className="text-[11px] text-slate-500">Last performed on {cb.scheduledDate}</p>
                    <span className="text-xs font-bold text-teal-700">₹{cb.pricing?.total}</span>
                  </div>
                  <Link
                    to={`/booking/new?serviceId=${cb.serviceId?._id || cb.serviceId}`}
                    className="rounded-xl bg-navy-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-navy-800 transition"
                  >
                    Rebook
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
