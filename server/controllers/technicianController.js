const { getStore } = require('../services/dataStore');

// Helper to calculate approximate distance in km (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10;
}

exports.searchTechnicians = async (req, res) => {
  try {
    const { 
      skill, 
      category,
      area, 
      emergency, 
      minRating, 
      minTrust, 
      maxDistance, 
      maxPrice, 
      search, 
      q,
      sortBy = 'recommended',
      customerLat = 13.0827, 
      customerLng = 80.2707 
    } = req.query;
    const { isDb, TechnicianProfile, User, mem } = getStore();

    let profiles = [];
    if (isDb) {
      profiles = await TechnicianProfile.find().populate('userId', 'name email phone avatar').lean();
    } else {
      profiles = mem.technicianProfiles.map(p => {
        const user = mem.users.find(u => u._id.toString() === p.userId.toString()) || {};
        return {
          ...p,
          userId: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar
          }
        };
      });
    }

    // Filter by verification status (default only show verified, or all for testing)
    let results = profiles.filter(p => p.verificationStatus === 'verified' || !p.verificationStatus);

    if (emergency === 'true') {
      results = results.filter(p => p.emergencyAvailable && p.isAvailable);
    }

    const tradeFilter = skill || category;
    if (tradeFilter) {
      const qSkill = tradeFilter.toLowerCase();
      results = results.filter(p => 
        (p.skills && p.skills.some(s => s.toLowerCase().includes(qSkill))) ||
        (p.bio && p.bio.toLowerCase().includes(qSkill))
      );
    }

    const keyword = search || q;
    if (keyword) {
      const qKey = keyword.toLowerCase().trim();
      results = results.filter(p =>
        (p.userId?.name && p.userId.name.toLowerCase().includes(qKey)) ||
        (p.bio && p.bio.toLowerCase().includes(qKey)) ||
        (p.skills && p.skills.some(s => s.toLowerCase().includes(qKey))) ||
        (p.serviceAreas && p.serviceAreas.some(a => a.toLowerCase().includes(qKey)))
      );
    }

    if (area) {
      const qArea = area.toLowerCase();
      results = results.filter(p =>
        p.serviceAreas && p.serviceAreas.some(a => a.toLowerCase().includes(qArea))
      );
    }

    if (minRating) {
      results = results.filter(p => p.rating >= Number(minRating));
    }

    if (minTrust) {
      results = results.filter(p => (p.trustScore || 85) >= Number(minTrust));
    }

    if (maxPrice) {
      results = results.filter(p => (p.visitingFee || 149) <= Number(maxPrice));
    }

    // Calculate smart match score & distance & ETA
    const cLat = Number(customerLat);
    const cLng = Number(customerLng);

    let scoredResults = results.map(tech => {
      const techLat = tech.currentLocation?.lat || 13.0827;
      const techLng = tech.currentLocation?.lng || 80.2707;
      const distanceKm = calculateDistance(cLat, cLng, techLat, techLng);

      // Estimated arrival time based on 25km/h city transit + 10 min buffer
      const estimatedArrivalMins = Math.max(12, Math.round((distanceKm / 25) * 60 + 8));

      // Smart match algorithm (100 max)
      // 30% Trust score, 25% Distance closeness, 25% Rating, 20% Experience
      const distanceScore = Math.max(0, 25 - (distanceKm * 1.5));
      const ratingScore = (tech.rating / 5) * 25;
      const trustScorePart = ((tech.trustScore || 85) / 100) * 30;
      const expScore = Math.min(20, (tech.experienceYears || 3) * 3);

      const matchPercentage = Math.round(distanceScore + ratingScore + trustScorePart + expScore);

      // Human-readable smart reasons (Feature B requirement)
      const recommendationReasons = [];
      if (distanceKm <= 4) recommendationReasons.push(`Nearest Pro (${distanceKm} km away)`);
      if (tech.trustScore >= 92) recommendationReasons.push(`Elite Trust Score (${tech.trustScore}/100)`);
      if (tech.rating >= 4.8) recommendationReasons.push(`Top Customer Rating (${tech.rating}★)`);
      if (tech.emergencyAvailable) recommendationReasons.push(`Express 25-min Dispatch Ready`);
      if (tech.trustFactors?.completionRate >= 95) recommendationReasons.push(`${tech.trustFactors.completionRate}% Job Completion Track Record`);

      const specialization = tech.specialization || (tech.skills && tech.skills[0]) || 'Certified Multi-Trade Specialist';
      const category = tech.category || (tech.skills && tech.skills[0]) || 'General Maintenance';

      return {
        ...tech,
        specialization,
        category,
        distanceKm,
        estimatedArrivalMins,
        matchScore: matchPercentage,
        recommendationReasons
      };
    });

    if (maxDistance) {
      scoredResults = scoredResults.filter(p => p.distanceKm <= Number(maxDistance));
    }

    // Sort by requested sorting option
    scoredResults.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'distance':
          return (a.distanceKm || 0) - (b.distanceKm || 0);
        case 'price':
          return (a.visitingFee || 0) - (b.visitingFee || 0);
        case 'trust':
          return (b.trustScore || 0) - (a.trustScore || 0);
        case 'eta':
          return (a.estimatedArrivalMins || 0) - (b.estimatedArrivalMins || 0);
        case 'recommended':
        default:
          return b.matchScore - a.matchScore;
      }
    });

    res.json({
      success: true,
      count: scoredResults.length,
      technicians: scoredResults
    });
  } catch (error) {
    console.error('searchTechnicians error:', error);
    res.status(500).json({ success: false, message: 'Technician search failed.' });
  }
};

exports.getTechnicianById = async (req, res) => {
  try {
    const { id } = req.params;
    const { isDb, TechnicianProfile, Review, mem } = getStore();

    let profile = null;
    let reviews = [];

    if (isDb) {
      profile = await TechnicianProfile.findById(id).populate('userId', 'name email phone avatar').lean();
      if (!profile) {
        // try finding by userId
        profile = await TechnicianProfile.findOne({ userId: id }).populate('userId', 'name email phone avatar').lean();
      }
      if (profile && profile.userId) {
        reviews = await Review.find({ technicianId: profile.userId._id }).populate('customerId', 'name avatar').lean();
      }
    } else {
      profile = mem.technicianProfiles.find(p => p._id.toString() === id.toString() || p.userId.toString() === id.toString());
      if (profile) {
        const u = mem.users.find(usr => usr._id.toString() === profile.userId.toString());
        profile = {
          ...profile,
          userId: u ? { _id: u._id, name: u.name, email: u.email, phone: u.phone, avatar: u.avatar } : profile.userId
        };
        reviews = mem.reviews.filter(r => r.technicianId.toString() === profile.userId._id?.toString());
      }
    }

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Technician not found.' });
    }

    res.json({
      success: true,
      technician: profile,
      reviews
    });
  } catch (error) {
    console.error('getTechnicianById error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch technician profile.' });
  }
};

exports.updateTechnicianStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { isAvailable, emergencyAvailable, currentLocation } = req.body;
    const { isDb, TechnicianProfile, mem } = getStore();

    if (isDb) {
      const updated = await TechnicianProfile.findOneAndUpdate(
        { userId },
        { $set: { isAvailable, emergencyAvailable, ...(currentLocation && { currentLocation }) } },
        { new: true }
      );
      return res.json({ success: true, message: 'Status updated!', profile: updated });
    } else {
      const idx = mem.technicianProfiles.findIndex(p => p.userId.toString() === userId.toString());
      if (idx !== -1) {
        if (typeof isAvailable === 'boolean') mem.technicianProfiles[idx].isAvailable = isAvailable;
        if (typeof emergencyAvailable === 'boolean') mem.technicianProfiles[idx].emergencyAvailable = emergencyAvailable;
        if (currentLocation) mem.technicianProfiles[idx].currentLocation = currentLocation;
        return res.json({ success: true, message: 'Status updated!', profile: mem.technicianProfiles[idx] });
      }
      return res.status(404).json({ success: false, message: 'Technician profile not found.' });
    }
  } catch (error) {
    console.error('updateTechnicianStatus error:', error);
    res.status(500).json({ success: false, message: 'Failed to update technician status.' });
  }
};
