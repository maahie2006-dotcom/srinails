import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const productSchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true, sparse: true },
  description: String,
  shortDescription: String,
  price: Number,
  comparePrice: Number,
  images: Array,
  category: String,
  collection: String,
  tags: Array,
  sizes: Array,
  variants: Array,
  stock: Number,
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isNew: { type: Boolean, default: true },
  ratings: { average: Number, count: Number },
  applicationMethod: String,
  wearDuration: String,
  inclusions: Array,
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);

const makeSlug = (name) =>
  name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') + '-' + Date.now() + '-' + Math.floor(Math.random() * 9999);

const PRODUCTS = [
  { name: 'Rose Dreams', description: 'A dreamy rose-toned set with a glossy finish. Perfect for any occasion.', shortDescription: 'Soft blush gradient coffin nails.', price: 18.99, comparePrice: 24.99, category: 'coffin', collection: 'Everyday Glam', tags: ['rose','blush','glossy'], images: [{ url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format', alt: 'Rose Dreams', isPrimary: true }], variants: [{ color: 'Rose', colorHex: '#f2c2bb', finish: 'glossy', stock: 20 }], sizes: [{ label: 'XS' },{ label: 'S' },{ label: 'M' },{ label: 'L' },{ label: 'XL' }], stock: 45, isFeatured: true, isBestSeller: true, isNew: false, applicationMethod: 'both', wearDuration: 'Up to 3 weeks with glue / 7 days with tabs', inclusions: ['24 nails','Nail glue','Adhesive tabs','Mini nail file'], ratings: { average: 4.8, count: 124 } },
  { name: 'Midnight Velvet', description: 'Deep dramatic stiletto nails in midnight blue with velvet-matte finish.', shortDescription: 'Midnight blue stiletto nails.', price: 21.99, category: 'stiletto', collection: 'Night Out', tags: ['midnight','blue','matte'], images: [{ url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format', alt: 'Midnight Velvet', isPrimary: true }], variants: [{ color: 'Midnight Blue', colorHex: '#1a1a4e', finish: 'matte', stock: 18 }], sizes: [{ label: 'XS' },{ label: 'S' },{ label: 'M' },{ label: 'L' },{ label: 'XL' }], stock: 30, isFeatured: true, isNew: true, applicationMethod: 'both', wearDuration: 'Up to 3 weeks with glue', inclusions: ['24 nails','Nail glue','Adhesive tabs','Mini nail file'], ratings: { average: 4.9, count: 87 } },
  { name: 'Cherry Blossom', description: 'Delicate almond nails inspired by Japanese cherry blossoms.', shortDescription: 'Floral almond nails on nude base.', price: 16.99, comparePrice: 22.99, category: 'almond', collection: 'Floral Fantasy', tags: ['floral','pink','nude'], images: [{ url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format', alt: 'Cherry Blossom', isPrimary: true }], variants: [{ color: 'Nude Pink', colorHex: '#f0c8c0', finish: 'glossy', stock: 25 }], sizes: [{ label: 'XS' },{ label: 'S' },{ label: 'M' },{ label: 'L' },{ label: 'XL' }], stock: 45, isBestSeller: true, applicationMethod: 'both', wearDuration: 'Up to 3 weeks with glue', inclusions: ['24 nails','Nail glue','Adhesive tabs','Mini nail file'], ratings: { average: 4.7, count: 203 } },
  { name: 'Golden Hour', description: 'Luxurious coffin nails in warm golden tones with chrome finish.', shortDescription: 'Gold chrome coffin nails.', price: 24.99, category: 'coffin', collection: 'Luxe Collection', tags: ['gold','chrome','luxury'], images: [{ url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format', alt: 'Golden Hour', isPrimary: true }], variants: [{ color: 'Gold Chrome', colorHex: '#c9a96e', finish: 'chrome', stock: 15 }], sizes: [{ label: 'XS' },{ label: 'S' },{ label: 'M' },{ label: 'L' },{ label: 'XL' }], stock: 37, isFeatured: true, applicationMethod: 'both', wearDuration: 'Up to 3 weeks with glue', inclusions: ['24 nails','Nail glue','Adhesive tabs','Mini nail file'], ratings: { average: 5.0, count: 56 } },
  { name: 'Lavender Haze', description: 'Soft almond nails in lavender with holographic shimmer.', shortDescription: 'Holographic lavender almond nails.', price: 19.99, category: 'almond', collection: 'Pastel Dreams', tags: ['lavender','purple','holographic'], images: [{ url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format', alt: 'Lavender Haze', isPrimary: true }], variants: [{ color: 'Lavender', colorHex: '#c8b8e8', finish: 'holographic', stock: 18 }], sizes: [{ label: 'XS' },{ label: 'S' },{ label: 'M' },{ label: 'L' },{ label: 'XL' }], stock: 18, isNew: true, applicationMethod: 'both', wearDuration: 'Up to 3 weeks with glue', inclusions: ['24 nails','Nail glue','Adhesive tabs','Mini nail file'], ratings: { average: 4.6, count: 34 } },
  { name: 'Crystal Kiss', description: 'Ultra-glam stiletto nails with micro-crystals and diamond chrome finish.', shortDescription: 'Crystal stiletto nails.', price: 27.99, category: 'stiletto', collection: 'Special Occasion', tags: ['crystal','chrome','glam'], images: [{ url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format', alt: 'Crystal Kiss', isPrimary: true }], variants: [{ color: 'Crystal Clear', colorHex: '#e8f0f8', finish: 'chrome', stock: 15 }], sizes: [{ label: 'XS' },{ label: 'S' },{ label: 'M' },{ label: 'L' },{ label: 'XL' }], stock: 25, isFeatured: true, applicationMethod: 'glue', wearDuration: 'Up to 2 weeks with glue', inclusions: ['24 nails','Nail glue','Mini nail file'], ratings: { average: 4.9, count: 91 } },
  { name: 'Nude Luxe', description: 'Timeless square nails in perfect nude tone.', shortDescription: 'Classic square nude nails.', price: 15.99, category: 'square', collection: 'Everyday Glam', tags: ['nude','square','classic'], images: [{ url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format', alt: 'Nude Luxe', isPrimary: true }], variants: [{ color: 'Warm Nude', colorHex: '#e8c4a8', finish: 'glossy', stock: 30 }], sizes: [{ label: 'XS' },{ label: 'S' },{ label: 'M' },{ label: 'L' },{ label: 'XL' }], stock: 75, isBestSeller: true, applicationMethod: 'both', wearDuration: 'Up to 3 weeks with glue', inclusions: ['24 nails','Nail glue','Adhesive tabs','Mini nail file'], ratings: { average: 4.8, count: 178 } },
  { name: 'Berry Glam', description: 'Bold coffin nails in deep berry with glossy finish.', shortDescription: 'Deep berry coffin nails.', price: 20.99, comparePrice: 26.99, category: 'coffin', collection: 'Seasonal', tags: ['berry','wine','autumn'], images: [{ url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format', alt: 'Berry Glam', isPrimary: true }], variants: [{ color: 'Berry Wine', colorHex: '#7b2d50', finish: 'glossy', stock: 20 }], sizes: [{ label: 'XS' },{ label: 'S' },{ label: 'M' },{ label: 'L' },{ label: 'XL' }], stock: 53, applicationMethod: 'both', wearDuration: 'Up to 3 weeks with glue', inclusions: ['24 nails','Nail glue','Adhesive tabs','Mini nail file'], ratings: { average: 4.5, count: 62 } }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/prettynails');
    console.log('✅ Connected to MongoDB');

    // Drop entire collections for clean slate
    try { await mongoose.connection.dropCollection('products'); console.log('🗑️  Dropped products'); } catch (e) { console.log('ℹ️  No products collection to drop'); }
    try { await mongoose.connection.dropCollection('users'); console.log('🗑️  Dropped users'); } catch (e) { console.log('ℹ️  No users collection to drop'); }

    // Insert products with explicit unique slugs
    const docs = PRODUCTS.map((p, i) => ({
      ...p,
      slug: makeSlug(p.name) + i,
      isActive: true,
      createdAt: new Date()
    }));
    await Product.insertMany(docs, { ordered: false });
    console.log(`✅ Seeded ${PRODUCTS.length} products`);

    // Hash password manually and insert admin
    const bcrypt = await import('bcryptjs');
    const hashed = await bcrypt.default.hash('admin123', 12);
    await User.create({ name: 'Admin', email: 'admin@prettypressnails.com', password: hashed, role: 'admin' });
    console.log('✅ Admin user created');

    console.log('\n🎉 Done!');
    console.log('  Email:    admin@prettypressnails.com');
    console.log('  Password: admin123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

seed();
