import React from 'react';
import { ShieldCheck, CheckCircle2, Award, AlertCircle, X, ThumbsUp } from 'lucide-react';

interface TrustBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  technicianName: string;
  trustScore: number;
  trustFactors?: {
    idVerified: boolean;
    completionRate: number;
    punctualityRate: number;
    rehireRate: number;
    zeroComplaintBadge: boolean;
  };
}

export const TrustBadgeModal: React.FC<TrustBadgeModalProps> = ({
  isOpen,
  onClose,
  technicianName,
  trustScore,
  trustFactors = {
    idVerified: true,
    completionRate: 98,
    punctualityRate: 96,
    rehireRate: 89,
    zeroComplaintBadge: true
  }
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl relative border border-slate-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 border border-teal-200">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Service Trust Score Breakdown</h3>
            <p className="text-xs text-slate-500">Transparent verification metrics for {technicianName}</p>
          </div>
        </div>

        {/* Big Score Gauge */}
        <div className="rounded-xl bg-gradient-to-r from-navy-900 to-navy-800 p-5 text-white flex items-center justify-between mb-5 shadow-inner">
          <div>
            <div className="text-xs uppercase tracking-wider text-teal-400 font-semibold">ServEase Verified Index</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold text-white">{trustScore}</span>
              <span className="text-slate-300 font-medium text-lg">/ 100</span>
            </div>
            <div className="text-xs text-slate-300 mt-1">
              Top 5% of certified professionals in this area.
            </div>
          </div>
          <div className="rounded-full bg-teal-500/20 p-3 border border-teal-400/40 text-teal-300">
            <Award className="h-9 w-9" />
          </div>
        </div>

        {/* Explainable factors */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-teal-600 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-slate-800">Government ID & Police Clearance</div>
                <div className="text-xs text-slate-500">Aadhaar KYC & criminal background verified</div>
              </div>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2.5 py-1 rounded-full">+30 Pts</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-teal-600 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-slate-800">Job Completion Ratio ({trustFactors.completionRate}%)</div>
                <div className="text-xs text-slate-500">Zero unexcused dropouts on accepted bookings</div>
              </div>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2.5 py-1 rounded-full">+28 Pts</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-teal-600 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-slate-800">Punctuality Score ({trustFactors.punctualityRate}%)</div>
                <div className="text-xs text-slate-500">Arrives within booked time slot window</div>
              </div>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2.5 py-1 rounded-full">+24 Pts</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <ThumbsUp className="h-5 w-5 text-teal-600 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-slate-800">Zero Active Complaints Record</div>
                <div className="text-xs text-slate-500">100% dispute resolution and positive feedback</div>
              </div>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2.5 py-1 rounded-full">+14 Pts</span>
          </div>
        </div>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Transparent Guarantee:</strong> Trust Scores are mathematically audited and never influenced by advertising fees or sponsorships.
          </span>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-navy-900 py-3 text-sm font-bold text-white hover:bg-navy-800 transition shadow-md"
        >
          Got It, Thanks
        </button>
      </div>
    </div>
  );
};
