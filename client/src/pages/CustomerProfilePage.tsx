import React, { useState } from 'react';
import { 
  User as UserIcon, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Heart, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  Save 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export const CustomerProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [name, setName] = useState(user?.name || 'Karthik Raman');
  const [phone, setPhone] = useState(user?.phone || '+91 98401 23456');
  const [addresses, setAddresses] = useState(user?.savedAddresses || [
    {
      title: 'Home',
      street: 'Flat 4B, Emerald Towers, 4th Main Road',
      area: 'Anna Nagar',
      city: 'Chennai',
      pincode: '600040',
      isDefault: true
    },
    {
      title: 'Office',
      street: 'Level 3, Tek Meadows, OMR',
      area: 'Sholinganallur',
      city: 'Chennai',
      pincode: '600119',
      isDefault: false
    }
  ]);

  const [newStreet, setNewStreet] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', {
        name,
        phone,
        savedAddresses: addresses
      });
      if (res.data.success) {
        updateUser({ name, phone, savedAddresses: addresses });
        alert('Profile preferences successfully saved!');
      }
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = () => {
    if (!newStreet || !newArea) return;
    const newAddr = {
      title: 'Secondary Address',
      street: newStreet,
      area: newArea,
      city: 'Chennai',
      pincode: newPincode || '600028',
      isDefault: false
    };
    setAddresses([...addresses, newAddr]);
    setNewStreet('');
    setNewArea('');
    setNewPincode('');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-teal-600">Preferences</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
            Customer Profile & Saved Addresses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your personal contact details, quick-dispatch addresses, and language preference.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Personal Info Card */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-navy-900">Personal Information</h3>

            <div className="flex items-center gap-4 pb-2">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                alt={user?.name}
                className="h-16 w-16 rounded-2xl object-cover border border-slate-200 shadow-xs"
              />
              <div>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                  Verified Customer Account
                </span>
                <p className="text-xs text-slate-400 mt-1">Registered email: {user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs sm:text-sm focus:border-teal-500 focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs sm:text-sm focus:border-teal-500 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            {/* Language Preference */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Platform Language</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`rounded-xl px-4 py-2 text-xs font-bold border transition ${
                    language === 'en'
                      ? 'border-teal-500 bg-teal-50 text-teal-800'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  English (Default)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('ta')}
                  className={`rounded-xl px-4 py-2 text-xs font-bold border transition ${
                    language === 'ta'
                      ? 'border-teal-500 bg-teal-50 text-teal-800'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  தமிழ் (Tamil)
                </button>
              </div>
            </div>
          </div>

          {/* Saved Addresses Card */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-navy-900">Saved Service Addresses</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-navy-900">{addr.title}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                        Default Dispatch
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {addr.street}, {addr.area}, {addr.city} - {addr.pincode}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick add address snippet */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <span className="text-xs font-bold text-slate-700 block">Add New Address:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Street / Building No."
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                />
                <input
                  type="text"
                  placeholder="Area / Locality"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddAddress}
                    className="shrink-0 rounded-xl bg-teal-600 hover:bg-teal-500 text-white px-3 py-2 text-xs font-bold transition"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-navy-900 hover:bg-navy-800 px-6 py-3 text-xs sm:text-sm font-bold text-white transition shadow-md flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
