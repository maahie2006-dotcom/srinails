import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Prevents the same person from signing up twice
    trim: true,
    lowercase: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ Check if the model already exists to avoid "Cannot overwrite model" errors during reload
const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);

export default Subscriber; // ✅ Use 'export default' instead of 'module.exports'