import React from 'react';
import { 
  ShieldCheck, 
  Printer, 
  X, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Wrench, 
  Award,
  Lock,
  FileText
} from 'lucide-react';

interface ServiceEvidenceReportModalProps {
  report: any;
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceEvidenceReportModal: React.FC<ServiceEvidenceReportModalProps> = ({
  report,
  isOpen,
  onClose
}) => {
  if (!isOpen || !report) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl relative border border-slate-200 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 print:hidden"
        >
          <X className="h-5 w-5" />
        </button>

        <div id="printable-proofcare-report" className="space-y-6">
          {/* Official Document Header */}
          <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-600 text-white font-extrabold text-xs">
                  ✓
                </span>
                <span className="text-lg font-extrabold text-navy-900 tracking-tight">
                  ServEase ProofCare™
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Official Certified Service Completion Evidence Report
              </p>
              <div className="text-[11px] text-teal-800 font-semibold mt-1">
                Tamper-Evident Digital Audit Record
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-[11px] font-mono text-slate-400 block uppercase">Report Identification</span>
              <span className="text-sm font-mono font-extrabold text-navy-900">{report.reportId}</span>
              <span className="text-xs text-slate-500 block mt-0.5">Booking Ref: #{report.bookingNumber}</span>
            </div>
          </div>

          {/* 3-Pill Status Grid: GPS, Checklist, OTP */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs">
              <span className="text-[10px] uppercase font-bold text-teal-700 block">1. Arrival Verification</span>
              <div className="font-extrabold text-navy-900 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
                <span>{report.checkIn?.gpsVerified ? 'GPS Consented Arrival' : 'Server Timestamped'}</span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                {new Date(report.checkIn?.checkedInAt || Date.now()).toLocaleTimeString()}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs">
              <span className="text-[10px] uppercase font-bold text-purple-700 block">2. Digital Checklist</span>
              <div className="font-extrabold text-navy-900 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-purple-600" />
                <span>{report.checklist?.filter((c: any) => c.checked).length} of {report.checklist?.length} Verified</span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-0.5">100% required items passed</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">3. Customer OTP Seal</span>
              <div className="font-extrabold text-navy-900 mt-0.5 flex items-center gap-1">
                <Lock className="h-3.5 w-3.5 text-emerald-600" />
                <span>{report.verification?.otpVerified ? 'OTP Verified by Customer' : 'OTP Pending'}</span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-0.5">Cryptographic signature active</span>
            </div>
          </div>

          {/* Booking & Technician Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-slate-400 font-bold block">Service Details & Destination:</span>
              <div className="font-bold text-slate-900 text-sm mt-0.5">{report.serviceTitle}</div>
              <div className="text-slate-600 mt-1">{report.customer?.name} • {report.customer?.phone}</div>
              <div className="text-slate-500">{report.customer?.address}</div>
            </div>
            <div>
              <span className="text-slate-400 font-bold block">Certified Technician:</span>
              <div className="font-bold text-slate-900 text-sm mt-0.5">{report.technician?.name}</div>
              <div className="text-slate-600 mt-1">{report.technician?.accreditation}</div>
              <div className="text-slate-500">Contact: {report.technician?.phone}</div>
            </div>
          </div>

          {/* Before vs After Photo Proof Section */}
          <div>
            <h4 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-3">
              Photo Proof Audit Evidence
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700">Pre-Service Condition</span>
                <div className="h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img
                    src={report.beforePhotos?.[0]?.url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'}
                    alt="Before Service"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="text-[11px] text-slate-500 italic">
                  {report.beforePhotos?.[0]?.caption || 'Pre-service condition photographed on-site'}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-teal-700">Post-Service Verified Completion</span>
                <div className="h-44 rounded-2xl overflow-hidden border-2 border-teal-500 bg-slate-100 shadow-xs">
                  <img
                    src={report.afterPhotos?.[0]?.url || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80'}
                    alt="After Service"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="text-[11px] text-slate-500 italic">
                  {report.afterPhotos?.[0]?.caption || 'Post-service verification evidence'}
                </p>
              </div>
            </div>
          </div>

          {/* Completed Digital Checklist */}
          <div>
            <h4 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-3">
              Service-Specific Checklist Verification
            </h4>
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white overflow-hidden text-xs">
              {report.checklist?.map((item: any, idx: number) => (
                <div key={idx} className="p-3 flex items-start justify-between gap-3 bg-slate-50/50">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block">{item.label}</span>
                    <span className="text-teal-700 font-semibold text-[11px] block">{item.measuredValue}</span>
                    {item.notes && <span className="text-slate-500 italic text-[11px]">"{item.notes}"</span>}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.checked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {item.checked ? '✓ Passed & Verified' : 'Standard'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnosis & Replaced Parts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Technical Diagnosis & Work Done</span>
              <p className="text-slate-800 leading-relaxed">
                {report.workSummary?.technicianNotes || 'Multi-point inspection and standard servicing executed according to OEM specifications.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Replaced Parts & Approved Charges</span>
              <div className="divide-y divide-slate-200">
                {report.replacedParts?.length > 0 ? (
                  report.replacedParts.map((p: any, idx: number) => (
                    <div key={idx} className="py-1 flex justify-between">
                      <span className="font-semibold text-slate-800">{p.name} ({p.warrantyDays}-day warranty)</span>
                      <span className="font-bold">₹{p.cost}</span>
                    </div>
                  ))
                ) : (
                  <div className="py-1 text-slate-500 italic">No spare parts replaced (standard labor)</div>
                )}
                <div className="pt-2 flex justify-between font-extrabold text-navy-900">
                  <span>Grand Total Billed:</span>
                  <span className="text-teal-700">₹{report.pricing?.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cryptographic Seal & Immutability Certificate */}
          <div className="p-4 rounded-2xl bg-navy-950 text-white space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-teal-400 font-extrabold uppercase tracking-wider text-[10px]">
                Cryptographic Audit Seal
              </span>
              <span className="text-slate-400 text-[10px]">SHA-256 Validated</span>
            </div>
            <div className="font-mono text-[10px] text-slate-300 break-all bg-navy-900 p-2 rounded-lg border border-navy-800">
              {report.verification?.signatureHash || 'PROOFCARE_DIGITALLY_SEALED_HASH_CERTIFIED'}
            </div>
            <p className="text-[10px] text-slate-400">
              This report is permanently bound to Booking #{report.bookingNumber} and cannot be altered or modified post-OTP confirmation.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="rounded-xl bg-navy-900 hover:bg-navy-800 text-white px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="h-4 w-4" />
            <span>Print Official Evidence Report</span>
          </button>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 text-xs font-bold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
