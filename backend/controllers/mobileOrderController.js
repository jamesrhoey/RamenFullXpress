const Sales = require('../models/sales');

// Get all mobile orders
exports.getAllMobileOrders = async (req, res) => {
  try {
    const orders = await Sales.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a mobile order by ID
exports.updateMobileOrder = async (req, res) => {
  try {
    const order = await Sales.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
