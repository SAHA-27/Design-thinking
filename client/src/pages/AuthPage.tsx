import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  User as UserIcon, 
  Phone, 
  Wrench, 
  ArrowRight, 
  Sparkles,
  Zap,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

interface AuthPageProps {
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode }) => {
  const { user, isAuthenticated, login, register, quickDemoLogin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine initial view: register if path is /register or /signup, or prop initialMode === 'register'
  const isRegisterPath = location.pathname === '/register' || location.pathname === '/signup' || initialMode === 'register';
  const isForgotPath = location.pathname === '/forgot-password' || initialMode === 'forgot';

  const [activeView, setActiveView] = useState<'signin' | 'register' | 'forgot'>(
    isForgotPath ? 'forgot' : isRegisterPath ? 'register' : 'signin'
  );
  const [role, setRole] = useState<'customer' | 'technician'>('customer');

  // Form states
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [skills, setSkills] = useState('AC Repair, RO Purifier');
  const [experienceYears, setExperienceYears] = useState('4');

  // Forgot password form state
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Status & feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Synchronize state when route changes
  useEffect(() => {
    if (location.pathname === '/register' || location.pathname === '/signup') {
      setActiveView('register');
    } else if (location.pathname === '/login' || location.pathname === '/signin') {
      setActiveView('signin');
    } else if (location.pathname === '/forgot-password') {
      setActiveView('forgot');
    }
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [location.pathname]);

  // If already authenticated, redirect to appropriate role dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'technician') navigate('/technician');
      else navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const switchView = (target: 'signin' | 'register' | 'forgot') => {
    setActiveView(target);
    setErrorMsg(null);
    setSuccessMsg(null);
    const targetUrl = target === 'register' ? '/register' : target === 'forgot' ? '/forgot-password' : '/login';
    window.history.pushState(null, '', targetUrl);
  };

  // 1. Handle Sign In (Email or Phone + Password)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const identifier = emailOrPhone.trim();
    if (!identifier) {
      setErrorMsg('Please enter your email address or phone number.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const success = await login(identifier, password);
      if (success) {
        // Redirection handled by useEffect or fallback
        navigate('/dashboard');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Invalid email or password.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Sign Up / Registration (Password based, zero OTP)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedName = name.trim();
    const trimmedEmail = regEmail.trim();
    const cleanPhone = phone.replace(/\D/g, '');

    if (!trimmedName) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter your mobile phone number.');
      return;
    }
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters in length.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter matching passwords.');
      return;
    }

    setLoading(true);
    try {
      const success = await register({
        name: trimmedName,
        email: trimmedEmail,
        phone: cleanPhone.startsWith('91') && cleanPhone.length === 12 ? `+${cleanPhone}` : `+91${cleanPhone.slice(-10)}`,
        password,
        confirmPassword,
        role,
        skills: role === 'technician' ? skills.split(',').map(s => s.trim()) : undefined,
        experienceYears: role === 'technician' ? Number(experienceYears) : undefined
      });

      if (success) {
        navigate(role === 'technician' ? '/technician' : '/dashboard');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Registration failed.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const identifier = forgotIdentifier.trim();
    if (!identifier) {
      setErrorMsg('Please enter your registered email address or phone number.');
      return;
    }

    setLoading(true);
    try {
      const isEmail = identifier.includes('@');
      const payload: any = isEmail ? { email: identifier } : { phone: identifier };
      if (newPassword) {
        if (newPassword.length < 6) {
          setErrorMsg('New password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        payload.newPassword = newPassword;
      }

      const res = await api.post('/auth/forgot-password', payload);
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        if (newPassword) {
          setTimeout(() => switchView('signin'), 1800);
        }
      } else {
        setErrorMsg(res.data.message || 'Password recovery failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to process recovery.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Quick Demo Logins
  const handleQuickDemo = async (demoRole: 'customer' | 'technician' | 'admin') => {
    setLoading(true);
    setErrorMsg(null);
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
      {/* Brand & Heading */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-teal-600 text-white shadow-md">
          <Zap className="h-6 w-6 text-teal-300 fill-teal-300" />
        </div>
        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          {activeView === 'register' 
            ? 'Create ServEase AI Account' 
            : activeView === 'forgot'
              ? 'Reset Account Password'
              : 'Welcome to ServEase AI'}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          {activeView === 'register' 
            ? 'Join our verified network of customers & professionals' 
            : activeView === 'forgot'
              ? 'Enter your registered details to recover your account'
              : 'Sign in to manage bookings, track pros & passports'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        {/* 1-Click Instant Demo Login Banner (Original Design) */}
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
              disabled={loading}
              className="rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold py-2 px-2 transition shadow-xs text-center cursor-pointer disabled:opacity-50"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('technician')}
              disabled={loading}
              className="rounded-xl bg-navy-800 hover:bg-navy-700 text-teal-300 border border-teal-500/30 text-xs font-bold py-2 px-2 transition shadow-xs text-center cursor-pointer disabled:opacity-50"
            >
              Demo Pro
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              disabled={loading}
              className="rounded-xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-500/30 text-xs font-bold py-2 px-2 transition shadow-xs text-center cursor-pointer disabled:opacity-50"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Regular Sign in / Register Card */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-200">
          {/* Switch tabs: Sign In vs Register */}
          {activeView !== 'forgot' && (
            <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
              <button
                type="button"
                onClick={() => switchView('signin')}
                className={`w-1/2 rounded-lg py-2 text-xs font-bold transition cursor-pointer ${
                  activeView === 'signin' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchView('register')}
                className={`w-1/2 rounded-lg py-2 text-xs font-bold transition cursor-pointer ${
                  activeView === 'register' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Register
              </button>
            </div>
          )}

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-start gap-2.5 text-xs text-emerald-800 animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{successMsg}</div>
            </div>
          )}

          {/* =========================================================================
              VIEW 1: SIGN IN (EMAIL OR PHONE + PASSWORD)
             ========================================================================= */}
          {activeView === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address or Mobile Phone
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="name@example.com or 9840123456"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => switchView('forgot')}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700 cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-10 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-hidden cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-navy-900 py-3 text-sm font-bold text-white hover:bg-navy-800 transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Signing in...' : 'Sign In to ServEase'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="pt-4 text-center border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchView('register')}
                    className="font-bold text-teal-600 hover:text-teal-700 cursor-pointer"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* =========================================================================
              VIEW 2: SIGN UP / REGISTRATION (NORMAL FORM WITH PASSWORD)
             ========================================================================= */}
          {activeView === 'register' && (
            <div>
              {/* Role selector if registering */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-700 mb-2">Registering As</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer ${
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
                    className={`p-3 rounded-xl border text-center transition cursor-pointer ${
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

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Full Name */}
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

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98401 23456"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-10 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-hidden cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter identical password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-10 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-hidden cursor-pointer"
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Technician additional fields */}
                {role === 'technician' && (
                  <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in duration-200">
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
                  className="mt-2 w-full rounded-xl bg-navy-900 py-3 text-sm font-bold text-white hover:bg-navy-800 transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{loading ? 'Please wait...' : 'Complete Registration'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="pt-4 text-center border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchView('signin')}
                      className="font-bold text-teal-600 hover:text-teal-700 cursor-pointer"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* =========================================================================
              VIEW 3: FORGOT PASSWORD / ACCOUNT RECOVERY
             ========================================================================= */}
          {activeView === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registered Email Address or Phone
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="Enter email or mobile number"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Set New Password
                </label>
                <div className="relative">
                  <KeyRound className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-10 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-hidden cursor-pointer"
                    title={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-500 transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Updating Password...' : 'Reset Password & Proceed'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="pt-4 text-center border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => switchView('signin')}
                  className="text-xs font-semibold text-slate-600 hover:text-navy-900 cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
