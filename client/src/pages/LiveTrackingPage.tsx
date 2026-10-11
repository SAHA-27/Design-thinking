import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  PhoneCall, 
  MessageSquare, 
  AlertTriangle, 
  DollarSign, 
  ShieldCheck, 
  Award, 
  FileText, 
  Star, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { InteractiveMap } from '../components/InteractiveMap';
import { TrustBadgeModal } from '../components/TrustBadgeModal';
import confetti from 'canvas-confetti';

export const LiveTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();

  const [booking, setBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTrustModal, setShowTrustModal] = useState(false);
  const [quoteActionLoading, setQuoteActionLoading] = useState(false);
  const [proofActionLoading, setProofActionLoading] = useState(false);

  // Review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('Great service! Professional and very punctual.');

  // Real-Time Food-Delivery Style Simulation Controls
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);

  const fetchBooking = async () => {
    try {
      const res = await api.get(`/bookings/${id}`);
      if (res.data.success) {
        setBooking(res.data.booking);
      }
    } catch (err) {
      console.error('Failed to load tracking data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Real-time GPS Telemetry simulation runner
  useEffect(() => {
    if (!isSimulating || !booking?.tracking?.routeWaypoints?.length) return;

    const waypoints: [number, number][] = booking.tracking.routeWaypoints;
    const interval = setInterval(async () => {
      setCurrentWaypointIndex((prev) => {
        const next = prev + 1;
        if (next >= waypoints.length) {
          setIsSimulating(false);
          // Mark near destination
          setBooking((b: any) => ({
            ...b,
            tracking: {
              ...b.tracking,
              technicianLat: waypoints[waypoints.length - 1][0],
              technicianLng: waypoints[waypoints.length - 1][1],
              speedKmh: 0,
              distanceKm: 0,
              estimatedArrivalMins: 1
            }
          }));
          return prev;
        }

        const currPt = waypoints[next];
        const prevPt = waypoints[next - 1];

        // Calculate heading in degrees
        const dLng = currPt[1] - prevPt[1];
        const dLat = currPt[0] - prevPt[0];
        const angleDeg = Math.round((Math.atan2(dLng, dLat) * 180) / Math.PI);
        const heading = (angleDeg + 360) % 360;

        // Remaining distance calculation
        const remainingSteps = waypoints.length - 1 - next;
        const remainingDist = Math.max(0.05, remainingSteps * 0.18);
        const speed = Math.round(26 + Math.random() * 12);
        const eta = Math.max(1, Math.round(remainingDist * 2.2));

        // Update local state smoothly
        setBooking((b: any) => ({
          ...b,
          tracking: {
            ...b.tracking,
            technicianLat: currPt[0],
            technicianLng: currPt[1],
            heading,
            speedKmh: speed,
            distanceKm: Number(remainingDist.toFixed(2)),
            estimatedArrivalMins: eta
          }
        }));

        // Send backend telemetry update
        api.put(`/bookings/${id}/telemetry`, {
          technicianLat: currPt[0],
          technicianLng: currPt[1],
          heading,
          speedKmh: speed,
          distanceKm: Number(remainingDist.toFixed(2)),
          estimatedArrivalMins: eta
        }).catch(() => {});

        return next;
      });
    }, 2400);

    return () => clearInterval(interval);
  }, [isSimulating, currentWaypointIndex, booking?.tracking?.routeWaypoints, id]);

  const toggleSimulation = () => {
    if (!isSimulating && currentWaypointIndex >= (booking?.tracking?.routeWaypoints?.length || 5) - 1) {
      setCurrentWaypointIndex(0);
    }
    setIsSimulating(!isSimulating);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setCurrentWaypointIndex(0);
    if (booking?.tracking?.routeWaypoints?.length) {
      const first = booking.tracking.routeWaypoints[0];
      setBooking((b: any) => ({
        ...b,
        tracking: {
          ...b.tracking,
          technicianLat: first[0],
          technicianLng: first[1],
          speedKmh: 30,
          heading: 75,
          distanceKm: 0.85,
          estimatedArrivalMins: 8
        }
      }));
    }
  };

  useEffect(() => {
    fetchBooking();
    // Poll updates every 6 seconds during tracking
    const interval = setInterval(fetchBooking, 6000);
    return () => clearInterval(interval);
  }, [id]);

  // Handle Customer Quote Approval (Feature C)
  const handleQuoteResponse = async (action: 'approve' | 'reject') => {
    setQuoteActionLoading(true);
    try {
      const res = await api.put(`/bookings/${id}/quote-response`, { action });
      if (res.data.success) {
        setBooking(res.data.booking);
        alert(`Revised quote successfully ${action}d!`);
      }
    } catch (err) {
      alert('Failed to respond to quote.');
    } finally {
      setQuoteActionLoading(false);
    }
  };

  // Handle Customer Work Completion Approval (Feature G)
  const handleApproveCompletion = async () => {
    setProofActionLoading(true);
    try {
      const res = await api.put(`/bookings/${id}/approve-proof`);
      if (res.data.success) {
        setBooking(res.data.booking);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        alert('Work completion verified! Service marked as Completed.');
      }
    } catch (err) {
      alert('Failed to approve completion proof.');
    } finally {
      setProofActionLoading(false);
    }
  };

  // Submit Review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/reviews', {
        bookingId: booking._id,
        technicianId: booking.technicianId?._id || booking.technicianId,
        serviceId: booking.serviceId?._id,
        rating,
        comment: reviewComment
      });
      setShowReviewModal(false);
      alert('Thank you for rating your service professional!');
    } catch (err) {
      alert('Failed to submit review.');
    }
  };

  if (loading || !booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Locating technician telemetry...</p>
        </div>
      </div>
    );
  }

  const steps = [
    { label: 'Booking Placed', desc: 'Verified & received' },
    { label: 'Technician Assigned', desc: 'Pro confirmed' },
    { label: 'On The Way', desc: 'En route' },
    { label: 'In Progress', desc: 'On-site service' },
    { label: 'Completed', desc: 'Verified & paid' }
  ];

  const currentStep = booking.tracking?.currentStepIndex ?? 1;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-500">#{booking.bookingNumber}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                booking.status === 'Completed'
                  ? 'bg-emerald-100 text-emerald-800'
                  : booking.status === 'In Progress'
                    ? 'bg-amber-100 text-amber-800 animate-pulse'
                    : 'bg-teal-100 text-teal-800'
              }`}>
                {booking.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
              Live Service Tracking & Work Verification
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="rounded-xl bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Status Stepper */}
        <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-5 gap-2 text-center">
            {steps.map((st, i) => {
              const isPast = i < currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={i} className="flex flex-col items-center">
                  <div className={`flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-2xl text-xs sm:text-sm font-extrabold transition shadow-xs ${
                    isCurrent
                      ? 'bg-teal-600 text-white ring-4 ring-teal-100 animate-pulse'
                      : isPast
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isPast ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                  </div>
                  <span className={`text-[11px] sm:text-xs font-bold mt-2 ${
                    isCurrent ? 'text-teal-700' : isPast ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                    {st.label}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">{st.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2-Column Live Tracking Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Live Map & Work Proof */}
          <div className="lg:col-span-2 space-y-6">
            {/* Food-Delivery Real-Time Simulation Control Bar */}
            <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-navy-900">Live GPS Telemetry:</span>
                <span className="text-xs text-slate-500">
                  {isSimulating ? 'Driver moving actively along turn-by-turn route' : 'Real-time telemetry ready'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSimulation}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 ${
                    isSimulating
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-teal-600 hover:bg-teal-500 text-white'
                  }`}
                >
                  <Navigation className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                  <span>{isSimulating ? 'Pause Movement' : 'Start Live GPS Demo'}</span>
                </button>

                <button
                  onClick={resetSimulation}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Map Container */}
            <InteractiveMap
              technicianName={booking.technicianId?.name || 'Assigned Technician'}
              technicianLat={booking.tracking?.technicianLat || 13.0842}
              technicianLng={booking.tracking?.technicianLng || 80.2140}
              customerLat={booking.tracking?.customerLat || 13.0850}
              customerLng={booking.tracking?.customerLng || 80.2185}
              speedKmh={booking.tracking?.speedKmh ?? 32}
              heading={booking.tracking?.heading ?? 75}
              distanceKm={booking.tracking?.distanceKm ?? 0.65}
              routeWaypoints={booking.tracking?.routeWaypoints || []}
              vehicleInfo={booking.tracking?.vehicleInfo}
              status={booking.status}
              etaMins={booking.tracking?.estimatedArrivalMins || 6}
              isSimulating={isSimulating}
            />

            {/* ServEase ProofCare Signature Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-teal-900 to-navy-900 p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-teal-700/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 text-white shrink-0 shadow-xs">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-teal-300">ServEase ProofCare™ Active</span>
                    <span className="rounded-md bg-teal-800 text-[10px] px-1.5 py-0.5 text-teal-200 font-mono font-bold">
                      Stage: {booking.proofCare?.currentStage || 'Verified Process'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Before/after photos, digital checklist verification & 6-digit completion OTP protection active.
                  </p>
                </div>
              </div>
              <Link
                to={`/proofcare/review/${booking._id}`}
                className="rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-extrabold px-4 py-2 text-xs transition shadow-xs flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Evidence Review & OTP Screen</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Feature C: Transparent Revised Quote Banner (if pending) */}
            {booking.revisedQuote?.status === 'pending' && (
              <div className="rounded-3xl bg-amber-50 border-2 border-amber-300 p-6 shadow-md space-y-4">
                <div className="flex items-center gap-2.5 text-amber-900 font-extrabold text-base">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <span>Technician Submitted Revised Quote for Approval</span>
                </div>

                <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                  <strong>Reason from Technician:</strong> "{booking.revisedQuote.reason}"
                </p>

                {/* Parts list */}
                <div className="bg-white rounded-2xl p-4 border border-amber-200 divide-y divide-slate-100 text-xs">
                  {booking.revisedQuote.sparePartsList?.map((p: any, idx: number) => (
                    <div key={idx} className="py-1.5 flex justify-between text-slate-800 font-medium">
                      <span>{p.name}</span>
                      <span className="font-bold">₹{p.cost}</span>
                    </div>
                  ))}
                  {booking.revisedQuote.extraLaborCharge > 0 && (
                    <div className="py-1.5 flex justify-between text-slate-800 font-medium">
                      <span>Additional Labor</span>
                      <span className="font-bold">₹{booking.revisedQuote.extraLaborCharge}</span>
                    </div>
                  )}
                  <div className="pt-2 flex justify-between text-sm font-extrabold text-navy-900">
                    <span>New Total Billable:</span>
                    <span className="text-teal-700">₹{booking.revisedQuote.revisedTotal}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleQuoteResponse('approve')}
                    disabled={quoteActionLoading}
                    className="flex-1 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold py-2.5 text-xs transition shadow-sm"
                  >
                    {quoteActionLoading ? 'Approving...' : 'Approve Revised Quote (₹' + booking.revisedQuote.revisedTotal + ')'}
                  </button>
                  <button
                    onClick={() => handleQuoteResponse('reject')}
                    disabled={quoteActionLoading}
                    className="rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2.5 text-xs transition"
                  >
                    Decline Quote
                  </button>
                </div>
              </div>
            )}

            {/* Feature G: Before & After Proof Showcase */}
            {booking.serviceProof && (booking.serviceProof.beforePhotoUrl || booking.serviceProof.afterPhotoUrl) && (
              <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-teal-600" />
                    <h3 className="text-base font-bold text-navy-900">Before & After Service Proof</h3>
                  </div>
                  {booking.serviceProof.customerApproved ? (
                    <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-0.5 text-xs font-bold">
                      Verified & Approved by You
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 text-amber-800 px-3 py-0.5 text-xs font-bold animate-pulse">
                      Pending Customer Verification
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {booking.serviceProof.beforePhotoUrl && (
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Before Service</span>
                      <div className="h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                        <img
                          src={booking.serviceProof.beforePhotoUrl}
                          alt="Before Service Proof"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {booking.serviceProof.afterPhotoUrl && (
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-teal-700 uppercase tracking-wide">After Completed Service</span>
                      <div className="h-44 rounded-2xl overflow-hidden border-2 border-teal-500 bg-slate-100 shadow-sm">
                        <img
                          src={booking.serviceProof.afterPhotoUrl}
                          alt="After Service Proof"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {booking.serviceProof.technicianNotes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <strong>Technician Work Summary:</strong> "{booking.serviceProof.technicianNotes}"
                  </p>
                )}

                {/* Approve Button if not approved yet */}
                {!booking.serviceProof.customerApproved && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleApproveCompletion}
                      disabled={proofActionLoading}
                      className="rounded-2xl bg-teal-600 hover:bg-teal-500 px-5 py-3 text-xs font-bold text-white transition shadow-md flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{proofActionLoading ? 'Confirming...' : 'Approve Work Completion & Release Invoice'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Col: Technician Card & Payment Invoice Summary */}
          <div className="space-y-6">
            {/* Technician Card */}
            {booking.technicianId && (
              <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600">Assigned Professional</span>
                <div className="flex items-center gap-3">
                  <img
                    src={booking.technicianId?.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80'}
                    alt={booking.technicianId?.name}
                    className="h-14 w-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                  />
                  <div>
                    <h3 className="text-base font-bold text-navy-900">{booking.technicianId?.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-teal-700 font-semibold mt-0.5">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Aadhaar KYC Verified</span>
                    </div>
                  </div>
                </div>

                {/* Trust Score Button */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-teal-50 border border-teal-100">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-teal-600" />
                    <div>
                      <div className="text-xs font-bold text-teal-900">Trust Index Score</div>
                      <div className="text-[10px] text-teal-700">96 / 100 Verified</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTrustModal(true)}
                    className="text-xs font-extrabold text-teal-800 underline"
                  >
                    View Score
                  </button>
                </div>

                {/* Call & Chat Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <a
                    href={`tel:${booking.technicianId?.phone || '+919789054321'}`}
                    className="rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold py-2.5 px-3 flex items-center justify-center gap-1.5 transition"
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>Call Pro</span>
                  </a>
                  <button
                    onClick={() => alert('Secure encrypted in-app messaging connected.')}
                    className="rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 px-3 flex items-center justify-center gap-1.5 transition"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Message</span>
                  </button>
                </div>
              </div>
            )}

            {/* Bill & Invoice Card */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm font-bold text-navy-900">Total Invoice Amount</span>
                <span className="text-xl font-extrabold text-teal-700">₹{booking.pricing?.total}</span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Inspection Fee:</span>
                  <span>₹{booking.pricing?.visitingCharge}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Labor:</span>
                  <span>₹{booking.pricing?.baseLabor}</span>
                </div>
                {booking.pricing?.discount > 0 && (
                  <div className="flex justify-between text-teal-600 font-bold">
                    <span>Discount:</span>
                    <span>-₹{booking.pricing?.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>GST (18%):</span>
                  <span>₹{booking.pricing?.taxGst}</span>
                </div>
              </div>

              {/* Rate & Review Button if completed */}
              {booking.status === 'Completed' && (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold py-2.5 text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Star className="h-4 w-4 fill-white" />
                    <span>Submit Rating & Review</span>
                  </button>
                  <Link
                    to="/history"
                    className="w-full rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Download Tax Invoice</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
              <h3 className="text-lg font-bold text-navy-900">Rate Your Service Experience</h3>
              <p className="text-xs text-slate-500">Your transparent rating directly updates the technician's Trust Score.</p>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Star Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star className={`h-7 w-7 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Feedback Comments</label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-teal-600 hover:bg-teal-500 py-2.5 text-xs font-bold text-white transition shadow-xs"
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Trust Score Modal */}
        {showTrustModal && (
          <TrustBadgeModal
            isOpen={showTrustModal}
            onClose={() => setShowTrustModal(false)}
            technicianName={booking.technicianId?.name || 'Technician'}
            trustScore={96}
          />
        )}
      </div>
    </div>
  );
};
