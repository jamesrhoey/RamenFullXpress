const MobileOrder = require('../models/mobileOrder');

// Create a new mobile order
exports.createMobileOrder = async (req, res) => {
  try {
    const {
      items,
      deliveryMethod,
      deliveryAddress,
      paymentMethod,
      notes,
      customerName,
      customerPhone
    } = req.body;

    // Calculate total
    const subtotal = items.reduce((sum, item) => {
      const addOnsPrice = item.selectedAddOns.reduce((addOnSum, addOn) => addOnSum + addOn.price, 0);
      return sum + ((item.menuItem.price + addOnsPrice) * item.quantity);
    }, 0);

    const deliveryFee = deliveryMethod === 'Delivery' ? 50.0 : 0.0;
    const total = subtotal + deliveryFee;

    // Generate order ID and invoice number
    const orderId = generateOrderId();
    const invoiceNumber = generateInvoiceNumber();

    const mobileOrder = new MobileOrder({
      orderId,
      items,
      total,
      deliveryMethod,
      deliveryAddress,
      paymentMethod,
      notes,
      customerName,
      customerPhone,
      invoiceNumber
    });

    const savedOrder = await mobileOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all mobile orders
exports.getAllMobileOrders = async (req, res) => {
  try {
    const orders = await MobileOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a mobile order by ID
exports.updateMobileOrder = async (req, res) => {
  try {
    const order = await MobileOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get mobile order by ID
exports.getMobileOrderById = async (req, res) => {
  try {
    const order = await MobileOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Helper functions
function generateOrderId() {
  const random = Math.floor(Math.random() * 10000);
  return random.toString().padStart(4, '0');
}

function generateInvoiceNumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `INV${timestamp}${random.toString().padStart(4, '0')}`;
}
