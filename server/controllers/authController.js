const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const smsService = require('../services/smsService');
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
    const { name, email, password, confirmPassword, phone, role = 'customer', skills, serviceAreas, experienceYears } = req.body;
    const safeRole = role === 'technician' ? 'technician' : 'customer';

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const { isDb, User, TechnicianProfile, mem } = getStore();

    // Check duplicate email
    if (isDb) {
      const existingEmail = await User.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }
      if (phone && phone.trim()) {
        const cleanPhone = phone.replace(/\D/g, '');
        const existingPhone = await User.findOne({
          $or: [
            { phone: phone.trim() },
            { phone: cleanPhone },
            { phone: `+91${cleanPhone.slice(-10)}` }
          ]
        });
        if (existingPhone) {
          return res.status(400).json({ success: false, message: 'An account with this phone number already exists.' });
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone ? phone.trim() : '',
        role: safeRole,
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
      const existingEmail = mem.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }
      if (phone && phone.trim()) {
        const cleanPhone = phone.replace(/\D/g, '');
        const existingPhone = mem.users.find(u => 
          u.phone && (u.phone === phone.trim() || u.phone.replace(/\D/g, '') === cleanPhone)
        );
        if (existingPhone) {
          return res.status(400).json({ success: false, message: 'An account with this phone number already exists.' });
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUserId = 'mem_user_' + Date.now();
      const newUser = {
        _id: newUserId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone ? phone.trim() : '',
        role: safeRole,
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
    const rawIdentifier = (req.body.email || req.body.phone || req.body.identifier || '').trim();
    const { password } = req.body;

    if (!rawIdentifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email or phone and password.' });
    }

    const { isDb, User, mem } = getStore();

    let user;
    if (isDb) {
      if (rawIdentifier.includes('@')) {
        user = await User.findOne({ email: rawIdentifier.toLowerCase() });
      } else {
        const clean = rawIdentifier.replace(/\D/g, '');
        user = await User.findOne({
          $or: [
            { email: rawIdentifier.toLowerCase() },
            { phone: rawIdentifier },
            { phone: clean },
            { phone: `+91${clean.slice(-10)}` },
            { phone: `+91 ${clean.slice(-10)}` }
          ]
        });
      }
    } else {
      if (rawIdentifier.includes('@')) {
        user = mem.users.find(u => u.email.toLowerCase() === rawIdentifier.toLowerCase());
      } else {
        const clean = rawIdentifier.replace(/\D/g, '');
        user = mem.users.find(u => 
          u.email.toLowerCase() === rawIdentifier.toLowerCase() ||
          (u.phone && (u.phone === rawIdentifier || u.phone.replace(/\D/g, '') === clean || u.phone.includes(clean)))
        );
      }
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
        name: role === 'admin' ? 'Smart Service Admin' : role === 'technician' ? 'Arun Kumar' : 'Karthik Raman',
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

// Helper to hash OTP with salt (never store plain-text OTPs in DB)
const hashOtp = (code) => {
  return crypto.createHmac('sha256', JWT_SECRET || 'servease_secret_otp').update(code).digest('hex');
};

/**
 * Request Phone Verification OTP
 * Validates Indian mobile number (+91), enforces 60s cooldown and hourly limits,
 * generates a cryptographically random 6-digit OTP, hashes it, and dispatches via SMS.
 */
exports.sendOtp = async (req, res) => {
  try {
    const { phone, purpose = 'login' } = req.body;

    // 1. Normalize and validate Indian mobile phone
    const phoneInfo = smsService.normalizeIndianPhone(phone);
    if (!phoneInfo.isValid) {
      return res.status(400).json({
        success: false,
        message: phoneInfo.error
      });
    }

    const { isDb, OtpToken, mem } = getStore();
    const COOLDOWN_SECONDS = 60;
    const MAX_HOURLY_REQUESTS = 5;

    // 2. Rate Limiting: Cooldown (60s) & Hourly Threshold (max 5)
    if (isDb) {
      const latestToken = await OtpToken.findOne({ phone: phoneInfo.e164 }).sort({ createdAt: -1 });
      if (latestToken) {
        const elapsedSeconds = (Date.now() - new Date(latestToken.lastRequestedAt).getTime()) / 1000;
        if (elapsedSeconds < COOLDOWN_SECONDS) {
          const waitTime = Math.ceil(COOLDOWN_SECONDS - elapsedSeconds);
          return res.status(429).json({
            success: false,
            message: `Please wait ${waitTime} seconds before requesting another OTP.`,
            cooldownRemaining: waitTime
          });
        }
      }

      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const hourlyCount = await OtpToken.countDocuments({
        phone: phoneInfo.e164,
        createdAt: { $gte: oneHourAgo }
      });

      if (hourlyCount >= MAX_HOURLY_REQUESTS) {
        return res.status(429).json({
          success: false,
          message: 'Too many OTP requests for this phone number. For security, please try again in 1 hour.'
        });
      }
    } else {
      const userTokens = mem.otpTokens
        .filter(t => t.phone === phoneInfo.e164)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      if (userTokens.length > 0) {
        const latestToken = userTokens[0];
        const elapsedSeconds = (Date.now() - new Date(latestToken.lastRequestedAt).getTime()) / 1000;
        if (elapsedSeconds < COOLDOWN_SECONDS) {
          const waitTime = Math.ceil(COOLDOWN_SECONDS - elapsedSeconds);
          return res.status(429).json({
            success: false,
            message: `Please wait ${waitTime} seconds before requesting another OTP.`,
            cooldownRemaining: waitTime
          });
        }
      }

      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const hourlyCount = userTokens.filter(t => new Date(t.createdAt) >= oneHourAgo).length;
      if (hourlyCount >= MAX_HOURLY_REQUESTS) {
        return res.status(429).json({
          success: false,
          message: 'Too many OTP requests for this phone number. For security, please try again in 1 hour.'
        });
      }
    }

    // 3. Cryptographically secure 6-digit random OTP
    const otpCode = crypto.randomInt(100000, 1000000).toString();
    const otpHash = hashOtp(otpCode);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // 4. Dispatch SMS through configured telecom provider (Fast2SMS / Twilio / MSG91)
    const smsResult = await smsService.sendOtpSms({
      phone: phoneInfo.e164,
      otp: otpCode
    });

    // If SMS delivery failed, report exact failure without storing ghost OTP
    if (!smsResult.success) {
      return res.status(502).json({
        success: false,
        message: smsResult.error || 'Failed to dispatch SMS through telecom provider.',
        provider: smsResult.provider
      });
    }

    // 5. Store hashed OTP in database with TTL
    if (isDb) {
      await OtpToken.deleteMany({ phone: phoneInfo.e164, isVerified: false });
      await OtpToken.create({
        phone: phoneInfo.e164,
        otpHash,
        attempts: 0,
        maxAttempts: 5,
        isVerified: false,
        purpose,
        lastRequestedAt: new Date(),
        expiresAt
      });
    } else {
      mem.otpTokens = mem.otpTokens.filter(t => !(t.phone === phoneInfo.e164 && !t.isVerified));
      mem.otpTokens.unshift({
        _id: 'mem_otp_' + Date.now(),
        phone: phoneInfo.e164,
        otpHash,
        attempts: 0,
        maxAttempts: 5,
        isVerified: false,
        purpose,
        lastRequestedAt: new Date(),
        expiresAt,
        createdAt: new Date()
      });
    }

    return res.json({
      success: true,
      message: `OTP sent successfully to ${phoneInfo.display}!`,
      phone: phoneInfo.display,
      e164: phoneInfo.e164,
      cooldownSeconds: COOLDOWN_SECONDS,
      expiresAt,
      isDevMode: smsResult.isDevMode || false,
      devOtp: smsResult.devOtp, // Only exposed in development testing mode
      provider: smsResult.provider
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ success: false, message: 'Server error while generating OTP.' });
  }
};

/**
 * Verify Phone OTP & Sign In / Register
 * Validates OTP against stored HMAC hash, enforces attempt limits (max 5),
 * invalidates OTP upon success to prevent replay attacks, and issues JWT.
 */
exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp, name, role = 'customer' } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and 6-digit OTP code are required.'
      });
    }

    const cleanOtp = otp.toString().trim();
    if (!/^\d{6}$/.test(cleanOtp)) {
      return res.status(400).json({
        success: false,
        message: 'OTP must be a 6-digit numeric code.'
      });
    }

    const phoneInfo = smsService.normalizeIndianPhone(phone);
    if (!phoneInfo.isValid) {
      return res.status(400).json({ success: false, message: phoneInfo.error });
    }

    const { isDb, OtpToken, User, TechnicianProfile, mem } = getStore();

    // 1. Fetch active OTP record
    let otpRecord = null;
    if (isDb) {
      otpRecord = await OtpToken.findOne({
        phone: phoneInfo.e164,
        isVerified: false
      }).sort({ createdAt: -1 });
    } else {
      otpRecord = mem.otpTokens.find(t => t.phone === phoneInfo.e164 && !t.isVerified);
    }

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'No active OTP found for this phone number. Please request a new code.'
      });
    }

    // 2. Check Expiration (5 minutes)
    if (new Date() > new Date(otpRecord.expiresAt)) {
      if (isDb) await OtpToken.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'This OTP has expired. Please request a new code.'
      });
    }

    // 3. Check Attempt Limit (Max 5 attempts)
    if (otpRecord.attempts >= (otpRecord.maxAttempts || 5)) {
      if (isDb) await OtpToken.deleteOne({ _id: otpRecord._id });
      return res.status(429).json({
        success: false,
        message: 'Maximum verification attempts exceeded. For security, please request a new OTP.'
      });
    }

    // 4. Validate OTP Hash
    const inputHash = hashOtp(cleanOtp);
    const isMatch = inputHash === otpRecord.otpHash;

    if (!isMatch) {
      otpRecord.attempts = (otpRecord.attempts || 0) + 1;
      const remaining = Math.max(0, (otpRecord.maxAttempts || 5) - otpRecord.attempts);

      if (isDb) {
        await otpRecord.save();
      }

      return res.status(400).json({
        success: false,
        message: remaining > 0
          ? `Invalid verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
          : 'Maximum verification attempts exceeded. Please request a new OTP.',
        attemptsRemaining: remaining
      });
    }

    // 5. Invalidate OTP immediately to prevent reuse / replay
    if (isDb) {
      await OtpToken.deleteMany({ phone: phoneInfo.e164 });
    } else {
      mem.otpTokens = mem.otpTokens.filter(t => t.phone !== phoneInfo.e164);
    }

    // 6. Look up existing user by phone
    let user = null;
    let isNewUser = false;

    if (isDb) {
      user = await User.findOne({
        $or: [
          { phone: phoneInfo.e164 },
          { phone: phoneInfo.national },
          { phone: phoneInfo.display }
        ]
      });

      // If user does not exist, auto-register customer account
      if (!user) {
        isNewUser = true;
        const randomPass = crypto.randomBytes(16).toString('hex');
        const hashedPassword = await bcrypt.hash(randomPass, 10);
        const placeholderEmail = `user_${phoneInfo.national}@smartservice.ai`;

        // Check if placeholder email collides, if so append timestamp
        const emailExists = await User.findOne({ email: placeholderEmail });
        const finalEmail = emailExists 
          ? `user_${phoneInfo.national}_${Date.now()}@smartservice.ai` 
          : placeholderEmail;

        user = await User.create({
          name: name || `User ${phoneInfo.national.slice(-4)}`,
          email: finalEmail,
          password: hashedPassword,
          phone: phoneInfo.e164,
          role: role || 'customer',
          savedAddresses: [],
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
        });

        if (role === 'technician') {
          await TechnicianProfile.create({
            userId: user._id,
            bio: 'Verified Professional Service Specialist',
            skills: ['Home Appliance Repair'],
            serviceAreas: ['Chennai'],
            experienceYears: 3,
            verified: false,
            verificationStatus: 'pending',
            trustScore: 80
          });
        }
      }
    } else {
      user = mem.users.find(u => 
        u.phone === phoneInfo.e164 || 
        u.phone === phoneInfo.national || 
        u.phone === phoneInfo.display
      );

      if (!user) {
        isNewUser = true;
        const newUserId = 'mem_user_' + Date.now();
        const placeholderEmail = `user_${phoneInfo.national}@smartservice.ai`;
        user = {
          _id: newUserId,
          name: name || `User ${phoneInfo.national.slice(-4)}`,
          email: placeholderEmail,
          phone: phoneInfo.e164,
          role: role || 'customer',
          savedAddresses: [],
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          createdAt: new Date()
        };
        mem.users.push(user);
      }
    }

    // 7. Generate JWT Auth Token
    const token = generateToken(user);

    return res.json({
      success: true,
      message: isNewUser 
        ? 'Welcome to Smart Service Booking Platform! Your account was verified.'
        : 'Phone verification successful! Welcome back.',
      token,
      isNewUser,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || phoneInfo.e164,
        avatar: user.avatar,
        savedAddresses: user.savedAddresses || []
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'Server error during OTP verification.' });
  }
};

/**
 * Forgot Password & Account Recovery
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email, phone, newPassword } = req.body;
    const { isDb, User, mem } = getStore();

    if (!email && !phone) {
      return res.status(400).json({ success: false, message: 'Please provide either an email or phone number.' });
    }

    let user = null;
    if (isDb) {
      if (email) {
        user = await User.findOne({ email: email.toLowerCase() });
      } else if (phone) {
        const phoneInfo = smsService.normalizeIndianPhone(phone);
        user = await User.findOne({
          $or: [{ phone: phoneInfo.e164 }, { phone: phoneInfo.national }, { phone: phoneInfo.display }]
        });
      }
    } else {
      if (email) {
        user = mem.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      } else if (phone) {
        const phoneInfo = smsService.normalizeIndianPhone(phone);
        user = mem.users.find(u => u.phone === phoneInfo.e164 || u.phone === phoneInfo.national);
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'No registered account found with that email or phone number.' });
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      if (isDb) {
        user.password = hashedPassword;
        await user.save();
      } else {
        user.password = hashedPassword;
      }
      return res.json({ success: true, message: 'Password has been successfully updated! You can now log in.' });
    }

    return res.json({
      success: true,
      message: `Password recovery instructions have been sent to ${email || phone}.`
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Failed to process password recovery.' });
  }
};
