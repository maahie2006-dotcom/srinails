import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const signToken = (id) => 
  jwt.sign({ id }, process.env.JWT_SECRET || 'prettynails_secret', { expiresIn: '30d' });

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({ 
      token: signToken(user._id), 
      user: { 
        id: user._id, 
        name, 
        email, 
        role: user.role,
        cart: [],      // New users start with empty cart
        wishlist: []   // New users start with empty wishlist
      } 
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // We populate 'wishlist' and 'cart.product' to send full details back to React
    const user = await User.findOne({ email: req.body.email.toLowerCase()  })
      .populate('wishlist')
      .populate('cart.product');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ 
      token: signToken(user._id), 
      user: { 
        id: user._id, 
        name: user.name, 
        email, 
        role: user.role, 
        avatar: user.avatar,
        cart: user.cart || [],       // Send saved cart back to frontend
        wishlist: user.wishlist || [] // Send saved wishlist back to frontend
      } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get profile
router.get('/me', protect, async (req, res) => {
  // Populate here too so refreshing the page restores the cart/wishlist
  const user = await User.findById(req.user._id)
    .populate('wishlist')
    .populate('cart.product')
    .select('-password');
  res.json(user);
});

// Update profile
router.put('/me', protect, async (req, res) => {
  try {
    const { name, phone, addresses } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id, 
      { name, phone, addresses }, 
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Change password
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Wrong password' });
    }
    
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;