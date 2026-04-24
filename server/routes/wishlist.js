import express from 'express';
const router = express.Router();
import Wishlist from '../models/Wishlist.js';

/**
 * @route   GET /api/wishlist/:userId
 * @desc    Get all wishlist items for a specific user
 * @access  Private
 */
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        
        const wishlist = await Wishlist.find({ userId: userId })
            .populate({
                path: 'productId',
                
                select: 'name price images image description slug category' 
            })
            .sort({ createdAt: -1 }); 

        res.status(200).json(wishlist);
    } catch (err) {
        console.error("Wishlist Fetch Error:", err);
        res.status(500).json({ message: "Error fetching your luxe collection" });
    }
});

/**
 * @route   POST /api/wishlist/add
 * @desc    Add a product to the user's wishlist
 * @access  Private
 */
router.post('/add', async (req, res) => {
    const { userId, productId } = req.body;
    
    
    if (!userId || !productId) {
        return res.status(400).json({ message: "UserId and ProductId are required" });
    }

    try {
        
        const existingItem = await Wishlist.findOne({ userId, productId });
        if (existingItem) {
            return res.status(400).json({ message: "Already in your collection ✨" });
        }

        const newItem = new Wishlist({ userId, productId });
        await newItem.save();
        
        
        const populatedItem = await Wishlist.findById(newItem._id).populate('productId');
        
        res.status(201).json(populatedItem);
    } catch (err) {
        console.error("Wishlist Add Error:", err);
        res.status(500).json({ message: "Failed to save to wishlist" });
    }
});

/**
 * @route   DELETE /api/wishlist/remove/:id
 * @desc    Remove an item from the wishlist
 * @access  Private
 */
router.delete('/remove/:id', async (req, res) => {
    try {
        
        const item = await Wishlist.findByIdAndDelete(req.params.id);
        
        if (!item) {
            return res.status(404).json({ message: "Item not found in wishlist" });
        }
        
        res.status(200).json({ message: "Removed from your collection", id: req.params.id });
    } catch (err) {
        console.error("Wishlist Remove Error:", err);
        res.status(500).json({ message: "Failed to remove item" });
    }
});

export default router;