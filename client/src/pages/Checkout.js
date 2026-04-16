import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Checkout.css';

const STEPS = ['Shipping', 'Payment', 'Review'];

const Checkout = () => {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const { cart, subtotal, shipping, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shipping_addr, setShipping] = useState({ name: user?.name || '', street: '', city: '', state: '', zip: '', country: 'US', phone: '' });
  const [payment, setPayment] = useState({ method: 'card', cardNum: '', expiry: '', cvv: '', nameOnCard: '' });

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: cart.map(i => ({ product: i.product._id, name: i.product.name, image: i.product.images?.[0]?.url, price: i.price, quantity: i.quantity, variant: i.variant, size: i.size })),
        shippingAddress: shipping_addr,
        payment: { method: payment.method, status: 'paid', paidAt: new Date() },
        subtotal, shippingCost: shipping, tax: 0, total: finalTotal,
        status: 'confirmed'
      };
      const { data } = await axios.post('/api/orders', orderData);
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${data._id}`);
    } catch {
      toast.error('Order failed. Please try again.');
    } finally { setLoading(false); }
  };

  const applyCoupon = () => {
  console.log("Coupon Entered:", coupon);
  console.log("Subtotal:", subtotal);

  if (coupon.trim() === "") {
    toast.error("Please enter coupon ❌");
    return;
  }

  if (subtotal === 0) {
    toast.error("Cart is empty ❌");
    return;
  }

  if (coupon.toUpperCase() === "SRI10") {
    setDiscount(0.10);
    toast.success("10% Discount Applied 🎉");
  } else {
    setDiscount(0);
    toast.error("Invalid Coupon ❌");
  }
};
  const tax = subtotal * 0.08;
  const discountAmount = subtotal * discount;
  const finalTotal = subtotal + shipping + tax - discountAmount;

  return (
    <div className="checkout-page page-wrapper">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>

        {/* Steps */}
        <div className="checkout-steps">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`checkout-step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                <div className="step-circle">{i < step ? '✓' : i + 1}</div>
                <span>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`step-line ${i < step ? 'done' : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="checkout-layout">
          {/* Left: Form */}
          <div className="checkout-form-section">
            {/* Step 0: Shipping */}
            {step === 0 && (
              <div className="checkout-panel">
                <h2>Shipping Information</h2>
                <div className="form-grid">
                  <div className="form-field full">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" value={shipping_addr.name} onChange={e => setShipping({...shipping_addr, name: e.target.value})} placeholder="Jane Doe" required />
                  </div>
                  <div className="form-field full">
                    <label className="form-label">Street Address</label>
                    <input className="form-input" value={shipping_addr.street} onChange={e => setShipping({...shipping_addr, street: e.target.value})} placeholder="123 Main St, Apt 4B" required />
                  </div>
                  <div className="form-field">
                    <label className="form-label">City</label>
                    <input className="form-input" value={shipping_addr.city} onChange={e => setShipping({...shipping_addr, city: e.target.value})} placeholder="New York" required />
                  </div>
                  <div className="form-field">
                    <label className="form-label">State</label>
                    <input className="form-input" value={shipping_addr.state} onChange={e => setShipping({...shipping_addr, state: e.target.value})} placeholder="NY" required />
                  </div>
                  <div className="form-field">
                    <label className="form-label">ZIP Code</label>
                    <input className="form-input" value={shipping_addr.zip} onChange={e => setShipping({...shipping_addr, zip: e.target.value})} placeholder="10001" required />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Phone</label>
                    <input className="form-input" value={shipping_addr.phone} onChange={e => setShipping({...shipping_addr, phone: e.target.value})} placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="form-field full">
                    <label className="form-label">Country</label>
                    <select className="form-input" value={shipping_addr.country} onChange={e => setShipping({...shipping_addr, country: e.target.value})}>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="IN">India</option>
                    </select>
                  </div>
                </div>

                {/* Shipping options */}
                <div className="shipping-options">
                  <h3>Shipping Method</h3>
                  {[
                    { id: 'standard', label: 'Standard Shipping', time: '5-7 business days', price: subtotal >= 50 ? 'FREE' : '₹5.99' },
                    { id: 'express', label: 'Express Shipping', time: '2-3 business days', price: '₹12.99' },
                    { id: 'overnight', label: 'Overnight Shipping', time: '1 business day', price: '₹24.99' },
                  ].map(opt => (
                    <label key={opt.id} className="shipping-option">
                      <input type="radio" name="shipping" defaultChecked={opt.id === 'standard'} />
                      <div className="ship-opt-info">
                        <strong>{opt.label}</strong>
                        <span>{opt.time}</span>
                      </div>
                      <span className="ship-opt-price" style={{ color: opt.price === 'FREE' ? '#2ea76a' : 'inherit' }}>{opt.price}</span>
                    </label>
                  ))}
                </div>

                <button className="btn-primary next-btn" onClick={() => setStep(1)}
                  disabled={!shipping_addr.name || !shipping_addr.street || !shipping_addr.city}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <div className="checkout-panel">
                <h2>Payment Details</h2>
                <div className="payment-methods">
                  {[
                    { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
                    { id: 'paypal', label: 'PayPal', icon: '🅿️' },
                    { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
                  ].map(m => (
                    <label key={m.id} className={`payment-method ${payment.method === m.id ? 'active' : ''}`}>
                      <input type="radio" name="payment" value={m.id} checked={payment.method === m.id} onChange={e => setPayment({...payment, method: e.target.value})} />
                      <span className="pm-icon">{m.icon}</span>
                      <span>{m.label}</span>
                    </label>
                  ))}
                </div>

                {payment.method === 'card' && (
                  <div className="card-form">
                    <div className="form-field full">
                      <label className="form-label">Name on Card</label>
                      <input className="form-input" value={payment.nameOnCard} onChange={e => setPayment({...payment, nameOnCard: e.target.value})} placeholder="Jane Doe" />
                    </div>
                    <div className="form-field full">
                      <label className="form-label">Card Number</label>
                      <input className="form-input" value={payment.cardNum} onChange={e => setPayment({...payment, cardNum: e.target.value})} placeholder="1234 5678 9012 3456" maxLength={19} />
                    </div>
                    <div className="form-grid">
                      <div className="form-field">
                        <label className="form-label">Expiry Date</label>
                        <input className="form-input" value={payment.expiry} onChange={e => setPayment({...payment, expiry: e.target.value})} placeholder="MM/YY" />
                      </div>
                      <div className="form-field">
                        <label className="form-label">CVV</label>
                        <input className="form-input" value={payment.cvv} onChange={e => setPayment({...payment, cvv: e.target.value})} placeholder="123" maxLength={4} />
                      </div>
                    </div>
                    <div className="ssl-note">🔒 Your payment info is encrypted and secure.</div>
                  </div>
                )}

                <div className="step-nav">
                  <button className="btn-secondary" onClick={() => setStep(0)}>← Back</button>
                  <button className="btn-primary next-btn" onClick={() => setStep(2)}>Review Order →</button>
                </div>
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div className="checkout-panel">
                <h2>Review Your Order</h2>
                <div className="review-section">
                  <div className="review-block">
                    <div className="review-block-header"><span>📦 Shipping to</span><button className="edit-link" onClick={() => setStep(0)}>Edit</button></div>
                    <p>{shipping_addr.name}<br />{shipping_addr.street}<br />{shipping_addr.city}, {shipping_addr.state} {shipping_addr.zip}</p>
                  </div>
                  <div className="review-block">
                    <div className="review-block-header"><span>💳 Payment</span><button className="edit-link" onClick={() => setStep(1)}>Edit</button></div>
                    <p>{payment.method === 'card' ? `Card ending ${payment.cardNum.slice(-4) || '••••'}` : payment.method === 'paypal' ? 'PayPal' : 'Cash on Delivery'}</p>
                  </div>
                </div>

                <div className="review-items">
                  {cart.map(item => (
                    <div key={item.key} className="review-item">
                      <img src={item.product.images?.[0]?.url || ''} alt={item.product.name} />
                      <div>
                        <strong>{item.product.name}</strong>
                        <span>Qty: {item.quantity}</span>
                        {item.size && <span>Size: {item.size}</span>}
                      </div>
                      <span className="review-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="step-nav">
                  <button className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn-primary place-order-btn" onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? 'Placing Order...' : 'Place Order 💅'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="order-summary-panel">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cart.map(item => (
                <div key={item.key} className="summary-item">
                  <div className="summary-item-img">
                    <img src={item.product.images?.[0]?.url || ''} alt={item.product.name} />
                    <span className="summary-qty">{item.quantity}</span>
                  </div>
                  <span className="summary-item-name">{item.product.name}</span>
                  <span className="summary-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-divider" />
            <div className="coupon-box">
  <input
    type="text"
    placeholder="Enter coupon code"
    value={coupon}
    onChange={(e) => setCoupon(e.target.value)}
  />
  <button onClick={applyCoupon}>Apply</button>
</div>
            <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? <span style={{ color: '#2ea76a', fontWeight: 700 }}>FREE</span> : `₹${shipping.toFixed(2)}`}</span></div>
            <div className="summary-row"><span>Tax (8%)</span><span>₹{tax.toFixed(2)}</span></div>
           {discount > 0 && (
  <div className="summary-row" style={{ color: "green", fontWeight: "bold" }}>
    <span>🎉 Coupon Applied (10%)</span>
    <span>-₹{discountAmount.toFixed(2)}</span>
  </div>
)}
            <div className="summary-divider" />
            <div className="summary-total"><span>Total</span><span>₹{finalTotal.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
