const express = require('express');
const router = express.Router();
const mobileOrderController = require('../controllers/mobileOrderController');
const authMiddleware = require('../middleware/authMiddleware');

// Only cashiers can access these endpoints
router.use(authMiddleware, authMiddleware.isCashier);

// GET all mobile orders
router.get('/', mobileOrderController.getAllMobileOrders);

// PUT update a mobile order by ID
router.put('/:id', mobileOrderController.updateMobileOrder);

module.exports = router;
