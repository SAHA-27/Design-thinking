/**
 * SMS Provider Service for Smart Service Booking Platform
 * 
 * Supports:
 * - Indian Mobile Phone number (+91) normalization and validation
 * - Fast2SMS (Indian SMS Gateway with DLT & Quick SMS support)
 * - Twilio (Global SMS Gateway)
 * - MSG91 (Enterprise Indian SMS Gateway)
 * - Development / Testing Simulator (Clean console logging with clear developer indicators)
 */

/**
 * Normalizes and validates Indian mobile phone numbers.
 * Converts '98401 23456', '09840123456', '+91 9840123456' into standard formats.
 */
function normalizeIndianPhone(inputPhone) {
  if (!inputPhone || typeof inputPhone !== 'string') {
    return {
      isValid: false,
      error: 'Phone number is required.'
    };
  }

  // Remove spaces, hyphens, brackets, dots
  let cleaned = inputPhone.replace(/[\s\-\(\)\.]/g, '').trim();

  // Handle +91 or 91 prefix
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.substring(1);
  }

  // Check 10-digit Indian mobile number format: must start with 6, 7, 8, or 9
  const indianMobileRegex = /^[6-9]\d{9}$/;
  if (!indianMobileRegex.test(cleaned)) {
    return {
      isValid: false,
      error: 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.',
      rawInput: inputPhone
    };
  }

  return {
    isValid: true,
    national: cleaned,                  // '9840123456'
    e164: `+91${cleaned}`,              // '+919840123456'
    display: `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
  };
}

/**
 * Dispatches OTP via Fast2SMS (Indian Gateway)
 */
async function sendViaFast2SMS({ nationalPhone, otp }) {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    throw new Error('FAST2SMS_API_KEY is not configured in environment variables.');
  }

  const endpoint = 'https://www.fast2sms.com/dev/bulkV2';
  
  const payload = {
    route: 'otp',
    variables_values: otp,
    numbers: nationalPhone
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'authorization': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || (data && data.return === false)) {
    const errorDetail = data.message || `Fast2SMS HTTP status ${response.status}`;
    console.error('Fast2SMS Error Response:', data);
    throw new Error(`Fast2SMS delivery failed: ${errorDetail}`);
  }

  return {
    success: true,
    provider: 'fast2sms',
    messageId: data.request_id || `f2s_${Date.now()}`
  };
}

/**
 * Dispatches OTP via Twilio
 */
async function sendViaTwilio({ e164Phone, otp }) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('Twilio credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER) are missing.');
  }

  const messageBody = `Your Smart Service verification code is ${otp}. Valid for 5 minutes. Do not share this OTP with anyone.`;
  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  const params = new URLSearchParams();
  params.append('To', e164Phone);
  params.append('From', fromNumber);
  params.append('Body', messageBody);

  const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const code = data.code || response.status;
    let message = data.message || `Twilio error code ${code}`;

    // Common Twilio error explanations for Indian numbers
    if (code === 21608) {
      message = 'Twilio Trial Account: This recipient number is unverified in your Twilio console. Please verify it or upgrade to a full account.';
    } else if (code === 21211) {
      message = 'Invalid phone number format provided to Twilio.';
    } else if (code === 20003) {
      message = 'Twilio Authentication failed. Check your TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.';
    }

    console.error('Twilio Error:', data);
    throw new Error(message);
  }

  return {
    success: true,
    provider: 'twilio',
    messageId: data.sid
  };
}

/**
 * Dispatches OTP via MSG91 (Indian Gateway)
 */
async function sendViaMSG91({ nationalPhone, otp }) {
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;

  if (!authKey || !templateId) {
    throw new Error('MSG91_AUTH_KEY or MSG91_TEMPLATE_ID is missing.');
  }

  const endpoint = `https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=91${nationalPhone}&authkey=${authKey}&otp=${otp}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || (data && data.type === 'error')) {
    const errorDetail = data.message || `MSG91 status ${response.status}`;
    console.error('MSG91 Error:', data);
    throw new Error(`MSG91 delivery failed: ${errorDetail}`);
  }

  return {
    success: true,
    provider: 'msg91',
    messageId: data.message || `msg91_${Date.now()}`
  };
}

/**
 * Main function: Send OTP SMS to user's phone number
 */
async function sendOtpSms({ phone, otp }) {
  // 1. Normalize and validate Indian mobile phone
  const phoneInfo = normalizeIndianPhone(phone);
  if (!phoneInfo.isValid) {
    return {
      success: false,
      error: phoneInfo.error
    };
  }

  const configuredProvider = (process.env.SMS_PROVIDER || '').toLowerCase();
  const isProduction = process.env.NODE_ENV === 'production';

  // 2. Determine actual provider to use
  let activeProvider = configuredProvider;
  if (!activeProvider) {
    if (process.env.FAST2SMS_API_KEY) activeProvider = 'fast2sms';
    else if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) activeProvider = 'twilio';
    else if (process.env.MSG91_AUTH_KEY) activeProvider = 'msg91';
    else activeProvider = 'development';
  }

  // 3. Dispatch through chosen provider
  try {
    if (activeProvider === 'fast2sms') {
      const res = await sendViaFast2SMS({ nationalPhone: phoneInfo.national, otp });
      return { ...res, phoneInfo };
    }

    if (activeProvider === 'twilio') {
      const res = await sendViaTwilio({ e164Phone: phoneInfo.e164, otp });
      return { ...res, phoneInfo };
    }

    if (activeProvider === 'msg91') {
      const res = await sendViaMSG91({ nationalPhone: phoneInfo.national, otp });
      return { ...res, phoneInfo };
    }

    // 4. Development Simulator Mode
    if (activeProvider === 'development' || !isProduction) {
      console.log('\n=============================================================');
      console.log('📱 [DEVELOPMENT SMS GATEWAY] Outgoing OTP Dispatched');
      console.log(`📞 Recipient:   ${phoneInfo.display} (${phoneInfo.e164})`);
      console.log(`🔑 OTP Code:    ${otp}`);
      console.log(`⏱️ Expiry:      5 minutes`);
      console.log(`💬 Message:     "Your Smart Service verification code is ${otp}. Valid for 5 minutes."`);
      console.log('ℹ️ Mode:        Development mode (set SMS_PROVIDER & credentials in .env for live telecom delivery)');
      console.log('=============================================================\n');

      return {
        success: true,
        isDevMode: true,
        provider: 'development',
        phoneInfo,
        // Expose devOtp only when not in production so frontend developer can test without barriers
        devOtp: isProduction ? undefined : otp,
        message: 'OTP dispatched in development test mode. Code displayed on server console and testing UI.'
      };
    }

    // If production and no provider configured:
    return {
      success: false,
      error: 'No SMS provider configured on production server. Please configure FAST2SMS_API_KEY or TWILIO credentials in .env.'
    };

  } catch (err) {
    console.error(`SMS Delivery Failed via ${activeProvider}:`, err.message);
    return {
      success: false,
      provider: activeProvider,
      error: err.message || 'SMS delivery failed at gateway.'
    };
  }
}

module.exports = {
  normalizeIndianPhone,
  sendOtpSms
};
