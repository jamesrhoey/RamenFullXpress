const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { customerAuthMiddleware } = require('../middleware/customerAuthMiddleware');

// Public routes (no authentication required)

// Email-based authentication
router.post('/register-email', customerController.registerWithEmail);
router.post('/login-email', customerController.loginWithEmail);
router.post('/verify-email', customerController.verifyEmail);
router.post('/resend-email-verification', customerController.resendEmailVerification);

// Google authentication
router.post('/google-signin', customerController.googleSignIn);

// Phone-based authentication (existing)
router.post('/register', customerController.register);
router.post('/login', customerController.login);

// Phone verification routes (no authentication required)
router.post('/verify-phone', customerController.verifyPhone);
router.post('/resend-phone-verification', customerController.resendPhoneVerification);

// Protected routes (require authentication)
router.use(customerAuthMiddleware);

router.get('/profile', customerController.getProfile);
router.put('/profile', customerController.updateProfile);
router.put('/change-password', customerController.changePassword);

// Customer mobile orders (customer can only see their own orders)
router.get('/my-orders', customerController.getMyOrders);
router.post('/my-orders', customerController.createMyOrder);
router.get('/my-orders/:id', customerController.getMyOrderById);

module.exports = router; 