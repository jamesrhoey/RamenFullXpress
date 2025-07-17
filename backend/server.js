require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const cors = require('cors');
const path = require('path');

const port = process.env.PORT;
const Mongoose_URI = process.env.MONGO_URI;


const authRoutes = require('./routes/authRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const menuRoutes = require('./routes/menuRoutes');
const salesRoutes = require('./routes/salesRoutes');
const mobileOrderRoutes = require('./routes/mobileOrderRoutes');
const customerRoutes = require('./routes/customerRoutes');
const paymentMethodRoutes = require('./routes/paymentMethodRoutes');
const deliveryAddressRoutes = require('./routes/deliveryAddressRoutes');


const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://127.0.0.1:5501', 'http://localhost:5501'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(cors({
  origin: ['http://127.0.0.1:5501', 'http://localhost:5501'], // allow your frontend origins
  credentials: true // if you want to allow cookies/auth headers
}));

const mapper = '/api/v1/';


// Routes
app.use(mapper + 'auth', authRoutes);
app.use(mapper + 'inventory', inventoryRoutes);
app.use(mapper + 'menu', menuRoutes);
app.use(mapper + 'sales', salesRoutes);
app.use(mapper + 'mobile-orders', mobileOrderRoutes);
app.use(mapper + 'customers', customerRoutes);
app.use(mapper + 'payment-methods', paymentMethodRoutes);
app.use(mapper + 'delivery-addresses', deliveryAddressRoutes);
app.use('/uploads/menus', express.static(path.join(__dirname, 'uploads/menus')));

mongoose.connect(Mongoose_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'RamenXpress API is running' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Health check available at http://localhost:${port}/health`);
});

