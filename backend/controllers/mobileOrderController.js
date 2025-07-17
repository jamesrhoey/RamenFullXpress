const MobileOrder = require('../models/mobileOrder');

// Create a new mobile order
exports.createMobileOrder = async (req, res) => {
  try {
    console.log('📦 Received mobile order request:');
    console.log('📋 Request body:', JSON.stringify(req.body, null, 2));
    console.log('👤 Authenticated customer:', req.customer);
    
    const {
      items,
      deliveryMethod,
      deliveryAddress,
      paymentMethod,
      notes
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items array is required and cannot be empty' });
    }

    if (!deliveryMethod) {
      return res.status(400).json({ message: 'Delivery method is required' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    // Validate each item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.menuItem || !item.menuItem.id || !item.menuItem.name || item.menuItem.price === undefined) {
        return res.status(400).json({ 
          message: `Item ${i + 1} is missing required menuItem fields (id, name, price)` 
        });
      }
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({ 
          message: `Item ${i + 1} has invalid quantity` 
        });
      }
    }

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
      invoiceNumber,
      customerId: req.customer?._id // Add customer ID reference if available
    });

    console.log('💾 Saving mobile order:', JSON.stringify(mobileOrder, null, 2));
    const savedOrder = await mobileOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('❌ Error creating mobile order:', err);
    res.status(400).json({ message: err.message });
  }
};

// Get all mobile orders
exports.getAllMobileOrders = async (req, res) => {
  try {
    const orders = await MobileOrder.find().populate('customerId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get customer's own orders
exports.getCustomerOrders = async (req, res) => {
  try {
    console.log('👤 Customer requesting orders:', req.customer._id);
    
    const orders = await MobileOrder.find({ 
      customerId: req.customer._id 
    }).sort({ createdAt: -1 });
    
    console.log(`📦 Found ${orders.length} orders for customer`);
    res.json(orders);
  } catch (err) {
    console.error('❌ Error fetching customer orders:', err);
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

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body; // use 'status' as the field
    const updatedOrder = await MobileOrder.findByIdAndUpdate(
      orderId,
      { status }, // update the 'status' field
      { new: true }
    ).populate('customerId', 'firstName lastName name fullName phone');
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
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
