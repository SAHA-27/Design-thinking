import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, 
  DollarSign, 
  Star, 
  Award, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const TechnicianDashboard: React.FC = () => {
  const { user } = useAuth();

  const [jobs, setJobs] = useState<any[]>([]);
  const [profile, setProfile] = useState<any | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [emergencyAvailable, setEmergencyAvailable] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchTechData = async () => {
    try {
      const [jobsRes, profileRes] = await Promise.all([
        api.get('/bookings/technician-jobs'),
        api.get('/auth/me')
      ]);

      if (jobsRes.data.success) setJobs(jobsRes.data.bookings);
      if (profileRes.data.user?.technicianProfile) {
        setProfile(profileRes.data.user.technicianProfile);
        setIsAvailable(profileRes.data.user.technicianProfile.isAvailable ?? true);
        setEmergencyAvailable(profileRes.data.user.technicianProfile.emergencyAvailable ?? true);
      }
    } catch (err) {
      console.error('Failed to load pro dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechData();
  }, []);

  const handleToggleAvailability = async () => {
    const next = !isAvailable;
    setIsAvailable(next);
    try {
      await api.put('/technicians/status', { isAvailable: next });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleEmergency = async () => {
    const next = !emergencyAvailable;
    setEmergencyAvailable(next);
    try {
      await api.put('/technicians/status', { emergencyAvailable: next });
    } catch (err) {
      console.error(err);
    }
  };

  const pendingRequests = jobs.filter(j => j.status === 'Pending');
  const activeJobs = jobs.filter(j => ['Accepted', 'Technician on the Way', 'In Progress'].includes(j.status));

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Pro Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Certified Partner Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Technician Portal — {user?.name || 'Arun Kumar'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Manage booking dispatches, submit revised quotes, upload before-and-after proof, and track monthly earnings.
            </p>
          </div>

          {/* Availability toggles */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleToggleAvailability}
              className={`rounded-2xl px-4 py-2.5 text-xs font-bold transition flex items-center gap-2 shadow-xs ${
                isAvailable ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${isAvailable ? 'bg-white animate-pulse' : 'bg-slate-500'}`} />
              <span>{isAvailable ? 'Status: ONLINE' : 'Status: OFFLINE'}</span>
            </button>

            <button
              onClick={handleToggleEmergency}
              className={`rounded-2xl px-4 py-2.5 text-xs font-bold transition flex items-center gap-2 border shadow-xs ${
                emergencyAvailable
                  ? 'bg-rose-600 text-white border-rose-500'
                  : 'bg-navy-800 text-slate-400 border-navy-700'
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              <span>{emergencyAvailable ? 'Emergency Ready (25m)' : 'Emergency Off'}</span>
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Total Career Earnings</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">₹82,500</div>
              <span className="text-xs text-emerald-600 font-medium">₹14,200 this month</span>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Service Trust Score</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">96 / 100</div>
              <span className="text-xs text-teal-600 font-medium">Top 5% verified partner</span>
            </div>
            <div className="rounded-xl bg-teal-50 p-3 text-teal-600">
              <Award className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Customer Rating</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">4.9 ★</div>
              <span className="text-xs text-amber-600 font-medium">84 verified reviews</span>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <Star className="h-6 w-6 fill-amber-500" />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Active Jobs Assigned</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">{activeJobs.length}</div>
              <span className="text-xs text-purple-600 font-medium">{pendingRequests.length} pending requests</span>
            </div>
            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Pending Requests & Quick Management */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-navy-900">
                Incoming Dispatch & Active Requests
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review booking requests and update on-site job milestones.
              </p>
            </div>
            <Link
              to="/technician/bookings"
              className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1"
            >
              <span>Manage All Jobs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {jobs.slice(0, 4).map((job) => (
              <div
                key={job._id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-slate-500">#{job.bookingNumber}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      job.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                        : job.status === 'Technician on the Way'
                          ? 'bg-teal-100 text-teal-800'
                          : job.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                    }`}>
                      {job.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-navy-900">{job.serviceId?.title || 'Home Repair'}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    "{job.problemDescription}"
                  </p>

                  <div className="mt-3 p-3 rounded-xl bg-white border border-slate-100 text-xs space-y-1 text-slate-700">
                    <div className="flex items-center gap-1 text-slate-500">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{job.serviceAddress?.street}, {job.serviceAddress?.area}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-400">Scheduled:</span>
                      <span className="font-semibold">{job.scheduledDate} ({job.scheduledTime})</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-navy-900">Total: ₹{job.pricing?.total}</span>
                  <Link
                    to="/technician/bookings"
                    className="rounded-xl bg-teal-600 hover:bg-teal-500 px-4 py-2 text-xs font-bold text-white transition shadow-xs"
                  >
                    Manage Job & Quotes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
