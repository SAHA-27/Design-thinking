import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Filter, 
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { TrustBadgeModal } from '../components/TrustBadgeModal';

export const TechnicianSearchPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTechForTrust, setSelectedTechForTrust] = useState<any | null>(null);

  // Filters
  const [skillFilter, setSkillFilter] = useState(searchParams.get('skill') || '');
  const [emergencyOnly, setEmergencyOnly] = useState(searchParams.get('emergency') === 'true');
  const [minRating, setMinRating] = useState('0');

  useEffect(() => {
    const fetchTechnicians = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (skillFilter) queryParams.set('skill', skillFilter);
        if (emergencyOnly) queryParams.set('emergency', 'true');
        if (minRating !== '0') queryParams.set('minRating', minRating);

        const res = await api.get(`/technicians/search?${queryParams.toString()}`);
        if (res.data.success) {
          setTechnicians(res.data.technicians);
        }
      } catch (err) {
        console.error('Failed to load technicians:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, [skillFilter, emergencyOnly, minRating]);

  const handleEmergencyToggle = () => {
    const next = !emergencyOnly;
    setEmergencyOnly(next);
    if (next) searchParams.set('emergency', 'true');
    else searchParams.delete('emergency');
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-600 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Smart Algorithmic Matching</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
              Find & Compare Verified Technicians
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Ranked by distance, specialized skills, Trust Scores, and verified customer reviews.
            </p>
          </div>

          {/* Feature E: Emergency Mode Toggle */}
          <button
            onClick={handleEmergencyToggle}
            className={`rounded-2xl p-3 sm:px-5 sm:py-3.5 border transition flex items-center gap-3 shadow-md ${
              emergencyOnly
                ? 'bg-rose-600 text-white border-rose-700 shadow-rose-200'
                : 'bg-white text-slate-700 border-slate-200 hover:border-rose-400'
            }`}
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${emergencyOnly ? 'bg-white/20' : 'bg-rose-50 text-rose-600'}`}>
              <AlertTriangle className="h-5 w-5 animate-pulse" />
            </div>
            <div className="text-left">
              <div className="text-xs font-extrabold uppercase tracking-wide">
                {emergencyOnly ? 'Emergency SOS Active' : 'Emergency 25-Min SOS'}
              </div>
              <div className="text-[11px] opacity-90">
                {emergencyOnly ? 'Showing urgent dispatch pros' : 'Click to prioritize nearby online pros'}
              </div>
            </div>
          </button>
        </div>

        {/* Filter bar */}
        <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" /> Filter by:
            </span>
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-hidden"
            >
              <option value="">All Trade Skills</option>
              <option value="RO Water">RO Purifiers</option>
              <option value="AC">Air Conditioners</option>
              <option value="Bike">Bike & Scooter</option>
              <option value="Car">Car Service</option>
              <option value="Electrician">Electrical</option>
              <option value="Plumbing">Plumbing</option>
            </select>

            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-hidden"
            >
              <option value="0">All Ratings</option>
              <option value="4.5">4.5★ and above</option>
              <option value="4.8">4.8★ and above</option>
            </select>
          </div>

          <span className="text-xs text-slate-500 font-semibold">
            {technicians.length} certified professionals matching your area
          </span>
        </div>

        {/* Technicians List / Cards */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-500">Matching nearby technicians...</p>
          </div>
        ) : technicians.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center border border-slate-200">
            <Search className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">No technicians found with current filters</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting the trade skill or emergency toggle.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicians.map((tech) => (
              <div
                key={tech._id}
                className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-xl transition flex flex-col justify-between"
              >
                <div>
                  {/* Top Header: Avatar, Name, Distance & ETA */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={tech.userId?.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80'}
                        alt={tech.userId?.name}
                        className="h-16 w-16 rounded-2xl object-cover border border-slate-200 shadow-xs"
                      />
                      <div>
                        <h3 className="text-base font-bold text-navy-900 flex items-center gap-1.5">
                          {tech.userId?.name}
                          <CheckCircle2 className="h-4 w-4 text-teal-600 fill-teal-100" />
                        </h3>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-600 mt-0.5">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          <span>{tech.rating}</span>
                          <span className="text-slate-400 font-normal">({tech.reviewCount} reviews)</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {tech.experienceYears} years active experience
                        </div>
                      </div>
                    </div>

                    {/* ETA Pill */}
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 border border-teal-200 px-2.5 py-1 text-xs font-bold text-teal-800">
                        <Clock className="h-3 w-3 text-teal-600" />
                        <span>~{tech.estimatedArrivalMins}m ETA</span>
                      </span>
                      <span className="block text-[11px] text-slate-400 mt-0.5">
                        {tech.distanceKm} km away
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {tech.bio || 'Certified specialist providing on-site multi-point inspections and repairs.'}
                  </p>

                  {/* Feature B: Smart Match Reasons */}
                  <div className="space-y-1.5 mb-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-teal-600" />
                      <span>Why Recommended for You:</span>
                    </div>
                    {tech.recommendationReasons?.map((reason: string, rIdx: number) => (
                      <div key={rIdx} className="text-xs text-slate-700 flex items-center gap-1.5 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tech.skills?.map((sk: string, sIdx: number) => (
                      <span key={sIdx} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                        {sk}
                      </span>
                    ))}
                  </div>

                  {/* Feature F: Service Trust Score Pill with Modal trigger */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-teal-50/80 to-emerald-50/80 border border-teal-200/60 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white">
                        <Award className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-navy-900 block leading-tight">Trust Score</span>
                        <span className="text-[10px] text-teal-700 font-semibold">{tech.trustScore} / 100 Index</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTechForTrust(tech)}
                      className="text-xs font-extrabold text-teal-800 hover:text-teal-900 underline"
                    >
                      Audit Factors
                    </button>
                  </div>
                </div>

                {/* Bottom Bar: Visiting Fee & Book CTA */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Visiting Charge</span>
                    <span className="text-sm font-extrabold text-navy-900">₹{tech.visitingFee || 149}</span>
                  </div>
                  <Link
                    to={`/booking/new?technicianId=${tech.userId?._id}${emergencyOnly ? '&emergency=true' : ''}`}
                    className="rounded-xl bg-teal-600 hover:bg-teal-500 px-4 py-2 text-xs font-bold text-white transition shadow-xs flex items-center gap-1"
                  >
                    <span>Book This Pro</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

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
    </div>
  );
};
