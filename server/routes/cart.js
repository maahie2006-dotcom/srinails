import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();


router.post('/sync', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = req.body.items;
    await user.save();
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});


router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    res.status(200).json({ items: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;