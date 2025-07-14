const express = require('express');
const router = express.Router();
const mobileOrderController = require('../controllers/mobileOrderController');
const authMiddleware = require('../middleware/authMiddleware');
const { customerAuthMiddleware } = require('../middleware/customerAuthMiddleware');

// Allow only customers to create a mobile order
router.post('/', customerAuthMiddleware, mobileOrderController.createMobileOrder);

// Customer-specific route to get their own orders
router.get('/my-orders', customerAuthMiddleware, mobileOrderController.getCustomerOrders);

// Only cashiers can access these endpoints
router.use(authMiddleware, authMiddleware.isCashier);

// GET all mobile orders (cashiers only)
router.get('/all', mobileOrderController.getAllMobileOrders);

// GET mobile order by ID
router.get('/:id', mobileOrderController.getMobileOrderById);

// PUT update a mobile order by ID
router.put('/update/:id', mobileOrderController.updateMobileOrder);

module.exports = router;
