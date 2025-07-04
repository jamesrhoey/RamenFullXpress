require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const port = process.env.PORT;
const Mongoose_URI = process.env.Mongoose_URI;



const app = express();

app.use(express.json());

const mapper = '/api/v1/';

const authRoutes = require('./routes/authRoutes');
app.use(mapper + 'auth', authRoutes);

mongoose.connect(Mongoose_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

