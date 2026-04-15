import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  shortDescription: String,
  price: { type: Number, required: true },
  comparePrice: Number,
  images: [{ url: String, alt: String, isPrimary: { type: Boolean, default: false } }],
  category: {
    type: String,
    enum: ['coffin', 'almond', 'square', 'stiletto', 'round', 'oval', 'ballerina', 'custom'],
    required: true
  },
  collection: { type: String, default: '' },
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
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  applicationMethod: { type: String, enum: ['glue', 'adhesive_tabs', 'both'], default: 'both' },
  wearDuration: String,
  inclusions: [String],
  createdAt: { type: Date, default: Date.now }
});

productSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
  }
  next();
});

export default mongoose.model('Product', productSchema);
