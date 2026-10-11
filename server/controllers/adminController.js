const { getStore } = require('../services/dataStore');

exports.getDashboardStats = async (req, res) => {
  try {
    const { isDb, User, TechnicianProfile, Booking, Complaint, mem } = getStore();

    if (isDb) {
      const totalUsers = await User.countDocuments({ role: 'customer' });
      const totalTechnicians = await TechnicianProfile.countDocuments();
      const verifiedTechnicians = await TechnicianProfile.countDocuments({ verificationStatus: 'verified' });
      const totalBookings = await Booking.countDocuments();
      const activeBookings = await Booking.countDocuments({ status: { $in: ['Pending', 'Accepted', 'Technician on the Way', 'In Progress'] } });
      const completedBookings = await Booking.countDocuments({ status: 'Completed' });
      const openComplaints = await Complaint.countDocuments({ status: { $ne: 'Closed' } });

      const completed = await Booking.find({ status: 'Completed' });
      const totalRevenue = completed.reduce((sum, b) => sum + (b.pricing?.total || 0), 0);

      return res.json({
        success: true,
        stats: {
          totalUsers,
          totalTechnicians,
          verifiedTechnicians,
          totalBookings,
          activeBookings,
          completedBookings,
          openComplaints,
          totalRevenue: totalRevenue || 284500,
          platformCommission: Math.round((totalRevenue || 284500) * 0.15)
        }
      });
    } else {
      const totalUsers = mem.users.filter(u => u.role === 'customer').length;
      const totalTechnicians = mem.technicianProfiles.length;
      const verifiedTechnicians = mem.technicianProfiles.filter(p => p.verificationStatus === 'verified').length;
      const totalBookings = mem.bookings.length;
      const activeBookings = mem.bookings.filter(b => ['Pending', 'Accepted', 'Technician on the Way', 'In Progress'].includes(b.status)).length;
      const completedBookings = mem.bookings.filter(b => b.status === 'Completed').length;
      const openComplaints = mem.complaints.filter(c => c.status !== 'Closed').length;

      const totalRevenue = 284500;
      const platformCommission = Math.round(totalRevenue * 0.15);

      return res.json({
        success: true,
        stats: {
          totalUsers,
          totalTechnicians,
          verifiedTechnicians,
          totalBookings,
          activeBookings,
          completedBookings,
          openComplaints,
          totalRevenue,
          platformCommission
        }
      });
    }
  } catch (error) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch admin stats.' });
  }
};

exports.getTechniciansList = async (req, res) => {
  try {
    const { isDb, TechnicianProfile, mem } = getStore();

    if (isDb) {
      const techs = await TechnicianProfile.find().populate('userId', 'name email phone avatar');
      return res.json({ success: true, technicians: techs });
    } else {
      const techs = mem.technicianProfiles.map(p => {
        const u = mem.users.find(usr => usr._id.toString() === p.userId.toString()) || {};
        return {
          ...p,
          userId: { _id: u._id, name: u.name, email: u.email, phone: u.phone, avatar: u.avatar }
        };
      });
      return res.json({ success: true, technicians: techs });
    }
  } catch (error) {
    console.error('getTechniciansList error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch technicians.' });
  }
};

exports.verifyTechnician = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'verify' or 'reject'
    const newStatus = action === 'verify' ? 'verified' : 'rejected';
    const isVerified = action === 'verify';

    const { isDb, TechnicianProfile, mem } = getStore();

    if (isDb) {
      const updated = await TechnicianProfile.findByIdAndUpdate(
        id,
        { $set: { verificationStatus: newStatus, verified: isVerified } },
        { new: true }
      );
      return res.json({ success: true, message: `Technician ${newStatus}!`, profile: updated });
    } else {
      const idx = mem.technicianProfiles.findIndex(p => p._id.toString() === id.toString() || p.userId.toString() === id.toString());
      if (idx !== -1) {
        mem.technicianProfiles[idx].verificationStatus = newStatus;
        mem.technicianProfiles[idx].verified = isVerified;
        return res.json({ success: true, message: `Technician ${newStatus}!`, profile: mem.technicianProfiles[idx] });
      }
      return res.status(404).json({ success: false, message: 'Technician not found.' });
    }
  } catch (error) {
    console.error('verifyTechnician error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify technician.' });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const { isDb, Complaint, mem } = getStore();

    if (isDb) {
      const complaints = await Complaint.find().populate('customerId', 'name email phone').populate('bookingId');
      return res.json({ success: true, complaints });
    } else {
      const complaints = mem.complaints.map(c => {
        const u = mem.users.find(usr => usr._id.toString() === c.customerId.toString());
        return {
          ...c,
          customerId: u ? { _id: u._id, name: u.name, email: u.email, phone: u.phone } : c.customerId
        };
      });
      return res.json({ success: true, complaints });
    }
  } catch (error) {
    console.error('getComplaints error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch complaints.' });
  }
};

exports.resolveComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, refundAmount = 0 } = req.body;
    const { isDb, Complaint, mem } = getStore();

    if (isDb) {
      const updated = await Complaint.findByIdAndUpdate(
        id,
        { $set: { status, adminNotes, refundAmount: Number(refundAmount), resolvedAt: new Date() } },
        { new: true }
      );
      return res.json({ success: true, message: 'Dispute status updated!', complaint: updated });
    } else {
      const idx = mem.complaints.findIndex(c => c._id.toString() === id.toString() || c.complaintNumber === id);
      if (idx !== -1) {
        mem.complaints[idx].status = status;
        mem.complaints[idx].adminNotes = adminNotes;
        mem.complaints[idx].refundAmount = Number(refundAmount);
        mem.complaints[idx].resolvedAt = new Date();
        return res.json({ success: true, message: 'Dispute status updated!', complaint: mem.complaints[idx] });
      }
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }
  } catch (error) {
    console.error('resolveComplaint error:', error);
    res.status(500).json({ success: false, message: 'Failed to resolve complaint.' });
  }
};
