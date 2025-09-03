const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');

// Generate and send OTP
// POST /api/v1/otp/generate
router.post('/generate', otpController.generateOTP);

// Verify OTP
// POST /api/v1/otp/verify
router.post('/verify', otpController.verifyOTP);

// Resend OTP
// POST /api/v1/otp/resend
router.post('/resend', otpController.resendOTP);

// Get OTP status (for debugging/monitoring)
// GET /api/v1/otp/status?email=user@example.com&purpose=login
router.get('/status', otpController.getOTPStatus);

// Test SMS service connection
// GET /api/v1/otp/test-sms
router.get('/test-sms', otpController.testSMSService);

// Send test SMS
// POST /api/v1/otp/send-test-sms
router.post('/send-test-sms', otpController.sendTestSMS);

module.exports = router;
