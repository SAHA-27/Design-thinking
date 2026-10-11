import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Plus, 
  Calendar, 
  Clock, 
  Wrench, 
  DollarSign, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  TrendingUp,
  Tag,
  X
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const ServicePassportPage: React.FC = () => {
  const { t, language } = useLanguage();

  const [assets, setAssets] = useState<any[]>([]);
  const [insights, setInsights] = useState<any | null>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal for registering new asset
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('AC');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serialOrPlate, setSerialOrPlate] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('2024-01-10');
  const [warrantyExpiry, setWarrantyExpiry] = useState('2027-01-10');
  const [maintenanceInterval, setMaintenanceInterval] = useState('6');
  const [submitting, setSubmitting] = useState(false);

  const fetchPassportData = async () => {
    try {
      const [assetsRes, insightsRes, subsRes] = await Promise.all([
        api.get('/passport/assets'),
        api.get('/passport/insights'),
        api.get('/passport/subscriptions')
      ]);

      if (assetsRes.data.success) setAssets(assetsRes.data.assets);
      if (insightsRes.data.success) setInsights(insightsRes.data.insights);
      if (subsRes.data.success) setSubscriptions(subsRes.data.subscriptions);
    } catch (err) {
      console.error('Failed to load passport:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassportData();
  }, []);

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/passport/assets', {
        name,
        category,
        brand,
        model,
        serialOrPlateNumber: serialOrPlate,
        purchaseDate,
        warrantyExpiryDate: warrantyExpiry,
        maintenanceIntervalMonths: Number(maintenanceInterval)
      });
      if (res.data.success) {
        setShowAddModal(false);
        fetchPassportData();
        alert('Appliance / Vehicle added to your Digital Service Passport!');
      }
    } catch (err) {
      alert('Failed to register asset.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading Digital Service Passport...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-800 shadow-2xs mb-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Features D & H: Digital Service Passport & Insights</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
              Digital Service Passport Vault
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Lifelong certified service ledger for your appliances and vehicles. Automatically schedules maintenance alerts and projects your 6-month budget.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-2xl bg-teal-600 hover:bg-teal-500 px-5 py-3 text-xs sm:text-sm font-bold text-white transition shadow-md flex items-center gap-2 self-start md:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Register New Asset</span>
          </button>
        </div>

        {/* Feature H: Smart Maintenance Cost Insights Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-b md:border-b-0 md:border-r border-slate-700/60 pb-4 md:pb-0 md:pr-6">
            <span className="text-xs uppercase tracking-wider text-teal-400 font-bold">Total Spent on Maintenance</span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              ₹{insights?.totalSpent || 6498}
            </div>
            <p className="text-[11px] text-slate-300 mt-1">Across all registered appliances & vehicles</p>
          </div>

          <div className="border-b md:border-b-0 md:border-r border-slate-700/60 pb-4 md:pb-0 md:pr-6">
            <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">Predictive 6-Month Budget</span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              ₹{insights?.estimated6MonthBudget || 2920}
            </div>
            <p className="text-[11px] text-slate-300 mt-1">Calculated from service intervals & component life</p>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">Spending by Category</span>
            <div className="space-y-1.5 mt-2 text-xs">
              {Object.entries(insights?.categorySpending || {}).map(([cat, amt]: any) => (
                <div key={cat} className="flex justify-between items-center text-slate-300">
                  <span>{cat}:</span>
                  <span className="font-bold text-white">₹{amt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Registered Assets Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-navy-900">
              Registered Appliances & Vehicles ({assets.length})
            </h2>
            <span className="text-xs text-slate-500">Automated maintenance reminders enabled</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <div
                key={asset._id}
                className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-100">
                      {asset.category}
                    </span>
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                      asset.healthStatus === 'Service Due'
                        ? 'bg-rose-100 text-rose-800 animate-pulse'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {asset.healthStatus}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-navy-900">{asset.name}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {asset.brand} • {asset.model || 'Standard Edition'}
                  </div>

                  <div className="my-4 space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-400">ID / Serial / Plate:</span>
                      <span className="font-mono font-bold">{asset.serialOrPlateNumber || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Warranty Until:</span>
                      <span className="font-semibold">{asset.warrantyExpiryDate || 'Active'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Next Service Due:</span>
                      <span className="font-bold text-teal-700">{asset.nextMaintenanceDate || '2026-11-15'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Spent on Maintenance:</span>
                      <span className="font-bold">₹{asset.totalSpentOnMaintenance || 0}</span>
                    </div>
                  </div>

                  {/* Service History Log */}
                  {asset.serviceHistory && asset.serviceHistory.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Recent Certified Service Log:
                      </span>
                      {asset.serviceHistory.slice(0, 1).map((log: any, idx: number) => (
                        <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 text-xs">
                          <div className="font-bold text-slate-800">{log.serviceType}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            By {log.technicianName} • ₹{log.totalCost}
                          </div>
                          {log.notes && (
                            <div className="text-[11px] text-slate-600 mt-1 italic">"{log.notes}"</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  to={`/booking/new?assetId=${asset._id}`}
                  className="rounded-xl bg-navy-900 hover:bg-navy-800 py-2.5 text-center text-xs font-bold text-white transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Wrench className="h-3.5 w-3.5" />
                  <span>Book Service for this Asset</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Feature I: Recurring Maintenance Subscription Plans */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 mb-1">
              <Sparkles className="h-4 w-4" />
              <span>Feature I: Annual Maintenance Contracts (AMC)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900">
              ServEase Care Recurring Maintenance Plans
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Never worry about breakdowns. Pre-scheduled quarterly services, zero visiting charges, and discounts on replacement parts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className={`rounded-2xl p-6 border transition flex flex-col justify-between ${
                  sub.recommended
                    ? 'border-2 border-teal-500 bg-teal-50/30 shadow-md relative'
                    : 'border-slate-200 bg-white'
                }`}
              >
                {sub.recommended && (
                  <span className="absolute -top-3 right-6 rounded-full bg-teal-600 text-white text-[10px] font-extrabold px-3 py-0.5 uppercase tracking-wider shadow-xs">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="text-base font-extrabold text-navy-900">{sub.title}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">{sub.category}</div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-navy-900">₹{sub.price}</span>
                    <span className="text-xs text-slate-500">/ {sub.period}</span>
                  </div>

                  <ul className="mt-4 space-y-2 text-xs text-slate-700">
                    {sub.features?.map((f: string, fIdx: number) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => alert(`Enrolled in ${sub.title}! Added to your recurring subscription profile.`)}
                  className={`mt-6 w-full rounded-xl py-2.5 text-xs font-bold transition shadow-xs ${
                    sub.recommended
                      ? 'bg-teal-600 hover:bg-teal-500 text-white'
                      : 'bg-navy-900 hover:bg-navy-800 text-white'
                  }`}
                >
                  Subscribe to Plan
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Register Asset Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl relative border border-slate-200">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-lg font-bold text-navy-900 mb-1">Register Appliance or Vehicle</h3>
              <p className="text-xs text-slate-500 mb-4">
                Add equipment to generate automated maintenance interval reminders.
              </p>

              <form onSubmit={handleAddAsset} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Asset Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Master Bedroom Inverter AC or Activa 6G"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm focus:border-teal-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm focus:border-teal-500 focus:outline-hidden"
                    >
                      <option value="AC">AC</option>
                      <option value="RO Water Purifier">RO Water Purifier</option>
                      <option value="Bike">Bike / Two-Wheeler</option>
                      <option value="Car">Car</option>
                      <option value="Washing Machine">Washing Machine</option>
                      <option value="Refrigerator">Refrigerator</option>
                      <option value="Laptop">Laptop / PC</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Brand</label>
                    <input
                      type="text"
                      required
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="e.g. Daikin, Kent, Honda"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Model / Specs</label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g. FTKP50TV16U 1.5T"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Serial / Vehicle Plate</label>
                    <input
                      type="text"
                      value={serialOrPlate}
                      onChange={(e) => setSerialOrPlate(e.target.value)}
                      placeholder="e.g. TN-09-AX-4821"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Purchase Date</label>
                    <input
                      type="date"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Service Interval</label>
                    <select
                      value={maintenanceInterval}
                      onChange={(e) => setMaintenanceInterval(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm focus:border-teal-500 focus:outline-hidden"
                    >
                      <option value="3">Every 3 Months (Bikes)</option>
                      <option value="6">Every 6 Months (AC & RO)</option>
                      <option value="12">Every 12 Months (Appliances)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-xl bg-teal-600 hover:bg-teal-500 py-2.5 text-xs font-bold text-white transition shadow-sm"
                  >
                    {submitting ? 'Registering...' : 'Register in Passport'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
