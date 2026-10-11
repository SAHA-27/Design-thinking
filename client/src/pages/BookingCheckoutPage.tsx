import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Tag, 
  DollarSign, 
  CreditCard,
  User as UserIcon,
  Phone
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const BookingCheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const serviceIdParam = searchParams.get('serviceId');
  const technicianIdParam = searchParams.get('technicianId');
  const assetIdParam = searchParams.get('assetId');
  const isEmergencyParam = searchParams.get('emergency') === 'true';

  const [service, setService] = useState<any | null>(null);
  const [technician, setTechnician] = useState<any | null>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [problemDescription, setProblemDescription] = useState(
    searchParams.get('problem') || 'Need comprehensive inspection and service.'
  );
  const [scheduledDate, setScheduledDate] = useState('2026-10-15');
  const [scheduledTime, setScheduledTime] = useState('10:00 AM - 12:00 PM');
  const [emergencyMode, setEmergencyMode] = useState(isEmergencyParam);
  const [selectedAssetId, setSelectedAssetId] = useState(assetIdParam || '');

  // Address
  const [street, setStreet] = useState('Flat 4B, Emerald Towers, 4th Main Road');
  const [area, setArea] = useState('Anna Nagar');
  const [city, setCity] = useState('Chennai');
  const [pincode, setPincode] = useState('600040');
  const [phone, setPhone] = useState(user?.phone || '+91 98401 23456');

  // Coupon
  const [couponCode, setCouponCode] = useState('SERVE50');
  const [appliedDiscount, setAppliedDiscount] = useState(50);
  const [couponMessage, setCouponMessage] = useState('Promo code SERVE50 applied (₹50 discount)!');
  const [paymentMethod, setPaymentMethod] = useState('UPI / Online Card');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load default service if none specified
        const srvId = serviceIdParam || '662000000000000000000003';
        const srvRes = await api.get(`/services/${srvId}`);
        if (srvRes.data.success) {
          setService(srvRes.data.service);
        }

        if (technicianIdParam) {
          const techRes = await api.get(`/technicians/${technicianIdParam}`);
          if (techRes.data.success) {
            setTechnician(techRes.data.technician);
          }
        }

        // Load customer assets
        if (isAuthenticated) {
          const assetRes = await api.get('/passport/assets');
          if (assetRes.data.success) {
            setAssets(assetRes.data.assets);
          }
        }
      } catch (err) {
        console.error('Failed to load checkout context:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serviceIdParam, technicianIdParam, isAuthenticated]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const upper = couponCode.trim().toUpperCase();
    if (upper === 'SERVE50') {
      setAppliedDiscount(50);
      setCouponMessage('Promo code SERVE50 applied (₹50 off)!');
    } else if (upper === 'SMARTAI') {
      const disc = Math.min(200, Math.round(((service?.basePrice || 499) + (service?.visitingCharge || 149)) * 0.15));
      setAppliedDiscount(disc);
      setCouponMessage(`Promo code SMARTAI applied (₹${disc} off)!`);
    } else if (upper === 'WELCOME100') {
      setAppliedDiscount(100);
      setCouponMessage('Promo code WELCOME100 applied (₹100 off)!');
    } else {
      setAppliedDiscount(0);
      setCouponMessage('Invalid promo code. Try SERVE50 or SMARTAI.');
    }
  };

  // Price calculations
  const visiting = service?.visitingCharge || 149;
  const labor = service?.basePrice || 499;
  const parts = service?.sparePartsEstimateMin || 0;
  const emergencyCost = emergencyMode ? 100 : 0;
  const subtotal = Math.max(0, visiting + labor + parts + emergencyCost - appliedDiscount);
  const taxGst = Math.round(subtotal * 0.18);
  const total = subtotal + taxGst;

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please sign in to confirm booking.');
      navigate('/auth');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        serviceId: service._id,
        technicianId: technician?.userId?._id || technician?.userId,
        scheduledDate: emergencyMode ? new Date().toISOString().split('T')[0] : scheduledDate,
        scheduledTime: emergencyMode ? 'Immediate (25-min Dispatch)' : scheduledTime,
        serviceAddress: { street, area, city, pincode, phone },
        problemDescription,
        emergencyMode,
        couponCode,
        paymentMethod,
        registeredAssetId: selectedAssetId || undefined
      };

      const res = await api.post('/bookings', payload);
      if (res.data.success) {
        navigate(`/track/${res.data.booking._id}`);
      }
    } catch (err: any) {
      console.error('Booking failed:', err);
      alert(err.response?.data?.message || 'Failed to place booking.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !service) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-teal-600">Secure Checkout</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
            Confirm Booking & Transparent Estimate
          </h1>
        </div>

        <form onSubmit={handleCreateBooking} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Form Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Summary Card */}
            <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={service.imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80'}
                  alt={service.title}
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80';
                  }}
                  className="h-16 w-16 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h3 className="text-base font-bold text-navy-900">{service.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>~{service.estimatedDurationMins} mins duration</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">{service.warrantyDays}-day warranty</span>
                  </div>
                </div>
              </div>
              <Link to="/categories" className="text-xs font-bold text-teal-600 hover:underline">
                Change
              </Link>
            </div>

            {/* Emergency Mode Toggle Card */}
            <div className={`rounded-3xl p-5 border transition flex items-start gap-4 ${
              emergencyMode ? 'bg-rose-50 border-rose-300 shadow-sm' : 'bg-white border-slate-200'
            }`}>
              <input
                type="checkbox"
                id="emergencyToggle"
                checked={emergencyMode}
                onChange={(e) => setEmergencyMode(e.target.checked)}
                className="mt-1 h-5 w-5 rounded-md border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
              />
              <label htmlFor="emergencyToggle" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-slate-900">Emergency Priority Dispatch Mode</span>
                  <span className="rounded-full bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                    25-Min SOS
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Requires urgent attention? Dispatches nearest certified on-duty pro with shortest travel ETA (+₹100 priority fee).
                </p>
              </label>
            </div>

            {/* Problem Description */}
            <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-navy-900">1. Problem Description</h3>
              <textarea
                required
                rows={3}
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="Describe what's wrong (e.g. AC cooling dropped, making buzzing noise, water dripping from vent)..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs sm:text-sm focus:border-teal-500 focus:bg-white focus:outline-hidden"
              />

              {/* Digital Passport Link */}
              {assets.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Link with Digital Service Passport Appliance / Vehicle:
                  </label>
                  <select
                    value={selectedAssetId}
                    onChange={(e) => setSelectedAssetId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800"
                  >
                    <option value="">None (Generic Service)</option>
                    {assets.map((ast) => (
                      <option key={ast._id} value={ast._id}>
                        {ast.name} ({ast.brand} - {ast.serialOrPlateNumber})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Schedule Slot */}
            {!emergencyMode && (
              <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-navy-900">2. Select Preferred Schedule</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm focus:border-teal-500 focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot Window</label>
                    <select
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm focus:border-teal-500 focus:bg-white focus:outline-hidden"
                    >
                      <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM (Early Morning)</option>
                      <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM (Morning Slot)</option>
                      <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM (Afternoon Slot)</option>
                      <option value="05:00 PM - 07:00 PM">05:00 PM - 07:00 PM (Evening Slot)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Service Address */}
            <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-navy-900">3. Service Address & Contact</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Street Address / House No.</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm focus:border-teal-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Locality / Area</label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm focus:border-teal-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm focus:border-teal-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm focus:border-teal-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm focus:border-teal-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Transparent Price Breakdown & Confirmation */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-navy-900 border-b border-slate-100 pb-3">
                Transparent Price Estimator
              </h3>

              {/* Line items */}
              <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="flex justify-between">
                  <span>{t.visitCharge}</span>
                  <span className="font-semibold">₹{visiting}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.laborCharge}</span>
                  <span className="font-semibold">₹{labor}</span>
                </div>
                {parts > 0 && (
                  <div className="flex justify-between">
                    <span>{t.estimatedParts}</span>
                    <span className="font-semibold">₹{parts}</span>
                  </div>
                )}
                {emergencyMode && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>Priority 25-Min Dispatch Fee</span>
                    <span>+₹100</span>
                  </div>
                )}
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-teal-600 font-bold">
                    <span>Promotional Discount</span>
                    <span>-₹{appliedDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500 text-xs">
                  <span>Mandatory GST (18%)</span>
                  <span>₹{taxGst}</span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between text-base font-extrabold text-navy-900">
                  <span>{t.totalEstimated}</span>
                  <span className="text-xl text-teal-700">₹{total}</span>
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code (e.g. SERVE50)"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs uppercase font-bold focus:border-teal-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="rounded-xl bg-navy-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-navy-800 transition"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className="text-[11px] text-teal-700 font-medium mt-1">{couponMessage}</p>
                )}
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Payment Method</label>
                <div className="space-y-2">
                  {['UPI / Online Card', 'Cash on Service', 'Wallet'].map((m) => (
                    <label key={m} className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs cursor-pointer hover:bg-slate-100">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === m}
                        onChange={() => setPaymentMethod(m)}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span className="font-semibold text-slate-800">{m}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-teal-600 hover:bg-teal-500 py-3.5 text-sm font-extrabold text-white transition shadow-lg flex items-center justify-center gap-2"
              >
                <span>{submitting ? 'Placing Dispatch...' : 'Confirm & Dispatch Professional'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
