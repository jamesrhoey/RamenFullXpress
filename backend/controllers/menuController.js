const Menu = require('../models/menu');

// Get all menu items
const getAllMenu = async (req, res) => {
  try {
    const menuItems = await Menu.find({});
    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching menu items',
      error: error.message
    });
  }
};

// Get single menu item by ID
const getMenuById = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    res.status(200).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching menu item',
      error: error.message
    });
  }
};

// Create new menu item
const createMenu = async (req, res) => {
  try {
    const { name, price, category, image, ingredients } = req.body;
    
    // Validate required fields
    if (!name || !price || !category || !image) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, category, and image are required'
      });
    }

    const newMenuItem = new Menu({
      name,
      price,
      category,
      image,
      ingredients: ingredients || []
    });

    const savedMenuItem = await newMenuItem.save();
    
    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: savedMenuItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating menu item',
      error: error.message
    });
  }
};

// Update menu item
const updateMenu = async (req, res) => {
  try {
    const { name, price, category, image, ingredients } = req.body;
    
    const updatedMenuItem = await Menu.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        category,
        image,
        ingredients
      },
      { new: true, runValidators: true }
    );

    if (!updatedMenuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: updatedMenuItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating menu item',
      error: error.message
    });
  }
};

// Delete menu item
const deleteMenu = async (req, res) => {
  try {
    const deletedMenuItem = await Menu.findByIdAndDelete(req.params.id);
    
    if (!deletedMenuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
      data: deletedMenuItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting menu item',
      error: error.message
    });
  }
};

// Get menu items by category
const getMenuByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const menuItems = await Menu.find({ category });
    
    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching menu items by category',
      error: error.message
    });
  }
};

module.exports = {
  getAllMenu,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
  getMenuByCategory
};
