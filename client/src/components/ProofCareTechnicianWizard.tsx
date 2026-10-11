import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Camera, 
  CheckSquare, 
  Wrench, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ArrowRight, 
  ArrowLeft,
  Upload,
  Sparkles,
  Lock,
  RefreshCw
} from 'lucide-react';
import api from '../services/api';

interface ProofCareTechnicianWizardProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const ProofCareTechnicianWizard: React.FC<ProofCareTechnicianWizardProps> = ({
  booking,
  isOpen,
  onClose,
  onRefresh
}) => {
  if (!isOpen || !booking) return null;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Check-in
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsVerified, setGpsVerified] = useState(booking.proofCare?.checkIn?.gpsVerified || false);
  const [checkInNotes, setCheckInNotes] = useState(booking.proofCare?.checkIn?.notes || '');
  const [technicianCoords, setTechnicianCoords] = useState<{ lat?: number; lng?: number; accuracy?: number }>({
    lat: booking.proofCare?.checkIn?.technicianLat,
    lng: booking.proofCare?.checkIn?.technicianLng,
    accuracy: booking.proofCare?.checkIn?.accuracyMeters
  });

  // Step 2: Before Photos
  const [beforePhotos, setBeforePhotos] = useState<any[]>(
    booking.proofCare?.beforePhotos?.length > 0
      ? booking.proofCare.beforePhotos
      : [
          {
            url: booking.serviceProof?.beforePhotoUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
            caption: 'Pre-service condition: Evaporator coil heavily clogged with micro-dust'
          }
        ]
  );
  const [newBeforeUrl, setNewBeforeUrl] = useState('');

  // Step 3: Checklist
  const [checklist, setChecklist] = useState<any[]>([]);

  // Step 4: Diagnosis & Work
  const [preliminaryCause, setPreliminaryCause] = useState(
    booking.proofCare?.diagnosis?.preliminaryCause || 'Restricted airflow across evaporator fins combined with split drain hose'
  );
  const [technicalDetails, setTechnicalDetails] = useState(
    booking.proofCare?.diagnosis?.technicalDetails || 'Thermal drop impeded by 4mm dust crusting. Secondary drain sleeve cracked from UV aging.'
  );
  const [technicianNotes, setTechnicianNotes] = useState(
    booking.proofCare?.workSummary?.technicianNotes || 'All evaporator fins sanitized. Pressure tested drain outlet under 2L flood test.'
  );
  const [partName, setPartName] = useState('Copper Drain Pipe Replacement (3m)');
  const [partCost, setPartCost] = useState('350');

  // Step 5: After Photos
  const [afterPhotos, setAfterPhotos] = useState<any[]>(
    booking.proofCare?.afterPhotos?.length > 0
      ? booking.proofCare.afterPhotos
      : [
          {
            url: booking.serviceProof?.afterPhotoUrl || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
            caption: 'Post-service verification: Deep cleaned cooling fins & fresh drain assembly'
          }
        ]
  );
  const [newAfterUrl, setNewAfterUrl] = useState('');

  // Step 6: OTP
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(booking.proofCare?.completionOtp?.code || null);

  // Load checklist on modal open
  useEffect(() => {
    api.get(`/proofcare/${booking._id}/checklist`)
      .then(res => {
        if (res.data.success && res.data.checklist) {
          setChecklist(res.data.checklist);
        }
      })
      .catch(() => {});
  }, [booking._id]);

  // Handle GPS Consent Check-in
  const handleGpsConsentCheckIn = () => {
    setGpsLoading(true);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Proceeding with manual check-in.');
      submitCheckIn(false, undefined, undefined, undefined);
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setTechnicianCoords({ lat: latitude, lng: longitude, accuracy });
        setGpsVerified(true);
        submitCheckIn(true, latitude, longitude, accuracy);
        setGpsLoading(false);
      },
      (error) => {
        console.warn('GPS permission denied or unavailable:', error.message);
        alert('GPS location permission skipped or denied. Recording verified manual check-in with server timestamp.');
        submitCheckIn(false, undefined, undefined, undefined);
        setGpsLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const submitCheckIn = async (consentGiven: boolean, lat?: number, lng?: number, accuracy?: number) => {
    setLoading(true);
    try {
      const res = await api.post(`/proofcare/${booking._id}/check-in`, {
        gpsConsentGiven: consentGiven,
        technicianLat: lat,
        technicianLng: lng,
        accuracyMeters: accuracy,
        notes: checkInNotes || (consentGiven ? 'Checked in on-site with device GPS consent.' : 'On-site check-in logged with server timestamp.')
      });
      if (res.data.success) {
        onRefresh();
        setCurrentStep(2);
      }
    } catch (err) {
      alert('Check-in failed.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 Submit Before Photos
  const handleSaveBeforePhotos = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/proofcare/${booking._id}/before-photos`, { photos: beforePhotos });
      if (res.data.success) {
        onRefresh();
        setCurrentStep(3);
      }
    } catch (err) {
      alert('Failed to save before photos.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3 Toggle Checklist Item
  const handleToggleChecklistItem = (itemKey: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.itemKey === itemKey) {
        return { ...item, checked: !item.checked };
      }
      return item;
    }));
  };

  const handleUpdateChecklistNotes = (itemKey: string, notes: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.itemKey === itemKey) {
        return { ...item, notes };
      }
      return item;
    }));
  };

  const handleSaveChecklist = async () => {
    setLoading(true);
    try {
      const res = await api.put(`/proofcare/${booking._id}/checklist`, { checklist });
      if (res.data.success) {
        onRefresh();
        setCurrentStep(4);
      }
    } catch (err) {
      alert('Failed to update checklist.');
    } finally {
      setLoading(false);
    }
  };

  // Step 4 Save Work & Parts
  const handleSaveWorkAndParts = async () => {
    setLoading(true);
    try {
      const replacedParts = partName ? [{
        name: partName,
        partNumber: 'OEM-PARTS-2026',
        cost: Number(partCost) || 0,
        warrantyDays: 90,
        approvedByCustomer: true
      }] : [];

      const res = await api.post(`/proofcare/${booking._id}/work-and-parts`, {
        diagnosis: { preliminaryCause, technicalDetails },
        workSummary: { tasksCompleted: ['Diagnostic Inspection', 'Foam Cleansing', 'Parts Replacement'], technicianNotes },
        replacedParts
      });
      if (res.data.success) {
        onRefresh();
        setCurrentStep(5);
      }
    } catch (err) {
      alert('Failed to save diagnosis.');
    } finally {
      setLoading(false);
    }
  };

  // Step 5 Save After Photos
  const handleSaveAfterPhotos = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/proofcare/${booking._id}/after-photos`, { photos: afterPhotos });
      if (res.data.success) {
        onRefresh();
        setCurrentStep(6);
      }
    } catch (err) {
      alert('Failed to save after photos.');
    } finally {
      setLoading(false);
    }
  };

  // Step 6 Trigger Completion OTP
  const handleRequestOtp = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/proofcare/${booking._id}/generate-otp`);
      if (res.data.success) {
        setGeneratedOtp(res.data.otpCode);
        onRefresh();
        alert(`ProofCare completion OTP generated and sent to customer! Demo Code: ${res.data.otpCode}`);
      }
    } catch (err) {
      alert('Failed to generate OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl relative border border-slate-200 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-teal-100 text-teal-800 text-[10px] font-extrabold px-2.5 py-0.5 uppercase tracking-wider">
                ProofCare Verified Workflow
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">#{booking.bookingNumber}</span>
            </div>
            <h2 className="text-xl font-extrabold text-navy-900 mt-1">
              Verified Service Completion Wizard
            </h2>
            <p className="text-xs text-slate-500">Multi-point on-site audit & tamper-evident evidence capture</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-2">
            <span>Step {currentStep} of 6</span>
            <span className="text-teal-700">
              {currentStep === 1 && '1. On-Site Check-In'}
              {currentStep === 2 && '2. Before-Service Photos'}
              {currentStep === 3 && '3. Digital Service Checklist'}
              {currentStep === 4 && '4. Diagnosis & Parts'}
              {currentStep === 5 && '5. After-Service Photos'}
              {currentStep === 6 && '6. Customer Completion OTP'}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-teal-600 h-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content Area */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4">
          {/* STEP 1: CHECK-IN */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 text-xs text-teal-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-teal-800">
                  <MapPin className="h-4 w-4" />
                  <span>On-Site Arrival Verification</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Technicians check in upon arrival at the customer premise. Device GPS verification is requested with explicit browser consent and recorded with the exact server timestamp.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Check-In Notes / Parking Arrival</label>
                <textarea
                  rows={2}
                  value={checkInNotes}
                  onChange={(e) => setCheckInNotes(e.target.value)}
                  placeholder="e.g. Arrived at customer gate. Tool kit and manifold gauge ready."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">GPS Verification Status:</span>
                  <span className={`font-bold ${gpsVerified ? 'text-emerald-700' : 'text-slate-600'}`}>
                    {gpsVerified ? '✓ Verified with Geolocation Consent' : 'Pending Check-In'}
                  </span>
                </div>
                {technicianCoords.lat && (
                  <div className="text-[11px] font-mono text-slate-500">
                    Coordinates: {technicianCoords.lat.toFixed(4)}° N, {technicianCoords.lng?.toFixed(4)}° E (Accuracy: ~{technicianCoords.accuracy || 10}m)
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleGpsConsentCheckIn}
                  disabled={gpsLoading || loading}
                  className="flex-1 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  <span>{gpsLoading ? 'Verifying Coordinates...' : 'Verify Arrival (GPS + Timestamp)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => submitCheckIn(false)}
                  disabled={loading}
                  className="rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold px-4 py-3 text-xs transition"
                >
                  Skip GPS
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: BEFORE PHOTOS */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
                <Camera className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Mandatory Step:</strong> Capture before-service photos documenting initial appliance condition, dust/corrosion, or existing damage before opening components.
                </span>
              </div>

              {/* Photos List */}
              <div className="grid grid-cols-2 gap-3">
                {beforePhotos.map((p, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 relative group">
                    <img src={p.url} alt="" className="h-32 w-full object-cover" />
                    <div className="p-2 bg-white text-[11px] text-slate-700 line-clamp-1">
                      {p.caption}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add another photo */}
              <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Add Photo URL or Demo Preset:</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBeforeUrl}
                    onChange={(e) => setNewBeforeUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newBeforeUrl.trim()) {
                        setBeforePhotos([...beforePhotos, { url: newBeforeUrl, caption: 'Pre-service photo' }]);
                        setNewBeforeUrl('');
                      }
                    }}
                    className="rounded-xl bg-navy-900 text-white px-3 py-1.5 text-xs font-bold shrink-0"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex justify-between pt-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600"
                >
                  Back
                </button>
                <button
                  onClick={handleSaveBeforePhotos}
                  disabled={loading}
                  className="rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold px-5 py-2 text-xs transition shadow-xs flex items-center gap-1.5"
                >
                  <span>Save Photos & Open Checklist</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DIGITAL CHECKLIST */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-start gap-2">
                <CheckSquare className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Digital Service Inspection Checklist:</strong> Every item is service-specific. Record measurements (e.g. TDS reading, pressure PSI, temperature split).
                </span>
              </div>

              <div className="space-y-3">
                {checklist.map((item) => (
                  <div
                    key={item.itemKey}
                    className={`p-4 rounded-2xl border transition ${
                      item.checked ? 'bg-emerald-50/50 border-emerald-300' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => handleToggleChecklistItem(item.itemKey)}
                        className="mt-1 h-4 w-4 rounded-md text-teal-600 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="text-xs font-bold text-navy-900">{item.label}</div>
                        <div className="text-[11px] text-teal-700 font-semibold mt-0.5">
                          Measured Target: {item.measuredValue}
                        </div>
                        <input
                          type="text"
                          value={item.notes}
                          onChange={(e) => handleUpdateChecklistNotes(item.itemKey, e.target.value)}
                          placeholder="Technician observation notes..."
                          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-3">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600"
                >
                  Back
                </button>
                <button
                  onClick={handleSaveChecklist}
                  disabled={loading}
                  className="rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold px-5 py-2 text-xs transition shadow-xs flex items-center gap-1.5"
                >
                  <span>Verify Checklist & Record Work</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: DIAGNOSIS & PARTS */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <Wrench className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Technical Diagnosis & Itemized Parts:</strong> Record all replaced parts. If costs exceed original quote, customer approval is required.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preliminary Cause of Issue</label>
                <input
                  type="text"
                  value={preliminaryCause}
                  onChange={(e) => setPreliminaryCause(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Technical Diagnosis & Work Done</label>
                <textarea
                  rows={2}
                  value={technicianNotes}
                  onChange={(e) => setTechnicianNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Replaced Spare Part</label>
                  <input
                    type="text"
                    value={partName}
                    onChange={(e) => setPartName(e.target.value)}
                    placeholder="e.g. Copper Drain Pipe (3m)"
                    className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Item Cost (₹)</label>
                  <input
                    type="number"
                    value={partCost}
                    onChange={(e) => setPartCost(e.target.value)}
                    placeholder="350"
                    className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-3">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600"
                >
                  Back
                </button>
                <button
                  onClick={handleSaveWorkAndParts}
                  disabled={loading}
                  className="rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold px-5 py-2 text-xs transition shadow-xs flex items-center gap-1.5"
                >
                  <span>Save & Upload After Photos</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: AFTER PHOTOS */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Post-Service Completion Evidence:</strong> Upload after-photos demonstrating pristine cleaning, leak-free joints, or new replacement parts fitted.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {afterPhotos.map((p, idx) => (
                  <div key={idx} className="rounded-2xl border-2 border-emerald-400 overflow-hidden bg-slate-100 relative shadow-xs">
                    <img src={p.url} alt="" className="h-32 w-full object-cover" />
                    <div className="p-2 bg-white text-[11px] font-semibold text-emerald-800 line-clamp-1">
                      {p.caption}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Add Photo URL:</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAfterUrl}
                    onChange={(e) => setNewAfterUrl(e.target.value)}
                    placeholder="https://example.com/after.jpg"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newAfterUrl.trim()) {
                        setAfterPhotos([...afterPhotos, { url: newAfterUrl, caption: 'Post-service verification' }]);
                        setNewAfterUrl('');
                      }
                    }}
                    className="rounded-xl bg-navy-900 text-white px-3 py-1.5 text-xs font-bold shrink-0"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex justify-between pt-3">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600"
                >
                  Back
                </button>
                <button
                  onClick={handleSaveAfterPhotos}
                  disabled={loading}
                  className="rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold px-5 py-2 text-xs transition shadow-xs flex items-center gap-1.5"
                >
                  <span>Confirm Photos & Request OTP</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: OTP COMPLETION */}
          {currentStep === 6 && (
            <div className="space-y-5 text-center py-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 border border-teal-200 shadow-sm">
                <Lock className="h-7 w-7" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-navy-900">
                  Customer Completion OTP Verification
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  To eliminate false completion claims, the work order will only be sealed once the customer verifies the evidence report with their booking OTP.
                </p>
              </div>

              {generatedOtp ? (
                <div className="p-5 rounded-3xl bg-gradient-to-r from-navy-950 to-navy-900 text-white shadow-lg max-w-sm mx-auto space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400 block">
                    Customer Completion OTP Code
                  </span>
                  <div className="text-3xl font-mono font-extrabold tracking-widest text-white">
                    {generatedOtp}
                  </div>
                  <span className="text-[11px] text-slate-300 block">
                    Sent to customer notification inbox & SMS. Ask customer to verify on their screen.
                  </span>
                </div>
              ) : (
                <button
                  onClick={handleRequestOtp}
                  disabled={loading}
                  className="rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold px-6 py-3.5 text-sm transition shadow-lg inline-flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span>{loading ? 'Dispatching...' : 'Dispatch 6-Digit Completion OTP to Customer'}</span>
                </button>
              )}

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 max-w-md mx-auto">
                Once customer verifies the OTP, an official tamper-evident <strong>Service Evidence Report</strong> will be generated.
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  onClick={onClose}
                  className="rounded-xl bg-navy-900 text-white px-6 py-2 text-xs font-bold shadow-xs"
                >
                  Close Wizard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
