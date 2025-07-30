const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (!['admin', 'cashier'].includes(role)) {
      return res.status(400).json({ message: 'Role must be admin or cashier.' });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('🔐 Login attempt received:', { username: req.body.username });
    
    const { username, password } = req.body;
    if (!username || !password) {
      console.log('❌ Missing username or password');
      return res.status(400).json({ message: 'All fields are required.' });
    }
    
    console.log('🔍 Looking up user in database...');
    const user = await User.findOne({ username });
    if (!user) {
      console.log('❌ User not found:', username);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    
    console.log('🔐 Comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Password mismatch for user:', username);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    
    console.log('✅ Password verified, generating token...');
    const jwtSecret = process.env.JWT_SECRET || 'secretkey';
    console.log('🔑 JWT Secret available:', jwtSecret ? 'Yes' : 'No');
    
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      jwtSecret,
      { expiresIn: '1d' }
    );
    
    console.log('✅ Login successful for user:', username);
    res.json({ token, user: { username: user.username, role: user.role } });
  } catch (err) {
    console.error('💥 Login error:', err);
    console.error('💥 Error stack:', err.stack);
    console.error('💥 Environment variables:', {
      NODE_ENV: process.env.NODE_ENV,
      JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
      MONGO_URI: process.env.MONGO_URI ? 'Set' : 'Not set'
    });
    
    res.status(500).json({ 
      message: 'Server error.', 
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
};