import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  Zap,
  SlidersHorizontal,
  RotateCcw,
  Eye,
  Calendar
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { TrustBadgeModal } from '../components/TrustBadgeModal';
import { TechnicianProfileModal } from '../components/TechnicianProfileModal';
import { QuickBookingModal } from '../components/QuickBookingModal';
import { mockTechnicians, TechnicianItem } from '../data/mockTechnicians';

export const TechnicianSearchPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [rawTechnicians, setRawTechnicians] = useState<TechnicianItem[]>(mockTechnicians);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals state
  const [selectedTechForTrust, setSelectedTechForTrust] = useState<TechnicianItem | null>(null);
  const [selectedTechForProfile, setSelectedTechForProfile] = useState<TechnicianItem | null>(null);
  const [selectedTechForBooking, setSelectedTechForBooking] = useState<TechnicianItem | null>(null);

  // Search & Filter controls
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('skill') || '');
  const [minRating, setMinRating] = useState('0');
  const [minTrust, setMinTrust] = useState('0');
  const [maxDistance, setMaxDistance] = useState('0');
  const [maxPrice, setMaxPrice] = useState('0');
  const [sortBy, setSortBy] = useState('recommended');
  const [emergencyOnly, setEmergencyOnly] = useState(searchParams.get('emergency') === 'true');

  useEffect(() => {
    const fetchTechnicians = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (categoryFilter) queryParams.set('skill', categoryFilter);
        if (emergencyOnly) queryParams.set('emergency', 'true');
        if (minRating !== '0') queryParams.set('minRating', minRating);

        const res = await api.get(`/technicians/search?${queryParams.toString()}`);
        if (res.data.success && Array.isArray(res.data.technicians) && res.data.technicians.length >= 12) {
          setRawTechnicians(res.data.technicians);
        } else {
          // If backend returns fewer than 12 (or during standalone/mock mode), ensure all 15 unique pros are loaded
          const backendList = Array.isArray(res.data?.technicians) ? res.data.technicians : [];
          const combined = [...mockTechnicians];
          
          // Merge any unique backend ones if not in mock
          backendList.forEach((bTech: any) => {
            const bName = bTech?.userId?.name || bTech?.name;
            if (bName && !combined.some(m => (m.userId?.name || (m as any).name) === bName)) {
              combined.push(bTech);
            }
          });
          setRawTechnicians(combined);
        }
      } catch (err) {
        console.warn('Backend API search unavailable, falling back to local dataset:', err);
        setRawTechnicians(mockTechnicians);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, [categoryFilter, emergencyOnly, minRating]);

  // Sync emergency toggle
  const handleEmergencyToggle = () => {
    const next = !emergencyOnly;
    setEmergencyOnly(next);
    if (next) searchParams.set('emergency', 'true');
    else searchParams.delete('emergency');
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setMinRating('0');
    setMinTrust('0');
    setMaxDistance('0');
    setMaxPrice('0');
    setSortBy('recommended');
    setEmergencyOnly(false);
    searchParams.delete('emergency');
    searchParams.delete('skill');
    searchParams.delete('q');
    setSearchParams(searchParams);
  };

  // Filtered & Sorted Technicians
  const filteredTechnicians = useMemo(() => {
    let list = [...rawTechnicians];

    // 1. Text Search (Name, Specialization, Skills, Category, Bio)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((tech) => {
        const name = tech.userId?.name || (tech as any).name || '';
        const nameMatch = name.toLowerCase().includes(q);
        const specMatch = tech.specialization?.toLowerCase().includes(q);
        const catMatch = tech.category?.toLowerCase().includes(q);
        const bioMatch = tech.bio?.toLowerCase().includes(q);
        const skillMatch = Array.isArray(tech.skills) && tech.skills.some((s) => s.toLowerCase().includes(q));
        const areaMatch = Array.isArray(tech.serviceAreas) && tech.serviceAreas.some((a) => a.toLowerCase().includes(q));
        return nameMatch || specMatch || catMatch || bioMatch || skillMatch || areaMatch;
      });
    }

    // 2. Category / Trade Skill Filter
    if (categoryFilter) {
      const cat = categoryFilter.toLowerCase();
      list = list.filter((tech) => {
        const catMatch = tech.category?.toLowerCase().includes(cat);
        const specMatch = tech.specialization?.toLowerCase().includes(cat);
        const skillsMatch = Array.isArray(tech.skills) && tech.skills.some((s) => s.toLowerCase().includes(cat));
        return catMatch || specMatch || skillsMatch;
      });
    }

    // 3. Customer Rating Filter
    if (minRating !== '0') {
      const min = parseFloat(minRating);
      list = list.filter((tech) => (tech.rating || 0) >= min);
    }

    // 4. Trust Score Filter
    if (minTrust !== '0') {
      const minT = parseInt(minTrust, 10);
      list = list.filter((tech) => (tech.trustScore || 0) >= minT);
    }

    // 5. Max Distance Filter
    if (maxDistance !== '0') {
      const maxD = parseFloat(maxDistance);
      list = list.filter((tech) => (tech.distanceKm || 0) <= maxD);
    }

    // 6. Max Price (Visiting Charge) Filter
    if (maxPrice !== '0') {
      const maxP = parseInt(maxPrice, 10);
      list = list.filter((tech) => (tech.visitingFee || 0) <= maxP);
    }

    // 7. Emergency SOS Only Filter
    if (emergencyOnly) {
      list = list.filter((tech) => tech.emergencyAvailable && tech.isAvailable);
    }

    // 8. Sorting
    list.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'distance':
          return (a.distanceKm || 0) - (b.distanceKm || 0);
        case 'price':
          return (a.visitingFee || 0) - (b.visitingFee || 0);
        case 'trust':
          return (b.trustScore || 0) - (a.trustScore || 0);
        case 'eta':
          return (a.estimatedArrivalMins || 0) - (b.estimatedArrivalMins || 0);
        case 'recommended':
        default:
          // Composite Smart Match score
          const scoreA = (a.rating * 20) + (a.trustScore * 0.4) - (a.distanceKm * 2);
          const scoreB = (b.rating * 20) + (b.trustScore * 0.4) - (b.distanceKm * 2);
          return scoreB - scoreA;
      }
    });

    return list;
  }, [
    rawTechnicians,
    searchQuery,
    categoryFilter,
    minRating,
    minTrust,
    maxDistance,
    maxPrice,
    emergencyOnly,
    sortBy
  ]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
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
              Connect with 15+ certified professionals ranked by proximity, specialized trade skills, audited Trust Scores, and verified reviews.
            </p>
          </div>

          {/* Emergency SOS Mode Toggle */}
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

        {/* Search Bar & Multi-Faceted Filters */}
        <div className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          
          {/* Main Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by technician name, trade skill (e.g. 'AC', 'Plumber', 'RO', 'CCTV', 'Laptop')..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-500 focus:outline-hidden transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Controls Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
            
            {/* Category / Trade Skill */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Trade Skill
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-teal-500"
              >
                <option value="">All Trade Skills</option>
                <option value="AC">AC Repair Specialist</option>
                <option value="Electrician">Electrician</option>
                <option value="RO Water">RO Purifier Tech</option>
                <option value="Plumbing">Plumber</option>
                <option value="Washing Machine">Washing Machine Repair</option>
                <option value="Refrigerator">Refrigerator Repair</option>
                <option value="Home Appliance">Home Appliance Tech</option>
                <option value="CCTV">CCTV Security Pro</option>
                <option value="Bike">Bike Service Pro</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Painter">Painter</option>
                <option value="Laptop">Laptop Repair Specialist</option>
                <option value="Inverter">Inverter & Battery Pro</option>
                <option value="Maintenance">General Handyman</option>
                <option value="Smart Home">Smart Home Automation</option>
              </select>
            </div>

            {/* Customer Rating */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Minimum Rating
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-teal-500"
              >
                <option value="0">All Ratings</option>
                <option value="4.5">4.5★ and above</option>
                <option value="4.8">4.8★ and above</option>
                <option value="4.9">4.9★ and above</option>
              </select>
            </div>

            {/* Trust Score */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Trust Score
              </label>
              <select
                value={minTrust}
                onChange={(e) => setMinTrust(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-teal-500"
              >
                <option value="0">All Trust Scores</option>
                <option value="90">90+ Index</option>
                <option value="95">95+ Index (Elite)</option>
                <option value="98">98+ Index (Top 1%)</option>
              </select>
            </div>

            {/* Distance Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Distance
              </label>
              <select
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-teal-500"
              >
                <option value="0">Any Distance</option>
                <option value="2">Within 2.0 km</option>
                <option value="3">Within 3.0 km</option>
                <option value="5">Within 5.0 km</option>
              </select>
            </div>

            {/* Max Visiting Charge */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Visiting Fee
              </label>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-teal-500"
              >
                <option value="0">Any Price</option>
                <option value="120">Under ₹120</option>
                <option value="150">Under ₹150</option>
                <option value="200">Under ₹200</option>
              </select>
            </div>

            {/* Sorting */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-xl border border-teal-300 bg-teal-50/60 px-2.5 py-2 text-xs font-bold text-teal-900 focus:outline-hidden"
              >
                <option value="recommended">Recommended (Smart Match)</option>
                <option value="rating">Highest Rated</option>
                <option value="distance">Nearest Technician</option>
                <option value="price">Lowest Visiting Fee</option>
                <option value="trust">Highest Trust Score</option>
                <option value="eta">Fastest Arrival Time</option>
              </select>
            </div>
          </div>

          {/* Results Summary and Reset */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-navy-900">{filteredTechnicians.length}</span>
              <span>verified professionals available matching your preferences</span>
            </div>

            {(searchQuery || categoryFilter || minRating !== '0' || minTrust !== '0' || maxDistance !== '0' || maxPrice !== '0' || emergencyOnly || sortBy !== 'recommended') && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-800 font-bold transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Technician Cards (Responsive Grid: 3 Desktop, 2 Tablet, 1 Mobile) */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-500">Matching verified technicians near you...</p>
          </div>
        ) : filteredTechnicians.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center border border-slate-200">
            <Search className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No technicians found with current criteria</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Try adjusting your search terms or click "Reset All Filters" to view all 15+ available professionals.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-5 py-2.5 transition shadow-xs"
            >
              Reset Filters & Show All
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTechnicians.map((tech, idx) => {
              const techName = tech.userId?.name || (tech as any).name || 'Verified Specialist';
              const techAvatar = tech.userId?.avatar || (tech as any).avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80';
              const techId = tech._id || (typeof tech.userId === 'object' ? tech.userId?._id : null) || `tech-${idx}`;
              const skillsList = Array.isArray(tech.skills) ? tech.skills : [];
              const reasonsList = Array.isArray(tech.recommendationReasons) ? tech.recommendationReasons : [];

              return (
                <div
                  key={techId}
                  className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Header: Avatar, Name, Verified Badge, Rating, ETA */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={techAvatar}
                            alt={techName}
                            className="h-16 w-16 rounded-2xl object-cover border border-slate-200 shadow-xs group-hover:scale-105 transition"
                          />
                          {tech.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-teal-600 text-white p-0.5 rounded-full border-2 border-white shadow-xs">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-navy-900 flex items-center gap-1.5">
                            <span>{techName}</span>
                          </h3>
                          <p className="text-xs font-semibold text-teal-700 leading-tight">
                            {tech.specialization || tech.category}
                          </p>
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-600 mt-1">
                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                            <span>{tech.rating}</span>
                            <span className="text-slate-400 font-normal">({tech.reviewCount} reviews)</span>
                          </div>
                        </div>
                      </div>

                      {/* ETA & Distance Pill */}
                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 border border-teal-200 px-2.5 py-1 text-xs font-bold text-teal-800">
                          <Clock className="h-3 w-3 text-teal-600" />
                          <span>~{tech.estimatedArrivalMins}m ETA</span>
                        </span>
                        <span className="block text-[11px] text-slate-400 mt-0.5 font-medium">
                          {tech.distanceKm} km away
                        </span>
                      </div>
                    </div>

                    {/* Experience & Completion Badge */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-3 pb-2 border-b border-slate-100">
                      <span className="font-semibold text-slate-700">{tech.experienceYears} Years Exp</span>
                      <span>•</span>
                      <span className="text-teal-700 font-bold">{tech.trustFactors?.completionRate || 98}% Completion</span>
                      <span>•</span>
                      <span className="text-slate-500">{tech.completedJobsCount || 100}+ Jobs Done</span>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                      {tech.bio || 'Certified specialist providing on-site multi-point inspections and repairs.'}
                    </p>

                    {/* Recommendation Reasons */}
                    {reasonsList.length > 0 && (
                      <div className="space-y-1 mb-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-teal-600" />
                          <span>Why Recommended:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {reasonsList.slice(0, 2).map((reason: string, rIdx: number) => (
                            <span key={rIdx} className="text-[11px] text-slate-700 font-medium inline-flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills badges */}
                    <div className="flex flex-wrap gap-1 mb-3.5">
                      {skillsList.slice(0, 3).map((sk: string, sIdx: number) => (
                        <span key={sIdx} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                          {sk}
                        </span>
                      ))}
                      {skillsList.length > 3 && (
                        <span className="rounded-md bg-teal-50 px-1.5 py-0.5 text-[10px] font-bold text-teal-800">
                          +{skillsList.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Trust Score Pill with Audit Trigger */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-teal-50/80 to-emerald-50/80 border border-teal-200/60 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white shadow-xs">
                          <Award className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-navy-900 block leading-tight">Trust Score</span>
                          <span className="text-[10px] text-teal-700 font-semibold">{tech.trustScore} / 100 Index</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedTechForTrust(tech)}
                        className="text-xs font-bold text-teal-800 hover:text-teal-900 underline"
                      >
                        Audit Factors
                      </button>
                    </div>
                  </div>

                  {/* Bottom Bar: Visiting Fee, View Profile & Book CTA */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Visiting Fee</span>
                      <span className="text-base font-extrabold text-navy-900">₹{tech.visitingFee || 149}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTechForProfile(tech)}
                        className="rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 px-2.5 py-2 text-xs font-bold text-slate-700 transition flex items-center gap-1"
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                        <span>Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedTechForBooking(tech)}
                        className="rounded-xl bg-teal-600 hover:bg-teal-500 px-3.5 py-2 text-xs font-bold text-white transition shadow-sm flex items-center gap-1"
                      >
                        <span>Book This Pro</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 1. Trust Score Breakdown Modal */}
        {selectedTechForTrust && (
          <TrustBadgeModal
            isOpen={!!selectedTechForTrust}
            onClose={() => setSelectedTechForTrust(null)}
            technicianName={selectedTechForTrust.userId?.name || (selectedTechForTrust as any).name || 'Technician'}
            trustScore={selectedTechForTrust.trustScore || 90}
            trustFactors={selectedTechForTrust.trustFactors}
          />
        )}

        {/* 2. Detailed Technician Profile Modal */}
        {selectedTechForProfile && (
          <TechnicianProfileModal
            isOpen={!!selectedTechForProfile}
            onClose={() => setSelectedTechForProfile(null)}
            technician={selectedTechForProfile}
            onBookNow={(tech) => setSelectedTechForBooking(tech)}
            onViewAudit={(tech) => setSelectedTechForTrust(tech)}
          />
        )}

        {/* 3. Direct Appointment Slot Booking Modal */}
        {selectedTechForBooking && (
          <QuickBookingModal
            isOpen={!!selectedTechForBooking}
            onClose={() => setSelectedTechForBooking(null)}
            technician={selectedTechForBooking}
            isEmergencyDefault={emergencyOnly}
          />
        )}
      </div>
    </div>
  );
};
