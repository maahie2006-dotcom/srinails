import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true,
    trim: true 
  },
  offerType: { 
    type: String, 
    enum: ['Percentage', 'Flat', 'BOGO'], 
    default: 'Percentage' 
  },
  discountValue: { 
    type: Number, 
    required: true,
    default: 0 
  },
  minPurchase: {
    type: Number,
    default: 0,
    description: "Minimum cart total required to use this coupon"
  },
  expiryDate: {
    type: Date,
    required: true,
    default: () => new Date(+new Date() + 30*24*60*60*1000) // Defaults to 30 days from now
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

// Optional: Index for faster lookup during checkout
couponSchema.index({ code: 1, isActive: 1 });

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;