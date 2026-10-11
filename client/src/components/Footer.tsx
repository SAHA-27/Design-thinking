import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, HeartHandshake, PhoneCall, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-200 bg-navy-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500 text-white shadow-sm">
                <Zap className="h-5 w-5 fill-white" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">ServEase AI</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Every Service, One Smart Platform. Connecting homeowners and vehicle owners with certified, background-checked service professionals.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-900/60 text-teal-300 border border-teal-700/50 px-3 py-1 text-xs font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" /> 100% Identity Verified Pros
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-800 text-slate-300 border border-navy-700 px-3 py-1 text-xs font-semibold">
                <HeartHandshake className="h-3.5 w-3.5" /> 30-Day Service Guarantee
              </span>
            </div>
          </div>

          {/* Core Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Popular Services</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/categories/ro-water-purifier" className="hover:text-teal-400 transition">RO Water Purifiers</Link></li>
              <li><Link to="/categories/ac-service" className="hover:text-teal-400 transition">AC Repair & Maintenance</Link></li>
              <li><Link to="/categories/bike-service" className="hover:text-teal-400 transition">Bike & Scooter Service</Link></li>
              <li><Link to="/categories/car-service" className="hover:text-teal-400 transition">Car Periodic Maintenance</Link></li>
              <li><Link to="/categories/washing-machine-repair" className="hover:text-teal-400 transition">Washing Machine Repair</Link></li>
              <li><Link to="/categories/electrician" className="hover:text-teal-400 transition">Electrician On-Demand</Link></li>
            </ul>
          </div>

          {/* Smart Features */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Smart Features</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/ai-assistant" className="hover:text-teal-400 transition">AI Diagnostic Assistant</Link></li>
              <li><Link to="/passport" className="hover:text-teal-400 transition">Digital Service Passport</Link></li>
              <li><Link to="/technicians" className="hover:text-teal-400 transition">Smart Pro Matching</Link></li>
              <li><Link to="/technicians?emergency=true" className="hover:text-teal-400 transition text-amber-400">Emergency 25-Min Dispatch</Link></li>
              <li><Link to="/dashboard" className="hover:text-teal-400 transition">Maintenance Cost Insights</Link></li>
            </ul>
          </div>

          {/* Contact / Help */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Customer Support</h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-teal-400 shrink-0" />
                <span>1800-420-SERVE (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-teal-400 shrink-0" />
                <span>support@servease.ai</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-teal-400 shrink-0" />
                <span>Anna Nagar, Chennai, Tamil Nadu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-navy-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 ServEase AI Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 transition cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 transition cursor-pointer">Technician Code of Conduct</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
