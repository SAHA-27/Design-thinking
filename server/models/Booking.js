const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingNumber: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCategory' },
  
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Technician on the Way', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  
  scheduledDate: { type: String, required: true },
  scheduledTime: { type: String, required: true },
  
  serviceAddress: {
    street: { type: String, required: true },
    area: { type: String, default: '' },
    city: { type: String, default: 'Chennai' },
    pincode: { type: String, default: '' },
    phone: { type: String, default: '' }
  },
  
  problemDescription: { type: String, required: true },
  emergencyMode: { type: Boolean, default: false },
  
  pricing: {
    visitingCharge: { type: Number, default: 149 },
    baseLabor: { type: Number, default: 350 },
    estimatedParts: { type: Number, default: 0 },
    taxGst: { type: Number, default: 90 },
    discount: { type: Number, default: 0 },
    total: { type: Number, default: 589 }
  },

  // Feature C: Transparent Price Estimator & Revised Quotes
  revisedQuote: {
    status: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
    extraLaborCharge: { type: Number, default: 0 },
    sparePartsList: [{ name: String, cost: Number }],
    reason: { type: String, default: '' },
    revisedTotal: { type: Number, default: 0 },
    submittedAt: { type: Date }
  },

  // Legacy proof field kept for backward compatibility
  serviceProof: {
    beforePhotoUrl: { type: String, default: '' },
    afterPhotoUrl: { type: String, default: '' },
    technicianNotes: { type: String, default: '' },
    partsReplaced: [{ type: String }],
    customerApproved: { type: Boolean, default: false },
    uploadedAt: { type: Date }
  },

  // SIGNATURE FEATURE: ServEase ProofCare — Verified Service Completion System
  proofCare: {
    currentStage: {
      type: String,
      enum: ['not_started', 'checked_in', 'before_photos_uploaded', 'checklist_in_progress', 'work_recorded', 'after_photos_uploaded', 'otp_pending', 'completed_verified', 'disputed'],
      default: 'not_started'
    },
    checkIn: {
      checkedInAt: { type: Date },
      gpsVerified: { type: Boolean, default: false },
      technicianLat: { type: Number },
      technicianLng: { type: Number },
      accuracyMeters: { type: Number },
      notes: { type: String, default: '' }
    },
    beforePhotos: [
      {
        url: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
        caption: { type: String, default: 'Pre-service condition' }
      }
    ],
    checklist: [
      {
        itemKey: { type: String, required: true },
        label: { type: String, required: true },
        required: { type: Boolean, default: true },
        checked: { type: Boolean, default: false },
        measuredValue: { type: String, default: '' },
        notes: { type: String, default: '' }
      }
    ],
    diagnosis: {
      preliminaryCause: { type: String, default: '' },
      technicalDetails: { type: String, default: '' },
      diagnosticTime: { type: Date }
    },
    workSummary: {
      tasksCompleted: [{ type: String }],
      technicianNotes: { type: String, default: '' },
      safetyCheckPassed: { type: Boolean, default: true }
    },
    replacedParts: [
      {
        name: { type: String, required: true },
        partNumber: { type: String, default: 'OEM-GEN-01' },
        cost: { type: Number, default: 0 },
        warrantyDays: { type: Number, default: 90 },
        approvedByCustomer: { type: Boolean, default: true }
      }
    ],
    afterPhotos: [
      {
        url: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
        caption: { type: String, default: 'Post-service verification' }
      }
    ],
    completionOtp: {
      code: { type: String }, // e.g. "849201"
      expiresAt: { type: Date },
      isVerified: { type: Boolean, default: false },
      verifiedAt: { type: Date },
      attempts: { type: Number, default: 0 }
    },
    customerReview: {
      approved: { type: Boolean, default: false },
      confirmedAt: { type: Date },
      rating: { type: Number, min: 1, max: 5 },
      remarks: { type: String, default: '' }
    },
    evidenceReport: {
      reportId: { type: String },
      generatedAt: { type: Date },
      signatureHash: { type: String },
      isImmutable: { type: Boolean, default: false }
    },
    dispute: {
      isDisputed: { type: Boolean, default: false },
      category: { type: String, default: '' },
      reason: { type: String, default: '' },
      customerNotes: { type: String, default: '' },
      raisedAt: { type: Date },
      status: { type: String, enum: ['none', 'open', 'under_investigation', 'resolved'], default: 'none' },
      resolutionNotes: { type: String, default: '' }
    }
  },

  // Live Tracking
  tracking: {
    technicianLat: { type: Number, default: 13.0827 },
    technicianLng: { type: Number, default: 80.2707 },
    customerLat: { type: Number, default: 13.0850 },
    customerLng: { type: Number, default: 80.2730 },
    estimatedArrivalMins: { type: Number, default: 25 },
    currentStepIndex: { type: Number, default: 0 },
    statusUpdates: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String
      }
    ]
  },

  payment: {
    method: { type: String, enum: ['Cash on Service', 'UPI / Online Card', 'Wallet'], default: 'UPI / Online Card' },
    status: { type: String, enum: ['Pending', 'Paid', 'Refunded'], default: 'Pending' },
    transactionId: { type: String, default: '' },
    paidAt: { type: Date }
  },

  cancellationReason: { type: String, default: '' },
  cancelledBy: { type: String, enum: ['customer', 'technician', 'admin', 'none'], default: 'none' },
  
  registeredAssetId: { type: mongoose.Schema.Types.ObjectId, ref: 'RegisteredAsset' },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
