import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  User as UserIcon, 
  Phone, 
  Wrench, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const AuthPage: React.FC = () => {
  const { login, register, quickDemoLogin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<'customer' | 'technician'>('customer');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState('AC Repair, RO Purifier');
  const [experienceYears, setExperienceYears] = useState('4');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isRegister) {
      const success = await register({
        name,
        email,
        password,
        phone,
        role,
        skills: role === 'technician' ? skills.split(',').map(s => s.trim()) : undefined,
        experienceYears: role === 'technician' ? Number(experienceYears) : undefined
      });
      if (success) {
        navigate(role === 'technician' ? '/technician' : '/dashboard');
      }
    } else {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      }
    }
    setLoading(false);
  };

  const handleQuickDemo = async (demoRole: 'customer' | 'technician' | 'admin') => {
    setLoading(true);
    const success = await quickDemoLogin(demoRole);
    setLoading(false);
    if (success) {
      if (demoRole === 'admin') navigate('/admin');
      else if (demoRole === 'technician') navigate('/technician');
      else navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-teal-600 text-white shadow-md">
          <Zap className="h-6 w-6 text-teal-300 fill-teal-300" />
        </div>
        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-navy-900">
          {isRegister ? 'Create ServEase AI Account' : 'Welcome to ServEase AI'}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          {isRegister ? 'Join our verified network of customers & professionals' : 'Sign in to manage bookings, track pros & passports'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        {/* 1-Click Instant Demo Login Banner */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-navy-950 to-navy-900 p-4 text-white shadow-lg border border-navy-800">
          <div className="flex items-center gap-2 mb-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>Instant Demo Quick Access</span>
          </div>
          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
            Click any role to test with pre-seeded data without typing credentials:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold py-2 px-2 transition shadow-xs text-center"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('technician')}
              className="rounded-xl bg-navy-800 hover:bg-navy-700 text-teal-300 border border-teal-500/30 text-xs font-bold py-2 px-2 transition shadow-xs text-center"
            >
              Demo Pro
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="rounded-xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-500/30 text-xs font-bold py-2 px-2 transition shadow-xs text-center"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Regular Sign in / Register Card */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-200">
          {/* Switch tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className={`w-1/2 rounded-lg py-2 text-xs font-bold transition ${
                !isRegister ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`w-1/2 rounded-lg py-2 text-xs font-bold transition ${
                isRegister ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Register
            </button>
          </div>

          {/* Role selector if registering */}
          {isRegister && (
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-700 mb-2">Registering As</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`p-3 rounded-xl border text-center transition ${
                    role === 'customer'
                      ? 'border-teal-500 bg-teal-50 text-teal-800 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <UserIcon className="h-5 w-5 mx-auto mb-1 text-teal-600" />
                  <span className="text-xs">Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('technician')}
                  className={`p-3 rounded-xl border text-center transition ${
                    role === 'technician'
                      ? 'border-teal-500 bg-teal-50 text-teal-800 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Wrench className="h-5 w-5 mx-auto mb-1 text-teal-600" />
                  <span className="text-xs">Service Pro</span>
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Karthik Raman"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98401 23456"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            {isRegister && role === 'technician' && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Trade Skills</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. AC Repair, RO Purifier, Plumbing"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm focus:border-teal-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Years of Field Experience</label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    min="1"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm focus:border-teal-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-navy-900 py-3 text-sm font-bold text-white hover:bg-navy-800 transition shadow-md flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Please wait...' : isRegister ? 'Complete Registration' : 'Sign In to ServEase'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
