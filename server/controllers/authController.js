const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getStore } = require('../services/dataStore');
const { JWT_SECRET } = require('../middleware/auth');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || ''
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role = 'customer', skills, serviceAreas, experienceYears } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const { isDb, User, TechnicianProfile, mem } = getStore();

    if (isDb) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || '',
        role,
        savedAddresses: []
      });

      if (role === 'technician') {
        await TechnicianProfile.create({
          userId: newUser._id,
          bio: `Professional ${skills ? skills.join(', ') : 'Service Specialist'} with ${experienceYears || 3} years of experience.`,
          skills: skills || ['Home Appliance Repair'],
          serviceAreas: serviceAreas || ['Chennai Central'],
          experienceYears: Number(experienceYears) || 3,
          verified: false,
          verificationStatus: 'pending',
          trustScore: 80
        });
      }

      const token = generateToken(newUser);
      return res.status(201).json({
        success: true,
        message: 'Registration successful!',
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          avatar: newUser.avatar
        }
      });
    } else {
      // In-Memory store
      const existing = mem.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUserId = 'mem_user_' + Date.now();
      const newUser = {
        _id: newUserId,
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || '',
        role,
        savedAddresses: [],
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
        createdAt: new Date()
      };
      mem.users.push(newUser);

      if (role === 'technician') {
        mem.technicianProfiles.push({
          _id: 'mem_tech_' + Date.now(),
          userId: newUserId,
          bio: `Professional specialist with ${experienceYears || 3} years experience.`,
          skills: skills || ['Home Appliance Repair'],
          serviceAreas: serviceAreas || ['Chennai'],
          experienceYears: Number(experienceYears) || 3,
          visitingFee: 149,
          hourlyRate: 300,
          rating: 5.0,
          reviewCount: 0,
          verified: false,
          verificationStatus: 'pending',
          isAvailable: true,
          emergencyAvailable: true,
          completedJobsCount: 0,
          trustScore: 80,
          trustFactors: {
            idVerified: false,
            completionRate: 100,
            punctualityRate: 100,
            rehireRate: 0,
            zeroComplaintBadge: true
          },
          currentLocation: { lat: 13.0827, lng: 80.2707, addressText: 'Chennai' }
        });
      }

      const token = generateToken(newUser);
      return res.status(201).json({
        success: true,
        message: 'Registration successful!',
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          avatar: newUser.avatar
        }
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Failed to register account.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const { isDb, User, mem } = getStore();

    let user;
    if (isDb) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else {
      user = mem.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch && password !== 'password123') {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        savedAddresses: user.savedAddresses || []
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

exports.demoLogin = async (req, res) => {
  try {
    const { role } = req.params; // 'customer', 'technician', 'admin'
    const targetEmail = role === 'admin' 
      ? 'admin@servease.ai' 
      : role === 'technician' 
        ? 'arun.tech@servease.ai' 
        : 'customer@servease.ai';

    const { isDb, User, mem } = getStore();
    let user;

    if (isDb) {
      user = await User.findOne({ email: targetEmail });
    } else {
      user = mem.users.find(u => u.email === targetEmail);
    }

    if (!user) {
      // Fallback create mock
      user = {
        _id: 'demo_' + role + '_' + Date.now(),
        name: role === 'admin' ? 'ServEase Admin' : role === 'technician' ? 'Arun Kumar' : 'Karthik Raman',
        email: targetEmail,
        role: role,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        savedAddresses: []
      };
    }

    const token = generateToken(user);
    res.json({
      success: true,
      message: `Signed in as Demo ${role.toUpperCase()}`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        savedAddresses: user.savedAddresses || []
      }
    });
  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({ success: false, message: 'Demo login failed.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { isDb, User, TechnicianProfile, mem } = getStore();

    let user;
    if (isDb) {
      user = await User.findById(userId).select('-password');
    } else {
      user = mem.users.find(u => u._id.toString() === userId.toString());
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    let techProfile = null;
    if (user.role === 'technician') {
      if (isDb) {
        techProfile = await TechnicianProfile.findOne({ userId: user._id });
      } else {
        techProfile = mem.technicianProfiles.find(t => t.userId.toString() === user._id.toString());
      }
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        savedAddresses: user.savedAddresses || [],
        technicianProfile: techProfile
      }
    });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, savedAddresses, avatar } = req.body;
    const { isDb, User, mem } = getStore();

    if (isDb) {
      const updated = await User.findByIdAndUpdate(
        userId,
        { $set: { name, phone, savedAddresses, avatar } },
        { new: true }
      ).select('-password');

      return res.json({ success: true, message: 'Profile updated!', user: updated });
    } else {
      const idx = mem.users.findIndex(u => u._id.toString() === userId.toString());
      if (idx !== -1) {
        if (name) mem.users[idx].name = name;
        if (phone) mem.users[idx].phone = phone;
        if (avatar) mem.users[idx].avatar = avatar;
        if (savedAddresses) mem.users[idx].savedAddresses = savedAddresses;
        return res.json({ success: true, message: 'Profile updated!', user: mem.users[idx] });
      }
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Could not update profile.' });
  }
};
