import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  ArrowRight,
  Check
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const NotificationsPage: React.FC = () => {
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-teal-600">Real-Time Alerts</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
            Notifications & Maintenance Reminders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Stay updated with dispatch milestones, revised quotes, and Passport service due dates.
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-500">Loading alerts...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center border border-slate-200">
            <Bell className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">You're completely caught up</p>
            <p className="text-xs text-slate-500 mt-1">No pending notifications at this moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`p-5 rounded-2xl border transition flex items-start justify-between gap-4 ${
                  n.isRead ? 'bg-white border-slate-200' : 'bg-teal-50/50 border-teal-200 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    n.type === 'quote_received'
                      ? 'bg-amber-100 text-amber-700'
                      : n.type === 'maintenance_reminder'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-teal-100 text-teal-700'
                  }`}>
                    {n.type === 'quote_received' ? (
                      <DollarSign className="h-5 w-5" />
                    ) : n.type === 'maintenance_reminder' ? (
                      <ShieldCheck className="h-5 w-5" />
                    ) : (
                      <Bell className="h-5 w-5" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-navy-900">
                      {language === 'ta' && n.titleTa ? n.titleTa : n.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {language === 'ta' && n.messageTa ? n.messageTa : n.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-2 block">
                      {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkRead(n._id)}
                      className="text-xs text-teal-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Mark Read</span>
                    </button>
                  )}
                  {n.referenceId && (
                    <Link
                      to={n.type === 'maintenance_reminder' ? '/passport' : `/track/${n.referenceId}`}
                      className="rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-[11px] font-bold px-3 py-1.5 transition"
                    >
                      Open Action
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
