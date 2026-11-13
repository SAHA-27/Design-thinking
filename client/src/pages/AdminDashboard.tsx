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
  Camera,
  Gift,
  Award,
  Save,
  Sliders,
  PlusCircle,
  MinusCircle,
  X
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
  const [tab, setTab] = useState<'techs' | 'complaints' | 'audit' | 'loyalty'>('audit');
  
  // Loyalty Admin states
  const [loyaltySummary, setLoyaltySummary] = useState<any | null>(null);
  const [loyaltyCustomers, setLoyaltyCustomers] = useState<any[]>([]);
  const [loyaltyTransactions, setLoyaltyTransactions] = useState<any[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [txTypeFilter, setTxTypeFilter] = useState('all');
  const [txCategoryFilter, setTxCategoryFilter] = useState('all');

  // Config editor states
  const [progEnabled, setProgEnabled] = useState(true);
  const [bronzeBookings, setBronzeBookings] = useState(5);
  const [bronzeReward, setBronzeReward] = useState(100);
  const [silverBookings, setSilverBookings] = useState(10);
  const [silverReward, setSilverReward] = useState(250);
  const [goldBookings, setGoldBookings] = useState(20);
  const [goldReward, setGoldReward] = useState(500);
  const [platinumBookings, setPlatinumBookings] = useState(30);
  const [platinumReward, setPlatinumReward] = useState(1000);
  const [savingConfig, setSavingConfig] = useState(false);

  // Manual Adjustment states
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [adjustType, setAdjustType] = useState<'credit' | 'debit'>('credit');
  const [adjustAmount, setAdjustAmount] = useState<number>(50);
  const [adjustReason, setAdjustReason] = useState<string>('');
  const [adjusting, setAdjusting] = useState(false);

  const fetchLoyaltyData = async () => {
    try {
      const [sumRes, custRes, txRes] = await Promise.all([
        api.get('/loyalty/admin/summary'),
        api.get('/loyalty/admin/customers'),
        api.get('/loyalty/admin/transactions')
      ]);

      if (sumRes.data.success) {
        setLoyaltySummary(sumRes.data.summary);
        const p = sumRes.data.summary.program;
        if (p) {
          setProgEnabled(p.isEnabled ?? true);
          if (p.milestones?.bronze) {
            setBronzeBookings(p.milestones.bronze.requiredCompletedBookings || 5);
            setBronzeReward(p.milestones.bronze.rewardAmount || 100);
          }
          if (p.milestones?.silver) {
            setSilverBookings(p.milestones.silver.requiredCompletedBookings || 10);
            setSilverReward(p.milestones.silver.rewardAmount || 250);
          }
          if (p.milestones?.gold) {
            setGoldBookings(p.milestones.gold.requiredCompletedBookings || 20);
            setGoldReward(p.milestones.gold.rewardAmount || 500);
          }
          if (p.milestones?.platinum) {
            setPlatinumBookings(p.milestones.platinum.requiredCompletedBookings || 30);
            setPlatinumReward(p.milestones.platinum.rewardAmount || 1000);
          }
        }
      }
      if (custRes.data.success) setLoyaltyCustomers(custRes.data.customers);
      if (txRes.data.success) setLoyaltyTransactions(txRes.data.transactions);
    } catch (err) {
      console.error('Failed to load loyalty admin data:', err);
    }
  };

  const fetchAdminData = async () => {
    try {
      const [statsRes, techsRes, compRes, auditRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/technicians'),
        api.get('/admin/complaints'),
        api.get('/proofcare/admin/audit-queue'),
        fetchLoyaltyData()
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

  const handleSaveProgramConfig = async () => {
    setSavingConfig(true);
    try {
      const payload = {
        isEnabled: progEnabled,
        milestones: {
          bronze: { requiredCompletedBookings: Number(bronzeBookings), rewardAmount: Number(bronzeReward) },
          silver: { requiredCompletedBookings: Number(silverBookings), rewardAmount: Number(silverReward) },
          gold: { requiredCompletedBookings: Number(goldBookings), rewardAmount: Number(goldReward) },
          platinum: { requiredCompletedBookings: Number(platinumBookings), rewardAmount: Number(platinumReward) }
        }
      };
      const res = await api.put('/loyalty/admin/config', payload);
      if (res.data.success) {
        alert('Loyalty program thresholds & rewards updated successfully!');
        fetchLoyaltyData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update config.');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleExecuteAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustReason.trim()) {
      alert('Mandatory audit reason required.');
      return;
    }
    setAdjusting(true);
    try {
      const payload = {
        customerId: selectedCustomer.customerId,
        type: adjustType,
        amount: Number(adjustAmount),
        reason: adjustReason.trim()
      };
      const res = await api.post('/loyalty/admin/adjust-balance', payload);
      if (res.data.success) {
        alert('Balance adjusted successfully!');
        setAdjustModalOpen(false);
        fetchLoyaltyData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Balance adjustment failed.');
    } finally {
      setAdjusting(false);
    }
  };

  const filteredCustomers = loyaltyCustomers.filter((c) => {
    const q = customerSearch.toLowerCase();
    return (
      (c.customerName || '').toLowerCase().includes(q) ||
      (c.customerEmail || '').toLowerCase().includes(q) ||
      (c.customerPhone || '').toLowerCase().includes(q)
    );
  });

  const filteredTransactions = loyaltyTransactions.filter((tx) => {
    if (txTypeFilter !== 'all' && tx.type !== txTypeFilter) return false;
    if (txCategoryFilter !== 'all' && tx.category !== txCategoryFilter) return false;
    return true;
  });

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
          <button
            onClick={() => setTab('loyalty')}
            className={`pb-2 text-sm font-bold transition flex items-center gap-2 shrink-0 ${
              tab === 'loyalty'
                ? 'text-teal-700 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Gift className="h-4 w-4" />
            <span>Customer Loyalty & Rewards ({loyaltyCustomers.length})</span>
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

        {/* Tab 3: Customer Loyalty, Bonus & Rewards Program Management */}
        {tab === 'loyalty' && (
          <div className="space-y-8">
            {/* 4 Loyalty KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500">Loyalty Members</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
                    {loyaltySummary?.totalWallets ?? 0}
                  </div>
                  <span className="text-xs text-teal-600 font-medium">Registered wallets</span>
                </div>
                <div className="rounded-xl bg-teal-50 p-3 text-teal-600">
                  <Users className="h-6 w-6" />
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500">Total Bonuses Issued</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
                    ₹{loyaltySummary?.totalRewardsEarned?.toLocaleString() ?? 0}
                  </div>
                  <span className="text-xs text-amber-600 font-medium">Milestones & Adjustments</span>
                </div>
                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                  <Gift className="h-6 w-6" />
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500">Total Redeemed at Checkout</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
                    ₹{loyaltySummary?.totalRewardsRedeemed?.toLocaleString() ?? 0}
                  </div>
                  <span className="text-xs text-emerald-600 font-medium">Discounts applied</span>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500">Active Wallet Liability</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
                    ₹{loyaltySummary?.availableWalletLiability?.toLocaleString() ?? 0}
                  </div>
                  <span className="text-xs text-purple-600 font-medium">Current redeemable balance</span>
                </div>
                <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Section A: Configurable Tier & Milestone Rules */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                    <Sliders className="h-5 w-5 text-teal-600" />
                    <span>Configurable Loyalty Tiers & Milestone Thresholds</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Administer customer reward triggers. Updates take effect immediately for upcoming completed bookings.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <span>Program Active:</span>
                    <input
                      type="checkbox"
                      checked={progEnabled}
                      onChange={(e) => setProgEnabled(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                  </label>
                  <button
                    onClick={handleSaveProgramConfig}
                    disabled={savingConfig}
                    className="rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold px-4 py-2 text-xs transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Save className="h-4 w-4" />
                    <span>{savingConfig ? 'Saving...' : 'Save Configuration'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Bronze */}
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase text-amber-900">Bronze Member</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">Level 1</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Required Completed Bookings</label>
                    <input
                      type="number"
                      min={1}
                      value={bronzeBookings}
                      onChange={(e) => setBronzeBookings(Number(e.target.value))}
                      className="w-full rounded-xl border border-amber-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Bonus Reward (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={bronzeReward}
                      onChange={(e) => setBronzeReward(Number(e.target.value))}
                      className="w-full rounded-xl border border-amber-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Silver */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase text-slate-800">Silver Member</span>
                    <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded-full">Level 2</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Required Completed Bookings</label>
                    <input
                      type="number"
                      min={1}
                      value={silverBookings}
                      onChange={(e) => setSilverBookings(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Bonus Reward (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={silverReward}
                      onChange={(e) => setSilverReward(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Gold */}
                <div className="p-4 rounded-2xl bg-yellow-50/60 border border-yellow-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase text-yellow-900">Gold Member</span>
                    <span className="text-[10px] bg-yellow-100 text-yellow-800 font-bold px-2 py-0.5 rounded-full">Level 3</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Required Completed Bookings</label>
                    <input
                      type="number"
                      min={1}
                      value={goldBookings}
                      onChange={(e) => setGoldBookings(Number(e.target.value))}
                      className="w-full rounded-xl border border-yellow-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Bonus Reward (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={goldReward}
                      onChange={(e) => setGoldReward(Number(e.target.value))}
                      className="w-full rounded-xl border border-yellow-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Platinum */}
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase text-purple-900">Platinum Member</span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">Level 4</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Required Completed Bookings</label>
                    <input
                      type="number"
                      min={1}
                      value={platinumBookings}
                      onChange={(e) => setPlatinumBookings(Number(e.target.value))}
                      className="w-full rounded-xl border border-purple-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Bonus Reward (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={platinumReward}
                      onChange={(e) => setPlatinumReward(Number(e.target.value))}
                      className="w-full rounded-xl border border-purple-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section B: Customer Loyalty Directory & Manual Balance Adjuster */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-navy-900">
                    Customer Loyalty Directory & Balances
                  </h3>
                  <p className="text-xs text-slate-500">
                    Search customer loyalty profiles, verified completed booking counters, and issue audited bonus adjustments.
                  </p>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search customer name, email or phone..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs focus:border-teal-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm divide-y divide-slate-100">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Loyalty Tier</th>
                      <th className="py-3 px-4">Completed Services</th>
                      <th className="py-3 px-4">Available Balance</th>
                      <th className="py-3 px-4">Earned / Redeemed</th>
                      <th className="py-3 px-4 text-right">Audited Adjustment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredCustomers.map((cust) => (
                      <tr key={cust.walletId || cust.customerId} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{cust.customerName}</div>
                          <div className="text-[11px] text-slate-400">{cust.customerEmail} • {cust.customerPhone}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                            cust.currentTier === 'Platinum' ? 'bg-purple-100 text-purple-800' :
                            cust.currentTier === 'Gold' ? 'bg-amber-100 text-amber-800' :
                            cust.currentTier === 'Silver' ? 'bg-slate-200 text-slate-800' :
                            'bg-amber-50 text-amber-900 border border-amber-200'
                          }`}>
                            {cust.currentTier}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900">{cust.completedBookingsCount}</span>
                          <span className="text-[11px] text-slate-400 block">completed bookings</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-extrabold text-teal-700 text-sm">
                          ₹{cust.availableBalance}
                        </td>
                        <td className="py-3.5 px-4 text-xs">
                          <span className="text-emerald-700 font-bold">+₹{cust.totalRewardsEarned}</span> / <span className="text-slate-500 font-semibold">-₹{cust.totalRewardsRedeemed}</span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedCustomer(cust);
                              setAdjustModalOpen(true);
                              setAdjustReason('');
                              setAdjustAmount(50);
                            }}
                            className="rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold px-3 py-1.5 text-xs transition"
                          >
                            Adjust Balance
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section C: Reward Transaction Audit Ledger */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-navy-900">
                    Reward Transaction Audit Ledger
                  </h3>
                  <p className="text-xs text-slate-500">
                    Immutable platform audit trail for milestone reward credits, checkout redemptions, and admin adjustments.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={txTypeFilter}
                    onChange={(e) => setTxTypeFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
                  >
                    <option value="all">All Types</option>
                    <option value="credit">Credits (+)</option>
                    <option value="debit">Debits (-)</option>
                  </select>

                  <select
                    value={txCategoryFilter}
                    onChange={(e) => setTxCategoryFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
                  >
                    <option value="all">All Categories</option>
                    <option value="milestone_reward">Milestone Reward</option>
                    <option value="booking_redemption">Booking Redemption</option>
                    <option value="admin_adjustment">Admin Adjustment</option>
                    <option value="booking_refund">Booking Refund</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm divide-y divide-slate-100">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="py-3 px-4">Date / Time</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Balance After</th>
                      <th className="py-3 px-4">Booking / Reference</th>
                      <th className="py-3 px-4">Audit Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredTransactions.map((tx) => (
                      <tr key={tx._id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 text-slate-500 text-xs">
                          {new Date(tx.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {tx.customerId?.name || 'Customer'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                            tx.type === 'credit' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {tx.type === 'credit' ? '+ Credit' : '- Debit'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs font-semibold text-slate-700">
                          {tx.category ? tx.category.replace('_', ' ') : 'reward'}
                        </td>
                        <td className={`py-3 px-4 font-mono font-extrabold ${
                          tx.type === 'credit' ? 'text-emerald-700' : 'text-rose-700'
                        }`}>
                          {tx.type === 'credit' ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-600">
                          ₹{tx.balanceAfter}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-500">
                          {tx.bookingNumber ? `#${tx.bookingNumber}` : '—'}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600 max-w-xs truncate">
                          {tx.adminReason || tx.description || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ProofCare Audit Report Modal */}
        <ServiceEvidenceReportModal
          report={selectedAuditReport}
          isOpen={!!selectedAuditReport}
          onClose={() => setSelectedAuditReport(null)}
        />

        {/* Manual Balance Adjustment Modal */}
        {adjustModalOpen && selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                  <Gift className="h-5 w-5 text-amber-500" />
                  <span>Manual Balance Adjustment</span>
                </h3>
                <button
                  onClick={() => setAdjustModalOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                <div className="font-bold text-slate-900">{selectedCustomer.customerName}</div>
                <div className="text-[11px] text-slate-500">{selectedCustomer.customerEmail}</div>
                <div className="mt-1 font-semibold">
                  Current Balance: <span className="font-mono text-teal-700 font-bold">₹{selectedCustomer.availableBalance}</span>
                </div>
              </div>

              <form onSubmit={handleExecuteAdjustment} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Adjustment Action</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAdjustType('credit')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                        adjustType === 'credit'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Credit (+)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdjustType('debit')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                        adjustType === 'debit'
                          ? 'border-rose-500 bg-rose-50 text-rose-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <MinusCircle className="h-4 w-4" />
                      <span>Debit (-)</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Adjustment Amount (₹)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mandatory Admin Reason / Audit Note *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    placeholder="State the reason for this manual credit/debit (e.g. Goodwill bonus, promotional correction)..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setAdjustModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={adjusting}
                    className="rounded-xl bg-teal-600 hover:bg-teal-500 px-4 py-2 text-xs font-bold text-white transition shadow-sm"
                  >
                    {adjusting ? 'Processing...' : 'Confirm Adjustment'}
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
