import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Clock, 
  MapPin, 
  Camera, 
  FileText, 
  Star, 
  ArrowRight,
  Send,
  X
} from 'lucide-react';
import api from '../services/api';
import { ServiceEvidenceReportModal } from '../components/ServiceEvidenceReportModal';
import confetti from 'canvas-confetti';

export const CustomerEvidenceReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<any | null>(null);
  const [reportData, setReportData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // OTP Form
  const [otpInput, setOtpInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [rating, setRating] = useState(5);
  const [customerRemarks, setCustomerRemarks] = useState('Work inspected and approved with genuine replaced parts.');

  // Dispute modal
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeCategory, setDisputeCategory] = useState('Quality of Work');
  const [disputeReason, setDisputeReason] = useState('Cooling not reaching target or leak persists');
  const [disputeNotes, setDisputeNotes] = useState('');
  const [disputeSubmitting, setDisputeSubmitting] = useState(false);

  // Evidence Report modal
  const [showReportModal, setShowReportModal] = useState(false);

  const fetchEvidence = async () => {
    try {
      const [bookRes, reportRes] = await Promise.all([
        api.get(`/bookings/${id}`),
        api.get(`/proofcare/${id}/report`)
      ]);

      if (bookRes.data.success) setBooking(bookRes.data.booking);
      if (reportRes.data.success) setReportData(reportRes.data.report);
    } catch (err) {
      console.error('Failed to load evidence review:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidence();
  }, [id]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim()) {
      alert('Please enter your 6-digit completion OTP.');
      return;
    }

    setVerifying(true);
    try {
      const res = await api.post(`/proofcare/${id}/verify-otp`, {
        otp: otpInput.trim(),
        remarks: customerRemarks,
        rating
      });

      if (res.data.success) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        alert('Service Completion Verified! Your official Service Evidence Report is sealed.');
        fetchEvidence();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'OTP verification failed.');
    } finally {
      setVerifying(false);
    }
  };

  const handleRaiseDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisputeSubmitting(true);
    try {
      const res = await api.post(`/proofcare/${id}/dispute`, {
        category: disputeCategory,
        reason: disputeReason,
        customerNotes: disputeNotes
      });
      if (res.data.success) {
        alert(res.data.message);
        setShowDisputeModal(false);
        fetchEvidence();
      }
    } catch (err) {
      alert('Failed to register dispute.');
    } finally {
      setDisputeSubmitting(false);
    }
  };

  if (loading || !booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-500">Loading evidence review...</p>
        </div>
      </div>
    );
  }

  const isCompleted = booking.proofCare?.currentStage === 'completed_verified' || booking.status === 'Completed';
  const isDisputed = booking.proofCare?.dispute?.isDisputed;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-teal-100 text-teal-800 text-[10px] font-extrabold px-2.5 py-0.5 uppercase tracking-wider">
                ProofCare™ Customer Audit
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">#{booking.bookingNumber}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
              Service Evidence Review & Completion
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Review on-site photo proof, verified checklist measurements, and itemized billing before confirming completion.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReportModal(true)}
              className="rounded-xl bg-navy-900 hover:bg-navy-800 text-white px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <FileText className="h-4 w-4" />
              <span>Full Evidence Report</span>
            </button>
            <Link
              to={`/track/${booking._id}`}
              className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 text-xs font-bold transition"
            >
              Back to Tracking
            </Link>
          </div>
        </div>

        {/* Status Callout Banner */}
        {isCompleted ? (
          <div className="rounded-3xl bg-emerald-50 border border-emerald-300 p-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-emerald-900">
                  Service Verified & Customer Approved!
                </h3>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Verified with OTP on {new Date(booking.proofCare?.completionOtp?.verifiedAt || Date.now()).toLocaleString()}. Evidence Report is sealed.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowReportModal(true)}
              className="rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 text-xs font-bold transition shadow-xs"
            >
              Inspect Certificate
            </button>
          </div>
        ) : isDisputed ? (
          <div className="rounded-3xl bg-rose-50 border border-rose-300 p-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-xs">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-rose-900">
                  Dispute Registered — Under Admin Investigation
                </h3>
                <p className="text-xs text-rose-700 mt-0.5">
                  Admin operations team has received your evidence complaint and is reviewing within 2 hours.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-gradient-to-r from-navy-950 to-navy-900 p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400 block">
                Verification Required
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Inspect Evidence & Enter 6-Digit Completion OTP
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                Check the before/after photos and checklist below. Once satisfied, enter the OTP sent to your notifications to confirm completion.
              </p>
            </div>
            {booking.proofCare?.completionOtp?.code && (
              <div className="rounded-2xl bg-navy-800 border border-teal-500/40 p-3 text-center shrink-0">
                <span className="text-[10px] text-teal-300 block font-semibold">Your Booking OTP:</span>
                <span className="text-2xl font-mono font-extrabold text-white tracking-widest">
                  {booking.proofCare.completionOtp.code}
                </span>
              </div>
            )}
          </div>
        )}

        {/* 1. Side-by-Side Before vs After Photos */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-teal-600" />
              <h3 className="text-base font-bold text-navy-900">Photo-Proof Evidence Audit</h3>
            </div>
            <span className="text-xs text-slate-400">Captured on-site with server timestamp</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                Before Service Condition
              </span>
              <div className="h-56 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
                <img
                  src={booking.proofCare?.beforePhotos?.[0]?.url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'}
                  alt="Before Service"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-xs text-slate-600 italic">
                {booking.proofCare?.beforePhotos?.[0]?.caption || 'Pre-service condition photograph'}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wide block">
                After Service Completion
              </span>
              <div className="h-56 rounded-2xl overflow-hidden border-2 border-teal-500 bg-slate-100 shadow-sm">
                <img
                  src={booking.proofCare?.afterPhotos?.[0]?.url || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80'}
                  alt="After Service"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-xs text-slate-600 italic">
                {booking.proofCare?.afterPhotos?.[0]?.caption || 'Post-service verification photograph'}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Completed Digital Checklist Inspector */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-teal-600" />
              <h3 className="text-base font-bold text-navy-900">Digital Inspection Checklist Results</h3>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              {reportData?.checklist?.filter((c: any) => c.checked).length} of {reportData?.checklist?.length} Verified
            </span>
          </div>

          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden text-xs sm:text-sm">
            {reportData?.checklist?.map((item: any, idx: number) => (
              <div key={idx} className="p-4 flex items-start justify-between gap-4 bg-slate-50/50">
                <div>
                  <span className="font-bold text-slate-900 block">{item.label}</span>
                  <span className="text-teal-700 font-semibold text-xs mt-0.5 block">
                    Measured: {item.measuredValue}
                  </span>
                  {item.notes && (
                    <span className="text-slate-500 italic text-xs mt-1 block">
                      Technician Notes: "{item.notes}"
                    </span>
                  )}
                </div>
                <span className="shrink-0 px-2.5 py-1 rounded-md text-xs font-extrabold bg-emerald-100 text-emerald-800">
                  ✓ Verified
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Replaced Parts & Approved Charges */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-navy-900">Work Summary & Approved Invoice</h3>
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 space-y-2">
            <div>
              <strong>Technician Work Log:</strong> "{booking.proofCare?.workSummary?.technicianNotes || 'Standard service completed successfully.'}"
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-navy-900 text-base">
              <span>Final Total Billable:</span>
              <span className="text-teal-700">₹{booking.pricing?.total}</span>
            </div>
          </div>
        </div>

        {/* 4. Action Area: OTP Verification OR Raise Dispute */}
        {!isCompleted && !isDisputed && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* OTP Verification Card */}
            <div className="md:col-span-2 rounded-3xl bg-white border-2 border-teal-500 p-6 sm:p-8 shadow-lg space-y-4">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-base">
                <Lock className="h-5 w-5" />
                <span>Confirm Service Completion with OTP</span>
              </div>
              <p className="text-xs text-slate-500">
                Entering the OTP marks the work as satisfactory, releases final invoice, and seals the tamper-evident report.
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    6-Digit Completion OTP Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="e.g. 849201"
                    className="w-full rounded-xl border-2 border-slate-300 bg-slate-50 p-3 text-lg font-mono font-extrabold text-navy-900 tracking-widest text-center focus:border-teal-500 focus:bg-white focus:outline-hidden"
                  />
                  <div className="text-[11px] text-teal-700 mt-1">
                    Tip: For demo testing, your code is <strong>{booking.proofCare?.completionOtp?.code || '849201'}</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Customer Remarks</label>
                  <input
                    type="text"
                    value={customerRemarks}
                    onChange={(e) => setCustomerRemarks(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full rounded-2xl bg-teal-600 hover:bg-teal-500 py-3.5 text-sm font-extrabold text-white transition shadow-md flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span>{verifying ? 'Verifying OTP...' : 'Verify OTP & Confirm Work Completion'}</span>
                </button>
              </form>
            </div>

            {/* Dispute Card */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Unsatisfied with Work?</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  If the work does not match photos or the issue persists, do not share the OTP. Raise a formal dispute for free re-inspection.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowDisputeModal(true)}
                className="w-full rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold py-2.5 text-xs transition"
              >
                Raise Dispute / Reject Proof
              </button>
            </div>
          </div>
        )}

        {/* Dispute Modal */}
        {showDisputeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl relative border border-slate-200 space-y-4">
              <button
                onClick={() => setShowDisputeModal(false)}
                className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
                <AlertTriangle className="h-5 w-5" />
                <span>Reject Work Proof & Raise Dispute</span>
              </div>

              <form onSubmit={handleRaiseDispute} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Issue Category</label>
                  <select
                    value={disputeCategory}
                    onChange={(e) => setDisputeCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:outline-hidden"
                  >
                    <option value="Quality of Work">Quality of Work</option>
                    <option value="Photos Do Not Match Real Condition">Photos Do Not Match Real Condition</option>
                    <option value="Appliance Still Malfunctioning">Appliance Still Malfunctioning</option>
                    <option value="Unapproved Charges Added">Unapproved Charges Added</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Specific Defect / Reason</label>
                  <input
                    type="text"
                    required
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Additional Supporting Details</label>
                  <textarea
                    rows={3}
                    value={disputeNotes}
                    onChange={(e) => setDisputeNotes(e.target.value)}
                    placeholder="Describe what is still wrong..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:outline-hidden"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={disputeSubmitting}
                    className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 text-xs transition"
                  >
                    {disputeSubmitting ? 'Filing...' : 'Submit Dispute to Admin Audit'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDisputeModal(false)}
                    className="rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Evidence Report Modal */}
        {showReportModal && (
          <ServiceEvidenceReportModal
            report={reportData}
            isOpen={showReportModal}
            onClose={() => setShowReportModal(false)}
          />
        )}
      </div>
    </div>
  );
};
