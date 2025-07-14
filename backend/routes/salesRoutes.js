const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new sale (accessible by both admin and cashier)
router.post('/new-sale', authMiddleware, salesController.createSale);

// Apply admin check to routes that need admin access
router.use(authMiddleware, authMiddleware.isAdmin);

// Get all sales (admin only)
router.get('/all-sales', salesController.getAllSales);

// Get a sale by orderID (admin only)
router.get('/order/:orderID', salesController.getSaleByOrderID);

// Get a sale by ID (admin only)
router.get('/:id', salesController.getSaleById);

// Update a sale by ID (admin only)
router.put('/update/:id', salesController.updateSale);

// Delete a sale by ID (admin only)
router.delete('/delete/:id', salesController.deleteSale);

module.exports = router;
