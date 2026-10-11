import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  RotateCcw, 
  CheckCircle2, 
  Star, 
  Printer, 
  X, 
  Calendar, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const ServiceHistoryInvoicesPage: React.FC = () => {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  useEffect(() => {
    api.get('/bookings/my-bookings')
      .then(res => {
        if (res.data.success) {
          setBookings(res.data.bookings);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-teal-600">Records & Billing</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
            Service History & Tax Invoices
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Inspect all past jobs, download certified digital invoices, and initiate quick rebookings.
          </p>
        </div>

        {/* Bookings Table / Cards */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-500">Loading service records...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center border border-slate-200">
            <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">No past services recorded yet</p>
            <p className="text-xs text-slate-500 mt-1">When you complete bookings, official tax invoices will be generated here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">#{b.bookingNumber}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                      b.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.status === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-teal-100 text-teal-800'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-navy-900">
                    {b.serviceId?.title || 'Certified Home Service'}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {b.scheduledDate} ({b.scheduledTime})
                    </span>
                    <span>•</span>
                    <span>Pro: <strong>{b.technicianId?.name || 'Assigned Specialist'}</strong></span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 self-start md:self-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-right mr-3 hidden sm:block">
                    <span className="text-[11px] text-slate-400 block">Total Billed</span>
                    <span className="text-base font-extrabold text-navy-900">₹{b.pricing?.total}</span>
                  </div>

                  <button
                    onClick={() => setSelectedInvoice(b)}
                    className="rounded-xl border border-slate-200 hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition flex items-center gap-1.5"
                  >
                    <FileText className="h-4 w-4 text-teal-600" />
                    <span>View Invoice</span>
                  </button>

                  <Link
                    to={`/track/${b._id}`}
                    className="rounded-xl bg-navy-900 hover:bg-navy-800 px-3.5 py-2 text-xs font-bold text-white transition"
                  >
                    Details
                  </Link>

                  <Link
                    to={`/booking/new?serviceId=${b.serviceId?._id || b.serviceId}`}
                    className="rounded-xl bg-teal-600 hover:bg-teal-500 px-3.5 py-2 text-xs font-bold text-white transition flex items-center gap-1 shadow-xs"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Rebook</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Printable / Viewable Digital Tax Invoice Modal */}
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl relative border border-slate-200 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 print:hidden"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Invoice Content */}
              <div id="printable-tax-invoice" className="space-y-6">
                {/* Invoice Header */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-5">
                  <div>
                    <h2 className="text-xl font-extrabold text-navy-900 tracking-tight">ServEase AI Technologies</h2>
                    <p className="text-xs text-slate-500">GSTIN: 33AAACS9981B1Z2 • CIN: U72900TN2026PTC10982</p>
                    <p className="text-xs text-slate-500">Anna Nagar East, Chennai - 600040</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs uppercase tracking-wider text-teal-700 font-extrabold block">Official Tax Invoice</span>
                    <span className="text-sm font-mono font-bold text-slate-800">INV-2026-{selectedInvoice.bookingNumber?.slice(-4)}</span>
                    <span className="text-xs text-slate-500 block mt-0.5">Date: {selectedInvoice.scheduledDate}</span>
                  </div>
                </div>

                {/* Customer & Technician meta */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 uppercase font-bold text-[10px] block">Billed To (Customer):</span>
                    <span className="font-bold text-slate-900">{selectedInvoice.customerId?.name || 'Karthik Raman'}</span>
                    <p className="text-slate-600 mt-0.5">
                      {selectedInvoice.serviceAddress?.street}, {selectedInvoice.serviceAddress?.area}, {selectedInvoice.serviceAddress?.city}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 uppercase font-bold text-[10px] block">Service Specialist:</span>
                    <span className="font-bold text-slate-900">{selectedInvoice.technicianId?.name || 'Arun Kumar'}</span>
                    <span className="text-slate-500 block">Verified Certified Partner</span>
                  </div>
                </div>

                {/* Items table */}
                <table className="w-full text-xs text-left divide-y divide-slate-100">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3 text-right">Rate</th>
                      <th className="py-2.5 px-3 text-right">Tax (18%)</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    <tr>
                      <td className="py-3 px-3">
                        <span className="font-bold block">{selectedInvoice.serviceId?.title || 'Service Item'}</span>
                        <span className="text-slate-500 text-[11px]">Visiting Diagnostic & Inspection Charge</span>
                      </td>
                      <td className="py-3 px-3 text-right">₹{selectedInvoice.pricing?.visitingCharge}</td>
                      <td className="py-3 px-3 text-right">₹{Math.round(selectedInvoice.pricing?.visitingCharge * 0.18)}</td>
                      <td className="py-3 px-3 text-right font-bold">
                        ₹{Math.round(selectedInvoice.pricing?.visitingCharge * 1.18)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3">
                        <span className="font-bold block">Base Technical Labor & Calibration</span>
                        <span className="text-slate-500 text-[11px]">Certified technician doorstep repair</span>
                      </td>
                      <td className="py-3 px-3 text-right">₹{selectedInvoice.pricing?.baseLabor}</td>
                      <td className="py-3 px-3 text-right">₹{Math.round(selectedInvoice.pricing?.baseLabor * 0.18)}</td>
                      <td className="py-3 px-3 text-right font-bold">
                        ₹{Math.round(selectedInvoice.pricing?.baseLabor * 1.18)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Totals */}
                <div className="border-t border-slate-200 pt-3 flex justify-end text-xs">
                  <div className="w-64 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Subtotal:</span>
                      <span className="font-semibold">
                        ₹{(selectedInvoice.pricing?.visitingCharge || 149) + (selectedInvoice.pricing?.baseLabor || 399)}
                      </span>
                    </div>
                    {selectedInvoice.pricing?.discount > 0 && (
                      <div className="flex justify-between text-teal-600 font-bold">
                        <span>Coupon Discount:</span>
                        <span>-₹{selectedInvoice.pricing?.discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-500">
                      <span>Total GST (18%):</span>
                      <span className="font-semibold">₹{selectedInvoice.pricing?.taxGst}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-extrabold text-navy-900">
                      <span>Grand Total:</span>
                      <span className="text-teal-700">₹{selectedInvoice.pricing?.total}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 text-[11px] font-bold">
                      <span>Payment Status:</span>
                      <span>PAID via UPI</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-500 text-center border border-slate-100">
                  This is a computer-generated tax invoice backed by the ServEase 30-Day Service Guarantee.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-3 print:hidden">
                <button
                  onClick={handlePrint}
                  className="rounded-xl bg-navy-900 hover:bg-navy-800 text-white px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 text-xs font-bold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
