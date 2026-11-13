import React from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Clock, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Phone, 
  Briefcase, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { TechnicianItem } from '../data/mockTechnicians';

interface TechnicianProfileModalProps {
  technician: TechnicianItem | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (tech: TechnicianItem) => void;
  onViewAudit: (tech: TechnicianItem) => void;
}

export const TechnicianProfileModal: React.FC<TechnicianProfileModalProps> = ({
  technician,
  isOpen,
  onClose,
  onBookNow,
  onViewAudit
}) => {
  if (!isOpen || !technician) return null;

  const techName = technician.userId?.name || (technician as any).name || 'Verified Specialist';
  const techAvatar = technician.userId?.avatar || (technician as any).avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80';
  const skillsList = Array.isArray(technician.skills) ? technician.skills : [];
  const areasList = Array.isArray(technician.serviceAreas) ? technician.serviceAreas : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Profile info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100">
          <img
            src={techAvatar}
            alt={techName}
            className="h-20 w-20 rounded-2xl object-cover border-2 border-teal-500 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900">
                {techName}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 text-teal-700 px-2.5 py-0.5 text-xs font-bold border border-teal-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 fill-teal-100" />
                Verified Pro
              </span>
            </div>
            <p className="text-sm font-semibold text-teal-700">
              {technician.specialization}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1 font-bold text-amber-600">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                {technician.rating} ({technician.reviewCount} customer reviews)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                {technician.experienceYears} Years Experience
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                ~{technician.estimatedArrivalMins}m ETA ({technician.distanceKm} km)
              </span>
            </div>
          </div>
        </div>

        {/* Trust Score & Verification Banner */}
        <div className="my-6 rounded-2xl bg-gradient-to-r from-navy-900 to-navy-800 p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Verified Trust Credentials</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-white">{technician.trustScore}</span>
              <span className="text-slate-400 text-sm font-medium">/ 100 Smart Service Index</span>
            </div>
            <div className="text-xs text-slate-300 mt-1">
              ID Type: <span className="text-teal-200 font-semibold">{technician.idType}</span>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              onViewAudit(technician);
            }}
            className="self-start sm:self-center rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-400/40 px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Award className="h-4 w-4" />
            <span>Audit Score Factors</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 block font-medium">Jobs Done</span>
            <span className="text-lg font-extrabold text-navy-900">{technician.completedJobsCount}+</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 block font-medium">Completion Rate</span>
            <span className="text-lg font-extrabold text-teal-700">{technician.trustFactors?.completionRate || 98}%</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 block font-medium">Visiting Fee</span>
            <span className="text-lg font-extrabold text-navy-900">₹{technician.visitingFee}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 block font-medium">Rehire Rate</span>
            <span className="text-lg font-extrabold text-emerald-600">{technician.trustFactors?.rehireRate || 90}%</span>
          </div>
        </div>

        {/* Professional Bio */}
        <div className="mb-6 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">About the Professional</h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {technician.bio}
          </p>
        </div>

        {/* Specialized Skills */}
        <div className="mb-6 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Specialized Trade Skills</h4>
          <div className="flex flex-wrap gap-2">
            {skillsList.map((skill, idx) => (
              <span key={idx} className="rounded-xl bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-semibold text-teal-900">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Service Coverage Areas */}
        <div className="mb-6 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-teal-600" />
            <span>Service Areas in City</span>
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {areasList.map((area, idx) => (
              <span key={idx} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Customer Reviews Section */}
        {technician.reviews && technician.reviews.length > 0 && (
          <div className="mb-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-teal-600" />
              <span>Verified Customer Reviews</span>
            </h4>
            <div className="space-y-2">
              {technician.reviews.map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{rev.customerName}</span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="h-3 w-3 fill-amber-500" />
                      <span>{rev.rating}.0</span>
                      <span className="text-slate-400 font-normal ml-1">({rev.date})</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-400 block">Visiting & Inspection Charge</span>
            <span className="text-xl font-extrabold text-navy-900">₹{technician.visitingFee}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookNow(technician);
              }}
              className="rounded-xl bg-teal-600 hover:bg-teal-500 px-5 py-2.5 text-xs font-bold text-white transition shadow-md flex items-center gap-1.5"
            >
              <span>Book This Pro</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
