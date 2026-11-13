import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { TechnicianItem } from '../data/mockTechnicians';

interface QuickBookingModalProps {
  technician: TechnicianItem | null;
  isOpen: boolean;
  onClose: () => void;
  isEmergencyDefault?: boolean;
}

export const QuickBookingModal: React.FC<QuickBookingModalProps> = ({
  technician,
  isOpen,
  onClose,
  isEmergencyDefault = false
}) => {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState('2026-10-15');
  const [selectedSlot, setSelectedSlot] = useState(
    technician?.availableSlots?.[0] || '10:00 AM - 12:00 PM'
  );
  const [problemDescription, setProblemDescription] = useState('');
  const [isEmergency, setIsEmergency] = useState(isEmergencyDefault);

  if (!isOpen || !technician) return null;

  const techName = technician.userId?.name || (technician as any).name || 'Verified Specialist';
  const techAvatar = technician.userId?.avatar || (technician as any).avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80';
  const techId = technician.userId?._id || technician._id;

  const defaultSlots = technician.availableSlots || [
    '09:00 AM - 11:00 AM',
    '11:30 AM - 01:30 PM',
    '02:30 PM - 04:30 PM',
    '05:00 PM - 07:00 PM'
  ];

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({
      technicianId: techId,
      technicianName: techName,
      category: technician.category || technician.specialization || 'General',
      visitingFee: (technician.visitingFee || 149).toString(),
      date: selectedDate,
      time: selectedSlot,
      emergency: isEmergency ? 'true' : 'false',
      ...(problemDescription && { problem: problemDescription })
    });

    onClose();
    navigate(`/booking/new?${query.toString()}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          aria-label="Close booking modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Direct Pro Appointment</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900">
            Book Appointment with {techName}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select your preferred time slot and specify your service needs.
          </p>
        </div>

        {/* Technician Summary Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={techAvatar}
              alt={techName}
              className="h-12 w-12 rounded-xl object-cover border border-slate-200 shadow-xs"
            />
            <div>
              <h3 className="text-sm font-bold text-navy-900 flex items-center gap-1">
                {techName}
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
              </h3>
              <p className="text-xs text-teal-700 font-medium">{technician.specialization || technician.category}</p>
              <span className="text-[11px] text-slate-400">
                {technician.distanceKm} km away • ~{technician.estimatedArrivalMins}m ETA
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Visiting Charge</span>
            <span className="text-base font-extrabold text-navy-900">₹{technician.visitingFee || 149}</span>
          </div>
        </div>

        <form onSubmit={handleProceed} className="space-y-4">
          {/* Emergency Priority Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
              <div>
                <span className="font-bold text-rose-900 block">Emergency 25-Min Dispatch</span>
                <span className="text-[11px] text-rose-700">Immediate priority response without queue</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isEmergency}
                onChange={(e) => setIsEmergency(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-teal-600" />
              <span>Select Service Date</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Today', value: '2026-10-15' },
                { label: 'Tomorrow', value: '2026-10-16' },
                { label: 'Oct 17', value: '2026-10-17' }
              ].map((d) => (
                <button
                  type="button"
                  key={d.value}
                  onClick={() => setSelectedDate(d.value)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition border text-center ${
                    selectedDate === d.value
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Appointment Slot Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-teal-600" />
              <span>Available Appointment Slots</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {defaultSlots.map((slot, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition border text-center ${
                    selectedSlot === slot
                      ? 'bg-navy-900 text-white border-navy-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Issue Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Issue or Requirement Note (Optional)
            </label>
            <textarea
              rows={2}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="e.g. AC not cooling room properly, making humming noise..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
            />
          </div>

          {/* Guarantee Pill */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-medium">
            <ShieldCheck className="h-4 w-4 text-teal-600 shrink-0" />
            <span>Backed by 30-Day Workmanship Guarantee & Verified Trust Rating.</span>
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-teal-600 hover:bg-teal-500 px-5 py-2.5 text-xs font-bold text-white transition shadow-md flex items-center gap-1.5"
            >
              <span>Continue to Checkout</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
