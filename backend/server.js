require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');

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
app.use(express.json());

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

mongoose.connect(Mongoose_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

