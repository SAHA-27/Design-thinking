import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  MapPin, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  Camera, 
  ArrowRight, 
  Plus, 
  X,
  Clock,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import { ProofCareTechnicianWizard } from '../components/ProofCareTechnicianWizard';

export const TechnicianBookingManagement: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ProofCare wizard state
  const [activeProofCareWizardJob, setActiveProofCareWizardJob] = useState<any | null>(null);

  // Quote modal state
  const [activeQuoteJob, setActiveQuoteJob] = useState<any | null>(null);
  const [extraLabor, setExtraLabor] = useState('250');
  const [partName, setPartName] = useState('Replacement Copper Line');
  const [partCost, setPartCost] = useState('350');
  const [quoteReason, setQuoteReason] = useState('Existing pipe has crack causing water leakage.');

  // Proof modal state
  const [activeProofJob, setActiveProofJob] = useState<any | null>(null);
  const [beforeUrl, setBeforeUrl] = useState('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80');
  const [afterUrl, setAfterUrl] = useState('https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80');
  const [workNotes, setWorkNotes] = useState('Job complete. Pressure flush test passed with 0 leaks.');

  const fetchJobs = async () => {
    try {
      const res = await api.get('/bookings/technician-jobs');
      if (res.data.success) {
        setJobs(res.data.bookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleUpdateStatus = async (jobId: string, newStatus: string) => {
    try {
      const res = await api.put(`/bookings/${jobId}/status`, { status: newStatus });
      if (res.data.success) {
        fetchJobs();
        alert(`Status updated to: ${newStatus}`);
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleSubmitRevisedQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuoteJob) return;

    try {
      const res = await api.post(`/bookings/${activeQuoteJob._id}/quote`, {
        extraLaborCharge: Number(extraLabor),
        sparePartsList: [{ name: partName, cost: Number(partCost) }],
        reason: quoteReason
      });
      if (res.data.success) {
        setActiveQuoteJob(null);
        fetchJobs();
        alert('Revised quote submitted to customer for live approval!');
      }
    } catch (err) {
      alert('Failed to submit quote.');
    }
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProofJob) return;

    try {
      const res = await api.post(`/bookings/${activeProofJob._id}/proof`, {
        beforePhotoUrl: beforeUrl,
        afterPhotoUrl: afterUrl,
        technicianNotes: workNotes,
        partsReplaced: [partName]
      });
      if (res.data.success) {
        setActiveProofJob(null);
        fetchJobs();
        alert('Before-and-after proof submitted for customer completion review!');
      }
    } catch (err) {
      alert('Failed to upload proof.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-teal-600">Active Work Orders</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
            Technician Dispatch & Job Milestone Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Accept dispatches, advance job milestones, submit price revisions, and document before-and-after proof.
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-500">Loading work orders...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5"
              >
                {/* Header line */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-bold text-slate-500">#{job.bookingNumber}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                      job.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : job.status === 'In Progress'
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : 'bg-teal-100 text-teal-800'
                    }`}>
                      {job.status}
                    </span>
                    {job.emergencyMode && (
                      <span className="bg-rose-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        25-Min Emergency SOS
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{job.scheduledDate} ({job.scheduledTime})</span>
                  </div>
                </div>

                {/* Service info & address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                  <div>
                    <h3 className="text-base font-bold text-navy-900 mb-1">
                      {job.serviceId?.title || 'Home Appliance Service'}
                    </h3>
                    <p className="text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
                      <strong>Customer Complaint:</strong> "{job.problemDescription}"
                    </p>

                    <div className="space-y-1 text-slate-600">
                      <div><strong>Customer:</strong> {job.customerId?.name || 'Customer'}</div>
                      <div><strong>Contact:</strong> {job.serviceAddress?.phone || '+91 98401 23456'}</div>
                      <div className="flex items-start gap-1 text-slate-700">
                        <MapPin className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>{job.serviceAddress?.street}, {job.serviceAddress?.area}, {job.serviceAddress?.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Quotes summary */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Base Estimate:</span>
                        <span className="font-bold">₹{job.pricing?.total}</span>
                      </div>

                      {/* Quote status */}
                      <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                        <span className="text-slate-500">Revised Quote:</span>
                        <span className={`font-bold px-2 py-0.5 rounded-md ${
                          job.revisedQuote?.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : job.revisedQuote?.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'text-slate-500'
                        }`}>
                          {job.revisedQuote?.status === 'none' ? 'None' : job.revisedQuote?.status?.toUpperCase()}
                        </span>
                      </div>

                      {job.revisedQuote?.status === 'approved' && (
                        <div className="text-emerald-700 text-[11px] font-semibold">
                          Customer approved extra amount. Updated bill: ₹{job.pricing?.total}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 flex gap-2">
                      <button
                        onClick={() => setActiveQuoteJob(job)}
                        className="flex-1 rounded-xl bg-white border border-slate-300 hover:border-teal-500 py-2 text-xs font-bold text-slate-700 hover:text-teal-700 transition"
                      >
                        + Submit Revised Quote
                      </button>
                      <button
                        onClick={() => setActiveProofJob(job)}
                        className="flex-1 rounded-xl bg-white border border-slate-300 hover:border-teal-500 py-2 text-xs font-bold text-slate-700 hover:text-teal-700 transition flex items-center justify-center gap-1"
                      >
                        <Camera className="h-3.5 w-3.5" />
                        <span>Quick Proof</span>
                      </button>
                    </div>

                    {/* ProofCare Full Wizard Launcher Button */}
                    <button
                      onClick={() => setActiveProofCareWizardJob(job)}
                      className="mt-2.5 w-full rounded-xl bg-gradient-to-r from-teal-700 to-navy-900 hover:from-teal-600 hover:to-navy-800 text-white font-extrabold py-2.5 px-3 text-xs transition shadow-xs flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="h-4 w-4 text-teal-300" />
                      <span>Launch ProofCare™ Verified On-Site Wizard</span>
                    </button>

                    {/* Live Tracking Map Link */}
                    <a
                      href={`/track/${job._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 w-full rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-bold py-2 px-3 text-xs transition flex items-center justify-center gap-1.5 border border-slate-200"
                    >
                      <MapPin className="h-3.5 w-3.5 text-teal-600" />
                      <span>View Live Customer Tracking Screen</span>
                    </a>
                  </div>
                </div>

                {/* Job Milestones Advance Stepper Buttons */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-500">Advance Job Milestone:</span>
                  <div className="flex flex-wrap gap-2">
                    {job.status === 'Pending' && (
                      <button
                        onClick={() => handleUpdateStatus(job._id, 'Accepted')}
                        className="rounded-xl bg-teal-600 hover:bg-teal-500 px-4 py-2 text-xs font-bold text-white transition shadow-xs"
                      >
                        Accept Booking
                      </button>
                    )}
                    {job.status === 'Accepted' && (
                      <button
                        onClick={() => handleUpdateStatus(job._id, 'Technician on the Way')}
                        className="rounded-xl bg-navy-900 hover:bg-navy-800 px-4 py-2 text-xs font-bold text-white transition shadow-xs"
                      >
                        Mark: On the Way
                      </button>
                    )}
                    {job.status === 'Technician on the Way' && (
                      <button
                        onClick={() => handleUpdateStatus(job._id, 'In Progress')}
                        className="rounded-xl bg-amber-600 hover:bg-amber-500 px-4 py-2 text-xs font-bold text-white transition shadow-xs"
                      >
                        Mark: Started Service In Progress
                      </button>
                    )}
                    {job.status === 'In Progress' && (
                      <button
                        onClick={() => handleUpdateStatus(job._id, 'Completed')}
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition shadow-xs"
                      >
                        Mark: Job Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ProofCare Technician Wizard Modal */}
        {activeProofCareWizardJob && (
          <ProofCareTechnicianWizard
            booking={activeProofCareWizardJob}
            isOpen={!!activeProofCareWizardJob}
            onClose={() => setActiveProofCareWizardJob(null)}
            onRefresh={fetchJobs}
          />
        )}

        {/* Revised Quote Modal (Feature C) */}
        {activeQuoteJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl relative border border-slate-200">
              <button
                onClick={() => setActiveQuoteJob(null)}
                className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-lg font-bold text-navy-900 mb-1">Submit Revised Quote for Customer Approval</h3>
              <p className="text-xs text-slate-500 mb-4">
                Transparent guarantee: Extra work cannot begin until customer clicks approve.
              </p>

              <form onSubmit={handleSubmitRevisedQuote} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Extra Spare Part</label>
                    <input
                      type="text"
                      required
                      value={partName}
                      onChange={(e) => setPartName(e.target.value)}
                      placeholder="e.g. Copper Drain Pipe"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Part Cost (₹)</label>
                    <input
                      type="number"
                      required
                      value={partCost}
                      onChange={(e) => setPartCost(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Additional Labor Fee (₹)</label>
                  <input
                    type="number"
                    value={extraLabor}
                    onChange={(e) => setExtraLabor(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Revision</label>
                  <textarea
                    rows={3}
                    required
                    value={quoteReason}
                    onChange={(e) => setQuoteReason(e.target.value)}
                    placeholder="Explain why part replacement is essential..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-teal-600 hover:bg-teal-500 py-2.5 text-xs font-bold text-white transition shadow-sm"
                  >
                    Send to Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveQuoteJob(null)}
                    className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Upload Proof Modal (Feature G) */}
        {activeProofJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl relative border border-slate-200">
              <button
                onClick={() => setActiveProofJob(null)}
                className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-lg font-bold text-navy-900 mb-1">Upload Before & After Service Proof</h3>
              <p className="text-xs text-slate-500 mb-4">
                Customer will inspect these photos before confirming completed work.
              </p>

              <form onSubmit={handleSubmitProof} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Before Photo URL / Capture</label>
                  <input
                    type="text"
                    required
                    value={beforeUrl}
                    onChange={(e) => setBeforeUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">After Photo URL / Capture</label>
                  <input
                    type="text"
                    required
                    value={afterUrl}
                    onChange={(e) => setAfterUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Summary Notes of Work Performed</label>
                  <textarea
                    rows={2}
                    value={workNotes}
                    onChange={(e) => setWorkNotes(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-teal-600 hover:bg-teal-500 py-2.5 text-xs font-bold text-white transition shadow-sm"
                  >
                    Submit Proof
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveProofJob(null)}
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
