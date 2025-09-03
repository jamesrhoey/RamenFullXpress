const Customer = require('../models/customer');
const { validatePassword, hashPassword, comparePassword, generateCustomerToken } = require('../middleware/customerAuthMiddleware');
const OTP = require('../models/otp');
const googleAuthService = require('../services/googleAuthService');
const emailService = require('../services/emailService');

// PhilSMS service for SMS sending
const philsmsService = require('../services/philsmsService');

// Email registration
exports.registerWithEmail = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, email, and password are required'
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message
      });
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ 
      $or: [{ email }, { googleEmail: email }] 
    });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate email verification token
    const emailVerificationToken = emailService.generateVerificationToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new customer with email verification pending
    const customer = new Customer({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      authMethod: 'email',
      isEmailVerified: false,
      emailVerificationToken,
      emailVerificationExpires
    });

    await customer.save();

    // Send verification email
    const emailResult = await emailService.sendVerificationEmail(
      email, 
      firstName, 
      emailVerificationToken
    );

    if (!emailResult.success) {
      // If email fails, delete the customer
      await Customer.findByIdAndDelete(customer._id);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.',
        error: emailResult.error
      });
    }

    console.log(`✅ Customer registered with email and verification email sent to ${email}`);

    res.status(201).json({
      success: true,
      message: 'Customer registered successfully. Please check your email to verify your account.',
      data: {
        customer: {
          id: customer._id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          fullName: customer.fullName,
          email: customer.email,
          authMethod: customer.authMethod,
          isEmailVerified: false
        },
        verificationEmailSent: true
      }
    });

  } catch (error) {
    console.error('Error registering customer with email:', error);
    
    // Handle duplicate email error
    if (error.code === 11000 && error.keyPattern.email) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Email login
exports.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find customer by email
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, customer.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if email is verified
    if (!customer.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in. Check your email for verification link.',
        requiresEmailVerification: true,
        email: customer.email
      });
    }

    // Generate JWT token
    const token = generateCustomerToken(customer._id, customer.email);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        customer: {
          id: customer._id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          fullName: customer.fullName,
          email: customer.email,
          authMethod: customer.authMethod,
          isEmailVerified: customer.isEmailVerified
        },
        token
      }
    });

  } catch (error) {
    console.error('Error logging in customer with email:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Google sign-in
exports.googleSignIn = async (req, res) => {
  try {
    const { googleToken } = req.body;

    if (!googleToken) {
      return res.status(400).json({
        success: false,
        message: 'Google token is required'
      });
    }

    // Verify Google token
    const googleResult = await googleAuthService.verifyGoogleToken(googleToken);
    if (!googleResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google token'
      });
    }

    const { googleId, email, firstName, lastName, emailVerified } = googleResult.data;

    // Check if customer already exists
    let customer = await Customer.findOne({ 
      $or: [{ googleId }, { email }, { googleEmail: email }] 
    });

    if (customer) {
      // Update existing customer with Google info if needed
      if (!customer.googleId) {
        customer.googleId = googleId;
        customer.googleEmail = email;
        customer.authMethod = 'google';
        customer.isEmailVerified = emailVerified;
        customer.isPhoneVerified = true; // Google users are considered verified
        await customer.save();
      }
    } else {
      // Create new customer
      customer = new Customer({
        firstName,
        lastName,
        googleId,
        googleEmail: email,
        email: email, // Also store in main email field for consistency
        authMethod: 'google',
        isEmailVerified: emailVerified,
        isPhoneVerified: true // Google users are considered verified
      });

      await customer.save();
    }

    // Generate JWT token
    const token = generateCustomerToken(customer._id, customer.email || customer.googleEmail);

    console.log(`✅ Google sign-in successful for: ${customer.fullName}`);

    res.json({
      success: true,
      message: 'Google sign-in successful',
      data: {
        customer: {
          id: customer._id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          fullName: customer.fullName,
          email: customer.email || customer.googleEmail,
          authMethod: customer.authMethod,
          isEmailVerified: customer.isEmailVerified,
          isPhoneVerified: customer.isPhoneVerified
        },
        token
      }
    });

  } catch (error) {
    console.error('Error with Google sign-in:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // Find customer with valid token
    const customer = await Customer.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Check if email is already verified
    if (customer.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Update customer verification status
    customer.isEmailVerified = true;
    customer.emailVerificationToken = undefined;
    customer.emailVerificationExpires = undefined;
    await customer.save();

    console.log(`✅ Email verified for customer: ${customer.fullName}`);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        customer: {
          id: customer._id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          fullName: customer.fullName,
          email: customer.email,
          authMethod: customer.authMethod,
          isEmailVerified: customer.isEmailVerified
        }
      }
    });

  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Resend email verification
exports.resendEmailVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find customer by email
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Check if email is already verified
    if (customer.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Rate limiting: Check if verification email was sent recently
    if (customer.emailVerificationExpires && 
        customer.emailVerificationExpires > new Date(Date.now() - 60 * 1000)) {
      return res.status(429).json({
        success: false,
        message: 'Please wait before requesting another verification email'
      });
    }

    // Generate new verification token
    const emailVerificationToken = emailService.generateVerificationToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update customer with new token
    customer.emailVerificationToken = emailVerificationToken;
    customer.emailVerificationExpires = emailVerificationExpires;
    await customer.save();

    // Send verification email
    const emailResult = await emailService.sendVerificationEmail(
      email, 
      customer.firstName, 
      emailVerificationToken
    );

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.',
        error: emailResult.error
      });
    }

    console.log(`✅ Email verification resent to ${email}`);

    res.status(200).json({
      success: true,
      message: 'Email verification sent successfully. Please check your email.',
      data: {
        email,
        expiresIn: '24 hours'
      }
    });

  } catch (error) {
    console.error('Error resending email verification:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Customer registration (phone-based)
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, phone, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, phone number, and password are required'
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message
      });
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ phone });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this phone number already exists'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new customer with phone verification pending
    const customer = new Customer({
      firstName,
      lastName,
      phone,
      password: hashedPassword,
      authMethod: 'phone',
      isPhoneVerified: false
    });

    await customer.save();

    // Generate and send OTP for phone verification
    const otpCode = OTP.generateOTP();
    
    // Invalidate any existing OTPs for this phone
    await OTP.updateMany(
      { phone: phone, purpose: 'phone_verification', isUsed: false },
      { isUsed: true }
    );

    // Create new OTP record
    const otpRecord = new OTP({
      phone: phone,
      otp: otpCode,
      purpose: 'phone_verification'
    });
    await otpRecord.save();

    // Send verification SMS via PhilSMS
    const smsResult = await philsmsService.sendOTP(phone, otpCode, 'registration');
    
    if (!smsResult.success) {
      // If SMS fails, delete the customer and OTP record
      await Customer.findByIdAndDelete(customer._id);
      await OTP.findByIdAndDelete(otpRecord._id);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification SMS. Please try again.',
        error: smsResult.error
      });
    }

    console.log(`✅ Customer registered and verification SMS sent to ${phone}`);

    res.status(201).json({
      success: true,
      message: 'Customer registered successfully. Please check your SMS to verify your phone number.',
      data: {
        customer: {
          id: customer._id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          fullName: customer.fullName,
          phone: customer.phone,
          authMethod: customer.authMethod,
          isPhoneVerified: false
        },
        verificationSMSSent: true
      }
    });

  } catch (error) {
    console.error('Error registering customer:', error);
    
    // Handle duplicate phone error
    if (error.code === 11000 && error.keyPattern.phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Customer login
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Validate required fields
    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and password are required'
      });
    }

    // Find customer by phone
    const customer = await Customer.findOne({ phone });
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, customer.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }

    // Check if phone is verified
    if (!customer.isPhoneVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your phone number before logging in. Check your SMS for verification code.',
        requiresPhoneVerification: true,
        phone: customer.phone
      });
    }

    // Generate JWT token
    const token = generateCustomerToken(customer._id, customer.phone);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        customer: {
          id: customer._id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          fullName: customer.fullName,
          phone: customer.phone,
          authMethod: customer.authMethod,
          isPhoneVerified: customer.isPhoneVerified
        },
        token
      }
    });

  } catch (error) {
    console.error('Error logging in customer:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get customer profile
exports.getProfile = async (req, res) => {
  try {
    const customerId = req.customerId;

    const customer = await Customer.findById(customerId).select('-password');
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: customer._id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        fullName: customer.fullName,
        email: customer.email || customer.googleEmail,
        phone: customer.phone,
        authMethod: customer.authMethod,
        isEmailVerified: customer.isEmailVerified,
        isPhoneVerified: customer.isPhoneVerified
      }
    });

  } catch (error) {
    console.error('Error fetching customer profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update customer profile
exports.updateProfile = async (req, res) => {
  try {
    const customerId = req.customerId;
    const { firstName, lastName, phone, email } = req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (email) updateData.email = email;

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: customer._id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        fullName: customer.fullName,
        email: customer.email || customer.googleEmail,
        phone: customer.phone,
        authMethod: customer.authMethod,
        isEmailVerified: customer.isEmailVerified,
        isPhoneVerified: customer.isPhoneVerified
      }
    });

  } catch (error) {
    console.error('Error updating customer profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const customerId = req.customerId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Check if customer has a password (Google users might not have one)
    if (!customer.password) {
      return res.status(400).json({
        success: false,
        message: 'Password change not available for Google-authenticated accounts'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(currentPassword, customer.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message
      });
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    customer.password = hashedNewPassword;
    await customer.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}; 

// Get customer's own orders
exports.getMyOrders = async (req, res) => {
  try {
    const customerId = req.customerId;
    const MobileOrder = require('../models/mobileOrder');
    console.log('🔍 Fetching orders for customerId:', customerId);
    const orders = await MobileOrder.find({ customerId }).sort({ createdAt: -1 });
    console.log('📦 Orders found:', orders.length, orders);
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Create customer's own order
exports.createMyOrder = async (req, res) => {
  try {
    const customerId = req.customerId;
    const customer = req.customer;
    const { items, deliveryMethod, deliveryAddress, paymentMethod, notes } = req.body;
    const subtotal = items.reduce((sum, item) => {
      const addOnsPrice = item.selectedAddOns.reduce((addOnSum, addOn) => addOnSum + addOn.price, 0);
      return sum + ((item.menuItem.price + addOnsPrice) * item.quantity);
    }, 0);
    const deliveryFee = deliveryMethod === 'Delivery' ? 50.0 : 0.0;
    const total = subtotal + deliveryFee;
    const orderId = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const invoiceNumber = `INV${Date.now()}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const MobileOrder = require('../models/mobileOrder');
    const mobileOrder = new MobileOrder({
      orderId,
      items,
      total,
      deliveryMethod,
      deliveryAddress,
      paymentMethod,
      notes,
      customerName: customer.fullName,
      customerPhone: customer.phone,
      customerId,
      invoiceNumber
    });
    const savedOrder = await mobileOrder.save();
    res.status(201).json({ success: true, data: savedOrder });
  } catch (err) {
    console.error('Error creating customer order:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get customer's specific order
exports.getMyOrderById = async (req, res) => {
  try {
    const customerId = req.customerId;
    const orderId = req.params.id;
    const MobileOrder = require('../models/mobileOrder');
    const order = await MobileOrder.findOne({ _id: orderId, customerId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    console.error('Error fetching customer order:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};



// Verify phone number with OTP
exports.verifyPhone = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    // Validate required fields
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required'
      });
    }

    // Find and validate OTP record
    const otpRecord = await OTP.findOne({
      phone: phone,
      otp,
      purpose: 'phone_verification',
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Find customer by phone
    const customer = await Customer.findOne({ phone });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Check if phone is already verified
    if (customer.isPhoneVerified) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is already verified'
      });
    }

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Update customer phone verification status
    customer.isPhoneVerified = true;
    await customer.save();

    console.log(`✅ Phone verified for customer: ${customer.fullName}`);

    res.status(200).json({
      success: true,
      message: 'Phone verified successfully',
      data: {
        customer: {
          id: customer._id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          fullName: customer.fullName,
          phone: customer.phone,
          authMethod: customer.authMethod,
          isEmailVerified: customer.isEmailVerified,
          isPhoneVerified: customer.isPhoneVerified
        }
      }
    });

  } catch (error) {
    console.error('❌ Error verifying phone:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

// Resend phone verification OTP
exports.resendPhoneVerification = async (req, res) => {
  try {
    const { phone } = req.body;

    // Validate required fields
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Find customer by phone
    const customer = await Customer.findOne({ phone });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Check if phone is already verified
    if (customer.isPhoneVerified) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is already verified'
      });
    }



    // Rate limiting: Check if OTP was sent recently
    const recentOTP = await OTP.findOne({
      phone: phone,
      purpose: 'phone_verification',
      createdAt: { $gte: new Date(Date.now() - 60 * 1000) } // 1 minute ago
    });

    if (recentOTP) {
      return res.status(429).json({
        success: false,
        message: 'Please wait before requesting another verification code'
      });
    }

    // Invalidate existing OTPs for this phone
    await OTP.updateMany(
      { phone: phone, purpose: 'phone_verification', isUsed: false },
      { isUsed: true }
    );

    // Generate new OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpRecord = new OTP({
      phone: phone,
      otp: otpCode,
      purpose: 'phone_verification'
    });
    await otpRecord.save();

    // Send SMS via PhilSMS
    const smsResult = await philsmsService.sendOTP(phone, otpCode, 'verification');
    
    if (!smsResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification SMS. Please try again.',
        error: smsResult.error
      });
    }

    console.log(`✅ Phone verification OTP resent to ${phone}`);

    res.status(200).json({
      success: true,
      message: 'Phone verification code sent successfully. Please check your SMS.',
      data: {
        phone,
        expiresIn: '10 minutes'
      }
    });

  } catch (error) {
    console.error('❌ Error resending phone verification:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}; 