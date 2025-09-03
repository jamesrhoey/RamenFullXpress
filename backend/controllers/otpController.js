const OTP = require('../models/otp');
const philsmsService = require('../services/philsmsService');
const Customer = require('../models/customer');
const { generateCustomerToken } = require('../middleware/customerAuthMiddleware');

// Generate and send OTP
exports.generateOTP = async (req, res) => {
  try {
    const { phone, purpose = 'phone_verification' } = req.body;

    // Validate input
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }

    // Validate purpose
    const validPurposes = ['phone_verification', 'password_reset', 'order_update'];
    if (!validPurposes.includes(purpose)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid purpose. Must be one of: ' + validPurposes.join(', ')
      });
    }

    // Check if customer exists for phone verification purpose
    if (purpose === 'phone_verification') {
      const existingCustomer = await Customer.findOne({ phone });
      if (!existingCustomer) {
        return res.status(404).json({
          success: false,
          message: 'Customer with this phone number does not exist'
        });
      }
    }

    // Invalidate any existing OTPs for this phone and purpose
    await OTP.updateMany(
      { phone, purpose, isUsed: false },
      { isUsed: true }
    );

    // Generate OTP
    const otpCode = OTP.generateOTP();
    const otpRecord = new OTP({
      phone,
      otp: otpCode,
      purpose
    });
    await otpRecord.save();

    // Send OTP via SMS
    const smsResult = await philsmsService.sendOTP(phone, otpCode, purpose);

    if (!smsResult.success) {
      // If SMS fails, delete the OTP record
      await OTP.findByIdAndDelete(otpRecord._id);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP SMS',
        error: smsResult.error
      });
    }

    console.log(`✅ OTP generated and sent to ${phone} for ${purpose}`);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        phone,
        purpose,
        expiresIn: '10 minutes'
      }
    });

  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp, purpose = 'phone_verification' } = req.body;

    // Validate input
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required'
      });
    }

    // Find and validate OTP record
    const otpRecord = await OTP.findOne({
      phone,
      otp,
      purpose,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Check if OTP is still valid (not exceeded max attempts)
    if (!otpRecord.isValid()) {
      await otpRecord.incrementAttempts();
      return res.status(400).json({
        success: false,
        message: 'OTP has expired or exceeded maximum attempts'
      });
    }

    // Mark OTP as used
    await otpRecord.markAsUsed();

    console.log(`✅ OTP verified successfully for ${phone} (${purpose})`);

    // For phone verification, also update customer status
    if (purpose === 'phone_verification') {
      const customer = await Customer.findOne({ phone });
      if (customer) {
        customer.isPhoneVerified = true;
        await customer.save();

        // Generate JWT token for immediate login
        const token = generateCustomerToken(customer._id, customer.phone);

        return res.status(200).json({
          success: true,
          message: 'OTP verified successfully',
          data: {
            phone,
            purpose,
            verified: true,
            customer: {
              id: customer._id,
              firstName: customer.firstName,
              lastName: customer.lastName,
              phone: customer.phone,
              isPhoneVerified: true
            },
            token
          }
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        phone,
        purpose,
        verified: true
      }
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const { phone, purpose = 'phone_verification' } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Check if there's a recent OTP request (within last 1 minute)
    const recentOTP = await OTP.findOne({
      phone,
      purpose,
      createdAt: { $gte: new Date(Date.now() - 60 * 1000) } // 1 minute ago
    });

    if (recentOTP) {
      return res.status(429).json({
        success: false,
        message: 'Please wait before requesting another OTP'
      });
    }

    // Call generateOTP function
    req.body = { phone, purpose };
    return await exports.generateOTP(req, res);

  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get OTP status
exports.getOTPStatus = async (req, res) => {
  try {
    const { phone, purpose } = req.query;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    const query = { phone };
    if (purpose) {
      query.purpose = purpose;
    }

    const otpRecords = await OTP.find(query)
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        phone,
        purpose: purpose || 'all',
        otpRecords: otpRecords.map(record => ({
          id: record._id,
          purpose: record.purpose,
          isUsed: record.isUsed,
          attempts: record.attempts,
          createdAt: record.createdAt,
          expiresAt: record.expiresAt,
          isValid: record.isValid()
        }))
      }
    });

  } catch (error) {
    console.error('Error getting OTP status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Test SMS service
exports.testSMSService = async (req, res) => {
  try {
    console.log('📱 Testing SMS service connection...');
    
    const result = await philsmsService.verifyConnection();
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          service: result.service,
          balance: result.balance
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Error testing SMS service:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

// Send test SMS
exports.sendTestSMS = async (req, res) => {
  try {
    const { phone, message } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    const testMessage = message || 'This is a test SMS from RamenXpress. Your SMS service is working correctly!';
    
    console.log(`📱 Sending test SMS to ${phone}...`);
    
    const result = await philsmsService.sendSMS(phone, testMessage);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Test SMS sent successfully',
        data: {
          phone,
          messageId: result.messageId,
          message: result.message
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send test SMS',
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Error sending test SMS:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};