import express from 'express';
import Coupon from '../models/Coupon.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();


router.post('/validate', async (req, res) => {
    const { code, cartTotal } = req.body; 
    try {
        const coupon = await Coupon.findOne({ 
            code: code.toUpperCase().trim(), 
            isActive: true 
        });

        if (!coupon) {
            return res.status(404).json({ message: "Invalid coupon code 💅" });
        }

        
        if (new Date() > new Date(coupon.expiryDate)) {
            return res.status(400).json({ message: "This coupon has expired" });
        }

        
        if (cartTotal && cartTotal < coupon.minPurchase) {
            return res.status(400).json({ 
                message: `Spend at least ₹${coupon.minPurchase} to use this code` 
            });
        }

        res.json(coupon);
    } catch (err) {
        res.status(500).json({ message: "Server error during validation" });
    }
});


router.get('/latest-active', async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ 
            isActive: true,
            expiryDate: { $gte: new Date() } 
        }).sort({ createdAt: -1 });
        
        res.json(coupon || null); 
    } catch (err) {
        res.status(500).json({ message: "Server error fetching coupon" });
    }
});


router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json(coupon);
    } catch (err) {
        res.status(400).json({ message: "Code exists or data is invalid" });
    }
});


router.patch('/:id/toggle', protect, adminOnly, async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) return res.status(404).json({ message: "Coupon not found" });
        
        coupon.isActive = !coupon.isActive;
        await coupon.save();
        res.json(coupon);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) return res.status(404).json({ message: "Coupon not found" });
        res.json({ message: 'Coupon removed successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;