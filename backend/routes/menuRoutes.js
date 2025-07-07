const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Get all menu items
router.get('/all', menuController.getAllMenu);

// Get menu items by category
router.get('/category/:category', menuController.getMenuByCategory);

// Get single menu item by ID
router.get('/:id', menuController.getMenuById);

// Create new menu item
router.post('/newMenu', menuController.createMenu);

// Update menu item
router.put('/updateMenu/:id', menuController.updateMenu);

// Delete menu item
router.delete('/deleteMenu/:id', menuController.deleteMenu);

module.exports = router;