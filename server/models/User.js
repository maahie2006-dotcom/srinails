import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Please provide your name"], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, "Please provide an email"], 
    unique: true, 
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: { 
    type: String, 
    required: [true, "Please provide a password"], 
    minlength: 6,
    select: true 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  avatar: { 
    type: String, 
    default: '' 
  },
  
  // ✅ NEW: Newsletter Subscription Status
  isSubscribed: {
    type: Boolean,
    default: false
  },

  addresses: [{
    label: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    country: { type: String, default: 'IN' }, 
    isDefault: { type: Boolean, default: false }
  }],
  phone: {
    type: String,
    trim: true
  },
  
  wishlist: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }],

  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
    variant: {
      color: String,
      finish: String
    },
    size: String,
    price: Number
  }],

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to verify password during login
userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (err) {
    return false;
  }
};

export default mongoose.model('User', userSchema);