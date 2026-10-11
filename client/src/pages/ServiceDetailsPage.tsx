import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Clock, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Zap, 
  Wrench,
  Sparkles,
  Award
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const ServiceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [service, setService] = useState<any | null>(null);
  const [topTechnicians, setTopTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await api.get(`/services/${id}`);
        if (res.data.success) {
          setService(res.data.service);
        }

        // Fetch matched technicians
        const techRes = await api.get('/technicians/search');
        if (techRes.data.success) {
          setTopTechnicians(techRes.data.technicians.slice(0, 2));
        }
      } catch (err) {
        console.error('Failed to load service:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading || !service) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  // Transparent calculation
  const visiting = service.visitingCharge || 149;
  const labor = service.basePrice || 499;
  const minParts = service.sparePartsEstimateMin || 0;
  const maxParts = service.sparePartsEstimateMax || 500;
  const minSubtotal = visiting + labor + minParts;
  const maxSubtotal = visiting + labor + maxParts;
  const minGst = Math.round(minSubtotal * 0.18);
  const maxGst = Math.round(maxSubtotal * 0.18);
  const minTotal = minSubtotal + minGst;
  const maxTotal = maxSubtotal + maxGst;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <Link to="/" className="hover:text-teal-600">Home</Link>
          <span>/</span>
          <Link to="/categories" className="hover:text-teal-600">Services</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">{service.title}</span>
        </div>

        {/* Main Header Card */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-bold text-teal-800">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{service.warrantyDays || 30}-Day Guarantee Included</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 leading-tight">
              {language === 'ta' && service.titleTa ? service.titleTa : service.title}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed">
              {language === 'ta' && service.descriptionTa ? service.descriptionTa : service.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-600">
              <div className="flex items-center gap-1 font-bold text-amber-600">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <span>{service.rating || 4.9}</span>
                <span className="text-slate-400 font-normal">({service.bookingCount || 240}+ booked)</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>Duration: ~{service.estimatedDurationMins || 60} mins</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>OEM Genuine Parts Only</span>
              </div>
            </div>
          </div>

          {/* Quick Booking Box */}
          <div className="rounded-2xl bg-gradient-to-br from-navy-950 to-navy-900 p-6 text-white shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-teal-400">Upfront Price Estimate</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">₹{minTotal}</span>
                <span className="text-xs text-slate-300">to ₹{maxTotal}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Includes inspection fee, base labor & 18% GST.
              </p>
            </div>

            <div className="space-y-3 mt-6">
              <Link
                to={`/booking/new?serviceId=${service._id}`}
                className="w-full rounded-xl bg-teal-500 hover:bg-teal-400 py-3 text-center text-sm font-bold text-white transition shadow-md flex items-center justify-center gap-2"
              >
                <span>Proceed to Book Pro</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to={`/booking/new?serviceId=${service._id}&emergency=true`}
                className="w-full rounded-xl bg-red-600/80 hover:bg-red-500 py-2.5 text-center text-xs font-bold text-white transition flex items-center justify-center gap-1.5 border border-red-500/50"
              >
                <span>Book Urgent (25-Min SOS)</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Feature C: Transparent Price Estimator Itemized Table */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy-900">Transparent Price Breakdown</h3>
              <p className="text-xs text-slate-500">Every rupee accounted for prior to technician dispatch</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold">
                <tr>
                  <th className="py-3 px-4 rounded-l-lg">Cost Component</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 rounded-r-lg text-right">Estimated Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{t.visitCharge}</td>
                  <td className="py-3.5 px-4 text-slate-500">Doorstep transit & multi-meter diagnostic inspection</td>
                  <td className="py-3.5 px-4 text-right font-bold">₹{visiting}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{t.laborCharge}</td>
                  <td className="py-3.5 px-4 text-slate-500">Certified technician standard repair & service labor</td>
                  <td className="py-3.5 px-4 text-right font-bold">₹{labor}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{t.estimatedParts}</td>
                  <td className="py-3.5 px-4 text-slate-500">Dependent on required filters, gas top-up, or mechanical parts</td>
                  <td className="py-3.5 px-4 text-right font-bold">₹{minParts} - ₹{maxParts}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{t.gstTax}</td>
                  <td className="py-3.5 px-4 text-slate-500">Government mandatory service tax invoice</td>
                  <td className="py-3.5 px-4 text-right font-bold">₹{minGst} - ₹{maxGst}</td>
                </tr>
                <tr className="bg-teal-50/50 text-slate-900 font-extrabold">
                  <td className="py-4 px-4 text-teal-900">{t.totalEstimated}</td>
                  <td className="py-4 px-4 text-teal-800 text-xs">Final digital invoice generated after work completion</td>
                  <td className="py-4 px-4 text-right text-base text-teal-800">₹{minTotal} - ₹{maxTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
            <span>
              <strong>Quote Approval Safeguard:</strong> If the technician discovers worn secondary parts requiring replacement beyond this estimate, they must submit a revised quote in the app for your digital approval before starting extra paid work.
            </span>
          </div>
        </div>

        {/* Included vs Excluded Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
            <h4 className="text-sm font-bold text-navy-900 flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-4 w-4 text-teal-600" />
              <span>What's Included in this Service</span>
            </h4>
            <ul className="space-y-2.5">
              {(service.includedFeatures || []).map((feat: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500 mt-2 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
            <h4 className="text-sm font-bold text-navy-900 flex items-center gap-2 mb-4">
              <XCircle className="h-4 w-4 text-slate-400" />
              <span>Exclusions & Notes</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 mt-2 shrink-0" />
                <span>Heavy physical masonry or concealed plumbing chiseling.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 mt-2 shrink-0" />
                <span>Non-OEM electrical modifications without safety earthing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 mt-2 shrink-0" />
                <span>Refrigerant gas refills require copper brazing if pressure leak is detected.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
