import express from 'express';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/reviews/product/:productId
// @desc    Get all reviews for a specific nail set with user details
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar') // Pulls name and avatar for a luxury feel
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/reviews
// @desc    Add a new review & update product average ratings
router.post('/', protect, async (req, res) => {
  try {
    const { product, rating } = req.body;

    // 1. Check if the user has already reviewed this specific product
    const existingReview = await Review.findOne({ product, user: req.user._id });
    if (existingReview) {
      return res.status(400).json({ 
        message: "You have already shared your feedback for this set! ✨" 
      });
    }

    // 2. Create the new review
    const review = await Review.create({ 
      ...req.body, 
      user: req.user._id 
    });

    // 3. Update product ratings (Average & Count)
    const reviews = await Review.find({ product });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(product, { 
      'ratings.average': parseFloat(avg.toFixed(1)), // Ensure it's a number
      'ratings.count': reviews.length 
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;