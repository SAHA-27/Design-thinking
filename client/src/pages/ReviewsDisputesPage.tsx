import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ShieldCheck, 
  AlertTriangle, 
  MessageSquare, 
  CheckCircle2, 
  Send,
  HelpCircle 
} from 'lucide-react';
import api from '../services/api';

export const ReviewsDisputesPage: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [bookingId, setBookingId] = useState('663000000000000000000001');
  const [category, setCategory] = useState('Quality of Work');
  const [description, setDescription] = useState('');
  const [desiredResolution, setDesiredResolution] = useState('Free Revisit / Partial Refund');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Seed review for demo display
    setReviews([
      {
        id: 'rev-1',
        customer: 'Karthik Raman',
        technician: 'Manoj Velu',
        service: 'Bike & Scooter General Service',
        rating: 5,
        comment: 'Exceptional service! Manoj arrived exactly on time with all proper tools. My Activa feels super smooth after the engine oil replacement and brake adjustment.',
        date: '2026-09-25',
        technicianReply: 'Thank you Mr. Karthik! Next service reminder is scheduled in 3 months on your ServEase Passport.'
      },
      {
        id: 'rev-2',
        customer: 'Priya Sundaram',
        technician: 'Arun Kumar',
        service: 'RO Water Purifier Service',
        rating: 5,
        comment: 'Very professional. TDS before service was 340, now calibrated down to 82 ppm. No hidden charges!',
        date: '2026-10-02',
        technicianReply: 'Delighted to keep your drinking water safe! Replaced pre-filter with genuine certified parts.'
      }
    ]);
  }, []);

  const handleFileDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/reviews/complaint', {
        bookingId,
        category,
        description,
        desiredResolution
      });
      if (res.data.success) {
        alert(res.data.message);
        setDescription('');
      }
    } catch (err) {
      alert('Failed to register dispute.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-teal-600">Integrity & Quality</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
            Ratings, Verified Reviews & Dispute Resolution
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Read transparent reviews from real bookings or file a formal warranty dispute for immediate admin mediation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Verified Customer Reviews */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-navy-900">Verified Customer Experiences</h2>
            
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900">{r.customer}</div>
                      <div className="text-xs text-slate-500">Service: {r.service} • Pro: {r.technician}</div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    "{r.comment}"
                  </p>

                  {r.technicianReply && (
                    <div className="p-3 rounded-2xl bg-teal-50/60 border border-teal-100 text-xs text-teal-900">
                      <span className="font-bold block text-teal-800">Technician Response:</span>
                      <p className="mt-0.5">{r.technicianReply}</p>
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 block pt-1">Verified Booking on {r.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Col: File Formal Complaint / Dispute */}
          <div className="space-y-4">
            <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <AlertTriangle className="h-5 w-5" />
                <span>File Dispute / Warranty Complaint</span>
              </div>
              <p className="text-xs text-slate-500">
                Backed by ServEase 30-Day Guarantee. Admin Operations reviews within 2 hours.
              </p>

              <form onSubmit={handleFileDispute} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Booking Reference ID</label>
                  <input
                    type="text"
                    required
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Complaint Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                  >
                    <option value="Quality of Work">Quality of Work</option>
                    <option value="Billing Dispute">Billing Dispute</option>
                    <option value="Punctuality / Delay">Punctuality / Delay</option>
                    <option value="Damage to Asset">Damage to Asset</option>
                    <option value="Professional Behavior">Professional Behavior</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description of Issue</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide specific details about the issue..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Desired Resolution</label>
                  <select
                    value={desiredResolution}
                    onChange={(e) => setDesiredResolution(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                  >
                    <option value="Free Revisit / Partial Refund">Free Revisit / Partial Refund</option>
                    <option value="Full Refund">Full Refund</option>
                    <option value="Senior Inspector Re-Audit">Senior Inspector Re-Audit</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold py-2.5 text-xs transition shadow-xs flex items-center justify-center gap-2"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Submit to Admin Desk'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
