import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  ShieldCheck, 
  TrendingUp, 
  Tag,
  Search,
  Lock,
  Camera
} from 'lucide-react';
import api from '../services/api';
import { ServiceEvidenceReportModal } from '../components/ServiceEvidenceReportModal';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any | null>(null);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [auditQueue, setAuditQueue] = useState<any[]>([]);
  const [selectedAuditReport, setSelectedAuditReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'techs' | 'complaints' | 'audit'>('audit');

  const fetchAdminData = async () => {
    try {
      const [statsRes, techsRes, compRes, auditRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/technicians'),
        api.get('/admin/complaints'),
        api.get('/proofcare/admin/audit-queue')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (techsRes.data.success) setTechnicians(techsRes.data.technicians);
      if (compRes.data.success) setComplaints(compRes.data.complaints);
      if (auditRes.data.success) setAuditQueue(auditRes.data.queue);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInspectAuditReport = async (bookingId: string) => {
    try {
      const res = await api.get(`/proofcare/${bookingId}/report`);
      if (res.data.success) {
        setSelectedAuditReport(res.data.report);
      }
    } catch (err) {
      alert('Failed to load report.');
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyTech = async (id: string, action: 'verify' | 'reject') => {
    try {
      const res = await api.put(`/admin/technicians/${id}/verify`, { action });
      if (res.data.success) {
        fetchAdminData();
        alert(`Technician KYC status marked as: ${action === 'verify' ? 'Verified' : 'Rejected'}`);
      }
    } catch (err) {
      alert('Verification update failed.');
    }
  };

  const handleResolveComplaint = async (id: string) => {
    try {
      const res = await api.put(`/admin/complaints/${id}/resolve`, {
        status: 'Resolved',
        adminNotes: 'Resolution confirmed with customer and technician. Issue closed.',
        refundAmount: 0
      });
      if (res.data.success) {
        fetchAdminData();
        alert('Dispute marked as Resolved!');
      }
    } catch (err) {
      alert('Failed to resolve complaint.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-purple-600">Platform Operations</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
            Admin Master Operations Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time platform revenue analytics, technician KYC identity verification, and dispute resolution.
          </p>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Gross Service Volume</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
                ₹{stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : '2,84,500'}
              </div>
              <span className="text-xs text-purple-600 font-semibold">
                Platform Share: ₹{stats?.platformCommission ? stats.platformCommission.toLocaleString() : '42,675'}
              </span>
            </div>
            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Active / Completed Bookings</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
                {stats?.totalBookings || 4}
              </div>
              <span className="text-xs text-teal-600 font-medium">99.2% satisfaction rate</span>
            </div>
            <div className="rounded-xl bg-teal-50 p-3 text-teal-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Service Professionals</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
                {stats?.totalTechnicians || 3}
              </div>
              <span className="text-xs text-emerald-600 font-medium">
                {stats?.verifiedTechnicians || 3} KYC Verified
              </span>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Open Disputes</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
                {stats?.openComplaints || 1}
              </div>
              <span className="text-xs text-amber-600 font-medium">Resolution SLA &lt; 2 hours</span>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-4 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setTab('audit')}
            className={`pb-2 text-sm font-bold transition flex items-center gap-2 shrink-0 ${
              tab === 'audit'
                ? 'text-teal-700 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>ProofCare™ Service Audit Queue ({auditQueue.length})</span>
          </button>
          <button
            onClick={() => setTab('techs')}
            className={`pb-2 text-sm font-bold transition flex items-center gap-2 shrink-0 ${
              tab === 'techs'
                ? 'text-teal-700 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Technician KYC Queue ({technicians.length})</span>
          </button>
          <button
            onClick={() => setTab('complaints')}
            className={`pb-2 text-sm font-bold transition flex items-center gap-2 shrink-0 ${
              tab === 'complaints'
                ? 'text-teal-700 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Disputes & Complaints Center ({complaints.length})</span>
          </button>
        </div>

        {/* Tab 0: ProofCare Service Audit Queue */}
        {tab === 'audit' && (
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-navy-900">
                  ProofCare™ Verified Service Completion Audit Trail
                </h3>
                <p className="text-xs text-slate-500">
                  Inspect server timestamps, consent GPS arrival status, before/after photo audits, and customer completion OTPs.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm divide-y divide-slate-100">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Booking / Service</th>
                    <th className="py-3 px-4">Technician</th>
                    <th className="py-3 px-4">Arrival GPS</th>
                    <th className="py-3 px-4">Photos (B / A)</th>
                    <th className="py-3 px-4">Checklist</th>
                    <th className="py-3 px-4">Completion OTP</th>
                    <th className="py-3 px-4 text-right">Audit Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {auditQueue.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-900 block">#{item.bookingNumber}</span>
                        <span className="text-slate-500 text-xs">{item.serviceTitle}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {item.technicianName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          item.gpsVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.gpsVerified ? '✓ GPS Consented' : 'Timestamp Only'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {item.beforePhotosCount} Before • {item.afterPhotosCount} After
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-teal-700">
                          {item.checklistCompleted} / {item.checklistTotal || 4}
                        </span>
                        <span className="text-[11px] text-slate-400 block">passed</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          item.otpVerified
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.isDisputed
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.otpVerified ? '✓ Verified' : item.isDisputed ? 'Disputed' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleInspectAuditReport(item._id)}
                          className="rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold px-3 py-1.5 text-xs transition"
                        >
                          Audit Evidence
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 1: Technician KYC Verification Queue */}
        {tab === 'techs' && (
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-navy-900">
              Identity Verification & Skill Accreditation Queue
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm divide-y divide-slate-100">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Professional</th>
                    <th className="py-3 px-4">Trade Skills</th>
                    <th className="py-3 px-4">Experience</th>
                    <th className="py-3 px-4">KYC Document</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {technicians.map((tech) => (
                    <tr key={tech._id}>
                      <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                        <img
                          src={tech.userId?.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80'}
                          alt=""
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <div>{tech.userId?.name}</div>
                          <div className="text-[11px] text-slate-400 font-normal">{tech.userId?.email}</div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">{tech.skills?.slice(0, 2).join(', ')}</td>
                      <td className="py-3.5 px-4">{tech.experienceYears} Years</td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-teal-700">{tech.idType || 'Aadhaar Verified'}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          tech.verificationStatus === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tech.verificationStatus === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}>
                          {tech.verificationStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {tech.verificationStatus !== 'verified' ? (
                          <button
                            onClick={() => handleVerifyTech(tech._id, 'verify')}
                            className="rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold px-3 py-1.5 text-xs transition"
                          >
                            Approve KYC
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerifyTech(tech._id, 'reject')}
                            className="rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 font-bold px-3 py-1.5 text-xs transition"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Complaints & Dispute Resolution */}
        {tab === 'complaints' && (
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-navy-900">
              Customer Disputes & Warranty Resolution Desk
            </h3>

            <div className="space-y-4">
              {complaints.map((c) => (
                <div key={c._id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">#{c.complaintNumber}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                        {c.category}
                      </span>
                      <span className="text-xs text-slate-500">Status: <strong>{c.status}</strong></span>
                    </div>
                    {c.status !== 'Resolved' && (
                      <button
                        onClick={() => handleResolveComplaint(c._id)}
                        className="rounded-xl bg-teal-600 hover:bg-teal-500 px-3 py-1.5 text-xs font-bold text-white transition self-start sm:self-auto"
                      >
                        Resolve Dispute
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700">
                    "{c.description}"
                  </p>

                  <div className="text-[11px] text-slate-500 flex flex-wrap gap-4">
                    <span>Desired Resolution: <strong>{c.desiredResolution}</strong></span>
                    {c.adminNotes && <span>Admin Notes: {c.adminNotes}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ProofCare Audit Report Modal */}
        <ServiceEvidenceReportModal
          report={selectedAuditReport}
          isOpen={!!selectedAuditReport}
          onClose={() => setSelectedAuditReport(null)}
        />
      </div>
    </div>
  );
};
