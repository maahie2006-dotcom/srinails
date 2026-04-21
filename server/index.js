import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path'; // 1. Added for path handling
import { fileURLToPath } from 'url'; // 2. Added for ESM path resolution

// ✅ dotenv must be at the very top
dotenv.config();

// ESM __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import reviewRoutes from './routes/reviews.js';
import cartRoutes from './routes/cart.js';
import wishlistRoutes from './routes/wishlist.js';
import contactRoutes from "./routes/contactRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import couponRoutes from './routes/couponRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js'; 
import newsletterRoutes from './routes/newsletterRoutes.js';

const app = express();

// Middlewares
app.use(cors({ 
  origin: process.env.CLIENT_URL || 'http://localhost:3000', 
  credentials: true 
}));
app.use(express.json());

// ✅ FIX: Using absolute path ensures images load on Port 5000
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes
app.use('/api/payment', paymentRoutes); 
app.use('/api/contact', contactRoutes);
app.use('/api/coupons', couponRoutes);
app.use("/api/users", userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/newsletter', newsletterRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'SriNails API Running' }));

// Connect DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/prettynails')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));