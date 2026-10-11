const { getStore } = require('../services/dataStore');

// Generate unique human-readable booking number
function generateBookingNumber() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SEB-2026-${rand}`;
}

exports.createBooking = async (req, res) => {
  try {
    const customerId = req.user.id;
    const {
      serviceId,
      technicianId,
      scheduledDate,
      scheduledTime,
      serviceAddress,
      problemDescription,
      emergencyMode = false,
      couponCode,
      registeredAssetId
    } = req.body;

    if (!serviceId || !scheduledDate || !scheduledTime || !serviceAddress || !problemDescription) {
      return res.status(400).json({ success: false, message: 'Please provide all mandatory booking fields.' });
    }

    const { isDb, Booking, Service, Notification, mem } = getStore();

    // Fetch service for transparent pricing
    let service;
    if (isDb) {
      service = await Service.findById(serviceId);
    } else {
      service = mem.services.find(s => s._id.toString() === serviceId.toString());
    }

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    // Transparent Price Estimator (Feature C)
    const visitingCharge = service.visitingCharge || 149;
    const baseLabor = service.basePrice || 399;
    const estimatedParts = service.sparePartsEstimateMin || 0;
    const subtotal = visitingCharge + baseLabor + estimatedParts;

    let discount = 0;
    if (couponCode) {
      const upper = couponCode.toUpperCase();
      if (upper === 'SERVE50') discount = 50;
      else if (upper === 'SMARTAI') discount = Math.min(200, Math.round(subtotal * 0.15));
      else if (upper === 'WELCOME100') discount = 100;
    }

    // Emergency fee if emergency mode selected (₹100 priority dispatch)
    const emergencyFee = emergencyMode ? 100 : 0;
    const taxableAmount = Math.max(0, subtotal + emergencyFee - discount);
    const taxGst = Math.round(taxableAmount * 0.18);
    const total = taxableAmount + taxGst;

    const bookingNumber = generateBookingNumber();

    const bookingData = {
      bookingNumber,
      customerId,
      technicianId: technicianId || (isDb ? null : '660000000000000000000002'), // fallback to Arun Kumar
      serviceId: service._id,
      categoryId: service.categoryId,
      status: 'Pending',
      scheduledDate,
      scheduledTime,
      serviceAddress,
      problemDescription,
      emergencyMode: Boolean(emergencyMode),
      pricing: {
        visitingCharge,
        baseLabor,
        estimatedParts,
        taxGst,
        discount,
        total
      },
      revisedQuote: {
        status: 'none',
        extraLaborCharge: 0,
        sparePartsList: [],
        reason: '',
        revisedTotal: 0
      },
      serviceProof: {
        beforePhotoUrl: '',
        afterPhotoUrl: '',
        technicianNotes: '',
        partsReplaced: [],
        customerApproved: false
      },
      tracking: {
        technicianLat: 13.0845,
        technicianLng: 80.2165,
        customerLat: 13.0850,
        customerLng: 80.2185,
        estimatedArrivalMins: emergencyMode ? 15 : 30,
        currentStepIndex: 0,
        statusUpdates: [
          {
            status: 'Pending',
            timestamp: new Date(),
            note: emergencyMode ? 'Urgent dispatch request logged.' : 'Booking received and verified.'
          }
        ]
      },
      payment: {
        method: req.body.paymentMethod || 'UPI / Online Card',
        status: 'Pending',
        transactionId: ''
      },
      registeredAssetId: registeredAssetId || null,
      createdAt: new Date()
    };

    let newBooking;
    if (isDb) {
      newBooking = await Booking.create(bookingData);
      // Notification for customer
      await Notification.create({
        recipientId: customerId,
        title: 'Booking Confirmed!',
        titleTa: 'முன்பதிவு உறுதி செய்யப்பட்டது!',
        message: `Your booking #${bookingNumber} for ${service.title} has been placed.`,
        messageTa: `உங்கள் முன்பதிவு #${bookingNumber} வெற்றிகரமாக பதிவு செய்யப்பட்டது.`,
        type: 'booking_update',
        referenceId: newBooking._id.toString()
      });
    } else {
      bookingData._id = 'mem_booking_' + Date.now();
      mem.bookings.unshift(bookingData);
      newBooking = bookingData;

      mem.notifications.unshift({
        _id: 'mem_notif_' + Date.now(),
        recipientId: customerId,
        title: 'Booking Confirmed!',
        titleTa: 'முன்பதிவு உறுதி செய்யப்பட்டது!',
        message: `Your booking #${bookingNumber} for ${service.title} has been placed.`,
        messageTa: `உங்கள் முன்பதிவு #${bookingNumber} வெற்றிகரமாக பதிவு செய்யப்பட்டது.`,
        type: 'booking_update',
        referenceId: newBooking._id.toString(),
        isRead: false,
        createdAt: new Date()
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      booking: newBooking
    });
  } catch (error) {
    console.error('createBooking error:', error);
    res.status(500).json({ success: false, message: 'Failed to create booking.' });
  }
};

exports.getCustomerBookings = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { isDb, Booking, mem } = getStore();

    if (isDb) {
      const bookings = await Booking.find({ customerId })
        .populate('serviceId')
        .populate('technicianId', 'name email phone avatar')
        .populate('categoryId')
        .sort({ createdAt: -1 });
      return res.json({ success: true, bookings });
    } else {
      const bookings = mem.bookings
        .filter(b => b.customerId.toString() === customerId.toString())
        .map(b => {
          const service = mem.services.find(s => s._id.toString() === b.serviceId?.toString());
          const techUser = mem.users.find(u => u._id.toString() === b.technicianId?.toString());
          const cat = mem.categories.find(c => c._id.toString() === b.categoryId?.toString());
          return {
            ...b,
            serviceId: service || b.serviceId,
            technicianId: techUser ? { _id: techUser._id, name: techUser.name, phone: techUser.phone, avatar: techUser.avatar } : b.technicianId,
            categoryId: cat || b.categoryId
          };
        });
      return res.json({ success: true, bookings });
    }
  } catch (error) {
    console.error('getCustomerBookings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch customer bookings.' });
  }
};

exports.getTechnicianBookings = async (req, res) => {
  try {
    const technicianId = req.user.id;
    const { isDb, Booking, mem } = getStore();

    if (isDb) {
      const bookings = await Booking.find({
        $or: [{ technicianId }, { status: 'Pending' }]
      })
        .populate('serviceId')
        .populate('customerId', 'name phone email avatar')
        .sort({ createdAt: -1 });
      return res.json({ success: true, bookings });
    } else {
      const bookings = mem.bookings
        .filter(b => !b.technicianId || b.technicianId.toString() === technicianId.toString() || b.status === 'Pending')
        .map(b => {
          const service = mem.services.find(s => s._id.toString() === b.serviceId?.toString());
          const custUser = mem.users.find(u => u._id.toString() === b.customerId?.toString());
          return {
            ...b,
            serviceId: service || b.serviceId,
            customerId: custUser ? { _id: custUser._id, name: custUser.name, phone: custUser.phone, avatar: custUser.avatar } : b.customerId
          };
        });
      return res.json({ success: true, bookings });
    }
  } catch (error) {
    console.error('getTechnicianBookings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch technician bookings.' });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const { isDb, Booking, mem } = getStore();

    if (isDb) {
      const booking = await Booking.findById(id)
        .populate('serviceId')
        .populate('technicianId', 'name phone email avatar')
        .populate('customerId', 'name phone email avatar savedAddresses');
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
      return res.json({ success: true, booking });
    } else {
      const b = mem.bookings.find(bk => bk._id.toString() === id.toString() || bk.bookingNumber === id);
      if (!b) return res.status(404).json({ success: false, message: 'Booking not found.' });
      const service = mem.services.find(s => s._id.toString() === b.serviceId?.toString());
      const techUser = mem.users.find(u => u._id.toString() === b.technicianId?.toString());
      const custUser = mem.users.find(u => u._id.toString() === b.customerId?.toString());
      return res.json({
        success: true,
        booking: {
          ...b,
          serviceId: service || b.serviceId,
          technicianId: techUser ? { _id: techUser._id, name: techUser.name, phone: techUser.phone, avatar: techUser.avatar } : b.technicianId,
          customerId: custUser ? { _id: custUser._id, name: custUser.name, phone: custUser.phone, avatar: custUser.avatar } : b.customerId
        }
      });
    }
  } catch (error) {
    console.error('getBookingById error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch booking details.' });
  }
};

// Update booking status (Technician / Admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    const validStatuses = ['Pending', 'Accepted', 'Technician on the Way', 'In Progress', 'Completed', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const { isDb, Booking, Notification, mem } = getStore();
    const stepMap = {
      'Pending': 0,
      'Accepted': 1,
      'Technician on the Way': 2,
      'In Progress': 3,
      'Completed': 4,
      'Cancelled': -1
    };

    if (isDb) {
      const booking = await Booking.findById(id);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

      booking.status = status;
      if (req.user.role === 'technician' && !booking.technicianId) {
        booking.technicianId = req.user.id;
      }
      booking.tracking.currentStepIndex = stepMap[status];
      booking.tracking.statusUpdates.push({
        status,
        timestamp: new Date(),
        note: note || `Booking status changed to ${status}`
      });

      if (status === 'Completed') {
        booking.payment.status = 'Paid';
        booking.payment.paidAt = new Date();
      }

      await booking.save();

      // Notify customer
      await Notification.create({
        recipientId: booking.customerId,
        title: `Status: ${status}`,
        titleTa: `நிலை: ${status}`,
        message: `Your booking #${booking.bookingNumber} is now ${status}. ${note || ''}`,
        type: 'booking_update',
        referenceId: booking._id.toString()
      });

      return res.json({ success: true, message: `Status updated to ${status}`, booking });
    } else {
      const idx = mem.bookings.findIndex(b => b._id.toString() === id.toString() || b.bookingNumber === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Booking not found.' });

      mem.bookings[idx].status = status;
      if (req.user.role === 'technician' && !mem.bookings[idx].technicianId) {
        mem.bookings[idx].technicianId = req.user.id;
      }
      mem.bookings[idx].tracking.currentStepIndex = stepMap[status];
      mem.bookings[idx].tracking.statusUpdates.push({
        status,
        timestamp: new Date(),
        note: note || `Status changed to ${status}`
      });

      if (status === 'Completed') {
        mem.bookings[idx].payment.status = 'Paid';
        mem.bookings[idx].payment.paidAt = new Date();
      }

      mem.notifications.unshift({
        _id: 'mem_notif_' + Date.now(),
        recipientId: mem.bookings[idx].customerId,
        title: `Status: ${status}`,
        titleTa: `நிலை: ${status}`,
        message: `Your booking #${mem.bookings[idx].bookingNumber} is now ${status}. ${note || ''}`,
        type: 'booking_update',
        referenceId: mem.bookings[idx]._id.toString(),
        isRead: false,
        createdAt: new Date()
      });

      return res.json({ success: true, message: `Status updated to ${status}`, booking: mem.bookings[idx] });
    }
  } catch (error) {
    console.error('updateBookingStatus error:', error);
    res.status(500).json({ success: false, message: 'Failed to update status.' });
  }
};

// Feature C: Technician submits revised quote
exports.submitRevisedQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { extraLaborCharge = 0, sparePartsList = [], reason } = req.body;

    if (!reason) {
      return res.status(400).json({ success: false, message: 'Please provide reason for quote revision.' });
    }

    const { isDb, Booking, Notification, mem } = getStore();

    if (isDb) {
      const booking = await Booking.findById(id);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

      const partsTotal = sparePartsList.reduce((acc, p) => acc + (Number(p.cost) || 0), 0);
      const revisedTotal = booking.pricing.total + Number(extraLaborCharge) + partsTotal;

      booking.revisedQuote = {
        status: 'pending',
        extraLaborCharge: Number(extraLaborCharge),
        sparePartsList,
        reason,
        revisedTotal,
        submittedAt: new Date()
      };

      await booking.save();

      await Notification.create({
        recipientId: booking.customerId,
        title: 'Quote Revision Requested',
        titleTa: 'கூடுதல் மேற்கோள் கோரப்பட்டது',
        message: `Technician submitted a revised quote of ₹${revisedTotal} for approval.`,
        type: 'quote_received',
        referenceId: booking._id.toString()
      });

      return res.json({ success: true, message: 'Revised quote submitted for customer approval.', booking });
    } else {
      const idx = mem.bookings.findIndex(b => b._id.toString() === id.toString() || b.bookingNumber === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Booking not found.' });

      const partsTotal = sparePartsList.reduce((acc, p) => acc + (Number(p.cost) || 0), 0);
      const revisedTotal = mem.bookings[idx].pricing.total + Number(extraLaborCharge) + partsTotal;

      mem.bookings[idx].revisedQuote = {
        status: 'pending',
        extraLaborCharge: Number(extraLaborCharge),
        sparePartsList,
        reason,
        revisedTotal,
        submittedAt: new Date()
      };

      mem.notifications.unshift({
        _id: 'mem_notif_' + Date.now(),
        recipientId: mem.bookings[idx].customerId,
        title: 'Quote Revision Requested',
        titleTa: 'கூடுதல் மேற்கோள் கோரப்பட்டது',
        message: `Technician submitted a revised quote of ₹${revisedTotal} for approval.`,
        type: 'quote_received',
        referenceId: mem.bookings[idx]._id.toString(),
        isRead: false,
        createdAt: new Date()
      });

      return res.json({ success: true, message: 'Revised quote submitted for customer approval.', booking: mem.bookings[idx] });
    }
  } catch (error) {
    console.error('submitRevisedQuote error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit quote.' });
  }
};

// Feature C: Customer approves or rejects revised quote
exports.respondToQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'approve' or 'reject'

    const { isDb, Booking, Notification, mem } = getStore();

    if (isDb) {
      const booking = await Booking.findById(id);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

      if (action === 'approve') {
        booking.revisedQuote.status = 'approved';
        booking.pricing.total = booking.revisedQuote.revisedTotal;
      } else {
        booking.revisedQuote.status = 'rejected';
      }

      await booking.save();

      if (booking.technicianId) {
        await Notification.create({
          recipientId: booking.technicianId,
          title: `Quote ${action === 'approve' ? 'Approved' : 'Rejected'}`,
          titleTa: `மேற்கோள் ${action === 'approve' ? 'ஏற்கப்பட்டது' : 'நிராகரிக்கப்பட்டது'}`,
          message: `Customer ${action === 'approve' ? 'accepted' : 'declined'} your revised quote for Booking #${booking.bookingNumber}.`,
          type: 'booking_update',
          referenceId: booking._id.toString()
        });
      }

      return res.json({ success: true, message: `Quote ${action === 'approve' ? 'approved' : 'rejected'}.`, booking });
    } else {
      const idx = mem.bookings.findIndex(b => b._id.toString() === id.toString() || b.bookingNumber === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Booking not found.' });

      if (action === 'approve') {
        mem.bookings[idx].revisedQuote.status = 'approved';
        mem.bookings[idx].pricing.total = mem.bookings[idx].revisedQuote.revisedTotal;
      } else {
        mem.bookings[idx].revisedQuote.status = 'rejected';
      }

      return res.json({ success: true, message: `Quote ${action === 'approve' ? 'approved' : 'rejected'}.`, booking: mem.bookings[idx] });
    }
  } catch (error) {
    console.error('respondToQuote error:', error);
    res.status(500).json({ success: false, message: 'Failed to process quote response.' });
  }
};

// Feature G: Before & After proof upload
exports.submitServiceProof = async (req, res) => {
  try {
    const { id } = req.params;
    const { beforePhotoUrl, afterPhotoUrl, technicianNotes, partsReplaced } = req.body;

    const { isDb, Booking, mem } = getStore();

    if (isDb) {
      const booking = await Booking.findById(id);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

      booking.serviceProof = {
        beforePhotoUrl: beforePhotoUrl || booking.serviceProof?.beforePhotoUrl || '',
        afterPhotoUrl: afterPhotoUrl || booking.serviceProof?.afterPhotoUrl || '',
        technicianNotes: technicianNotes || booking.serviceProof?.technicianNotes || '',
        partsReplaced: partsReplaced || booking.serviceProof?.partsReplaced || [],
        customerApproved: false,
        uploadedAt: new Date()
      };

      await booking.save();
      return res.json({ success: true, message: 'Service proof uploaded!', booking });
    } else {
      const idx = mem.bookings.findIndex(b => b._id.toString() === id.toString() || b.bookingNumber === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Booking not found.' });

      mem.bookings[idx].serviceProof = {
        beforePhotoUrl: beforePhotoUrl || mem.bookings[idx].serviceProof?.beforePhotoUrl || '',
        afterPhotoUrl: afterPhotoUrl || mem.bookings[idx].serviceProof?.afterPhotoUrl || '',
        technicianNotes: technicianNotes || mem.bookings[idx].serviceProof?.technicianNotes || '',
        partsReplaced: partsReplaced || mem.bookings[idx].serviceProof?.partsReplaced || [],
        customerApproved: false,
        uploadedAt: new Date()
      };

      return res.json({ success: true, message: 'Service proof uploaded!', booking: mem.bookings[idx] });
    }
  } catch (error) {
    console.error('submitServiceProof error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload proof.' });
  }
};

// Customer approves service completion proof
exports.approveServiceProof = async (req, res) => {
  try {
    const { id } = req.params;
    const { isDb, Booking, mem } = getStore();

    if (isDb) {
      const booking = await Booking.findById(id);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

      booking.serviceProof.customerApproved = true;
      booking.status = 'Completed';
      booking.tracking.currentStepIndex = 4;
      booking.payment.status = 'Paid';
      booking.payment.paidAt = new Date();
      await booking.save();

      return res.json({ success: true, message: 'Work completion approved by customer!', booking });
    } else {
      const idx = mem.bookings.findIndex(b => b._id.toString() === id.toString() || b.bookingNumber === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Booking not found.' });

      mem.bookings[idx].serviceProof.customerApproved = true;
      mem.bookings[idx].status = 'Completed';
      mem.bookings[idx].tracking.currentStepIndex = 4;
      mem.bookings[idx].payment.status = 'Paid';
      mem.bookings[idx].payment.paidAt = new Date();

      return res.json({ success: true, message: 'Work completion approved by customer!', booking: mem.bookings[idx] });
    }
  } catch (error) {
    console.error('approveServiceProof error:', error);
    res.status(500).json({ success: false, message: 'Failed to approve proof.' });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const { isDb, Booking, mem } = getStore();

    if (isDb) {
      const booking = await Booking.findById(id);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

      booking.status = 'Cancelled';
      booking.cancellationReason = reason || 'Cancelled by customer';
      booking.cancelledBy = req.user.role;
      booking.tracking.currentStepIndex = -1;
      await booking.save();

      return res.json({ success: true, message: 'Booking cancelled.', booking });
    } else {
      const idx = mem.bookings.findIndex(b => b._id.toString() === id.toString() || b.bookingNumber === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Booking not found.' });

      mem.bookings[idx].status = 'Cancelled';
      mem.bookings[idx].cancellationReason = reason || 'Cancelled by customer';
      mem.bookings[idx].cancelledBy = req.user.role;
      mem.bookings[idx].tracking.currentStepIndex = -1;

      return res.json({ success: true, message: 'Booking cancelled.', booking: mem.bookings[idx] });
    }
  } catch (error) {
    console.error('cancelBooking error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel booking.' });
  }
};

// Real-Time Live Tracking Telemetry Update (Food delivery-style pro movement)
exports.updateTelemetry = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      technicianLat,
      technicianLng,
      speedKmh,
      heading,
      distanceKm,
      estimatedArrivalMins
    } = req.body;

    const { isDb, Booking, mem } = getStore();

    if (isDb) {
      const booking = await Booking.findById(id);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

      if (technicianLat !== undefined) booking.tracking.technicianLat = Number(technicianLat);
      if (technicianLng !== undefined) booking.tracking.technicianLng = Number(technicianLng);
      if (speedKmh !== undefined) booking.tracking.speedKmh = Number(speedKmh);
      if (heading !== undefined) booking.tracking.heading = Number(heading);
      if (distanceKm !== undefined) booking.tracking.distanceKm = Number(distanceKm);
      if (estimatedArrivalMins !== undefined) booking.tracking.estimatedArrivalMins = Number(estimatedArrivalMins);
      booking.tracking.lastLocationUpdate = new Date();

      await booking.save();
      return res.json({
        success: true,
        message: 'Telemetry updated successfully.',
        tracking: booking.tracking
      });
    } else {
      const idx = mem.bookings.findIndex(b => b._id.toString() === id.toString() || b.bookingNumber === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Booking not found.' });

      const tr = mem.bookings[idx].tracking;
      if (technicianLat !== undefined) tr.technicianLat = Number(technicianLat);
      if (technicianLng !== undefined) tr.technicianLng = Number(technicianLng);
      if (speedKmh !== undefined) tr.speedKmh = Number(speedKmh);
      if (heading !== undefined) tr.heading = Number(heading);
      if (distanceKm !== undefined) tr.distanceKm = Number(distanceKm);
      if (estimatedArrivalMins !== undefined) tr.estimatedArrivalMins = Number(estimatedArrivalMins);
      tr.lastLocationUpdate = new Date();

      return res.json({
        success: true,
        message: 'Telemetry updated successfully.',
        tracking: tr
      });
    }
  } catch (error) {
    console.error('updateTelemetry error:', error);
    res.status(500).json({ success: false, message: 'Failed to update telemetry.' });
  }
};

