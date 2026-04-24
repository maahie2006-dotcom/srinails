import express from 'express';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();


router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar') 
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', protect, async (req, res) => {
  try {
    const { product, rating } = req.body;

    
    const existingReview = await Review.findOne({ product, user: req.user._id });
    if (existingReview) {
      return res.status(400).json({ 
        message: "You have already shared your feedback for this set! ✨" 
      });
    }

    
    const review = await Review.create({ 
      ...req.body, 
      user: req.user._id 
    });

    
    const reviews = await Review.find({ product });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(product, { 
      'ratings.average': parseFloat(avg.toFixed(1)), 
      'ratings.count': reviews.length 
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;