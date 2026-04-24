import express from 'express';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      collection, 
      minPrice, 
      maxPrice, 
      sort, 
      search, 
      featured, 
      bestseller, 
      page = 1, 
      limit = 12 
    } = req.query;

   
    const filter = { isActive: true };

    
    if (category) filter.category = category;

    
    if (collection) {
      const collectionArray = collection.split(',');
      filter.collection = { $in: collectionArray };
    }

    if (featured === 'true') filter.isFeatured = true;
    if (bestseller === 'true') filter.isBestSeller = true;

    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    
    const sortMap = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      popular: { 'ratings.average': -1 }
    };
    const sortBy = sortMap[sort] || { createdAt: -1 };

    
    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter)
    ]);

    res.json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / limit),
      page: Number(page),
      products
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true });
    if (!product) return res.status(404).json({ message: 'Luxe set not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', protect, adminOnly, async (req, res) => {
  try {
    
    const productData = {
      ...req.body,
      
      description: req.body.description || `${req.body.name} - Exclusive ${req.body.collection} set.`,
      isActive: true
    };
    
    const product = await Product.create(productData);
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});


router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});


router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ success: true, message: 'Luxury set removed from collection' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;