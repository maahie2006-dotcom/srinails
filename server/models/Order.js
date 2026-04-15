import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, unique: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    image: String,
    price: Number,
    quantity: { type: Number, default: 1 },
    variant: {
      color: String,
      finish: String
    },
    size: String
  }],
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    phone: String
  },
  billingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  payment: {
    method: { type: String, enum: ['stripe', 'paypal', 'cod'] },
    stripePaymentIntentId: String,
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    paidAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  subtotal: Number,
  shippingCost: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  couponCode: String,
  total: Number,
  trackingNumber: String,
  notes: String,
  deliveredAt: Date,
  createdAt: { type: Date, default: Date.now }
});

orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'PPN-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }
  next();
});

export default mongoose.model('Order', orderSchema);
