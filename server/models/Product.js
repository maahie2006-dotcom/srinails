import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  // 1. Name and Price remain required as they are essential
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  
  // 2. Collection is optional (matches your dropdown)
  collection: { type: String, default: 'Everyday Glam' },

  // 3. SLUG: Auto-generated, no longer causes "required" errors
  slug: { type: String, unique: true },

  // 4. DESCRIPTION: Changed to NOT required (Provides a default if empty)
  description: { 
    type: String, 
    default: 'A premium handcrafted nail set designed for elegance and durability.' 
  },

  // 5. CATEGORY: Changed to NOT required (Defaults to 'custom' to satisfy the enum)
  category: {
    type: String,
    enum: ['coffin', 'almond', 'square', 'stiletto', 'round', 'oval', 'ballerina', 'custom'],
    default: 'custom'
  },

  // 6. IMAGES: Set up to accept the single URL from your admin form
  images: [{ 
    url: String, 
    alt: String, 
    isPrimary: { type: Boolean, default: true } 
  }],

  // Metadata & Toggles
  shortDescription: String,
  comparePrice: Number,
  tags: [String],
  sizes: [{
    label: String,
    setContents: String
  }],
  variants: [{
    color: String,
    colorHex: String,
    finish: { type: String, enum: ['glossy', 'matte', 'shimmer', 'glitter', 'chrome', 'holographic'] },
    stock: { type: Number, default: 0 }
  }],
  stock: { type: Number, default: 0 },
  sku: String,
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isNew: { type: Boolean, default: true },
  
  ratings: {
    average: { type: Number, default: 5, min: 0, max: 5 }, // Default 5 stars for new sets
    count: { type: Number, default: 0 }
  },
  
  applicationMethod: { type: String, enum: ['glue', 'adhesive_tabs', 'both'], default: 'both' },
  wearDuration: { type: String, default: 'Up to 3 weeks' },
  inclusions: [String],
  createdAt: { type: Date, default: Date.now }
});

// Professional Slug Generator
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') 
      .replace(/[\s_-]+/g, '-') 
      .replace(/^-+|-+$/g, ''); 
  }
  next();
});

export default mongoose.model('Product', productSchema);