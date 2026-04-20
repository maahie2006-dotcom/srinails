import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Checkout.css';

const STEPS = ['Shipping', 'Payment', 'Review'];

const Checkout = () => {
  const { 
    cart, 
    subtotal = 0, 
    shipping = 0, 
    tax = 0, 
    discountAmount = 0, 
    total = 0, 
    clearCart, 
    setDiscountData, // We'll use this to update state from the API
    appliedCoupon,
    removeCoupon
  } = useCart();
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  
  const [shipping_addr, setShipping] = useState({ 
    name: user?.name || '', 
    street: '', 
    city: '', 
    state: '', 
    zip: '', 
    country: 'IN', 
    phone: '' 
  });

  const [paymentMethod, setPaymentMethod] = useState('card');

  // ✅ DYNAMIC COUPON VALIDATION
  const handleApply = async () => {
    if (!couponInput) return toast.error("Please enter a code");
    
    try {
      setLoading(true);
      // Calls your new dynamic backend route
      const { data } = await axios.post('http://localhost:5000/api/coupons/validate', {
        code: couponInput,
        cartTotal: subtotal // Checks minPurchase on backend
      });

      // Update the context with the new discount data
      setDiscountData({
        code: data.code,
        discountValue: data.discountValue,
        offerType: data.offerType
      });

      toast.success(data.message || "Coupon Applied! 💅");
      setCouponInput("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid Coupon");
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("ppn_token");

      // 1. Create Order on Backend
      const { data: orderData } = await axios.post('http://localhost:5000/api/payment/orders', {
        amount: total 
      });

      const options = {
        key: "rzp_test_SfD4JHwbQx6ZE9",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "SriNails",
        description: "Luxury Handcrafted Nails",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post('http://localhost:5000/api/payment/verify', response);

            if (verifyRes.data.success) {
              const finalOrder = {
                user: user.id || user._id, 
                items: cart.map(i => ({ 
                  product: i.product._id,
                  name: i.product.name,
                  image: i.product.images?.[0]?.url, 
                  quantity: i.quantity, 
                  price: i.price,
                  variant: i.variant,
                  size: i.size
                })),
                shippingAddress: shipping_addr,
                payment: { 
                  method: 'Razorpay', 
                  status: 'paid', 
                  transactionId: response.razorpay_payment_id 
                },
                appliedCoupon: appliedCoupon?.code || null,
                subtotal: Number(subtotal),
                total: Number(total),
                status: 'confirmed'
              };

              const { data: savedOrder } = await axios.post('http://localhost:5000/api/orders', finalOrder, {
                headers: { Authorization: `Bearer ${token}` }
              });

              clearCart();
              toast.success('Payment Successful! Order placed 🎉');
              navigate(`/orders/${savedOrder._id}`);
            }
          } catch (err) {
            toast.error("Order saving failed.");
          }
        },
        prefill: {
          name: shipping_addr.name,
          email: user?.email || "customer@srinails.com",
          contact: shipping_addr.phone ? shipping_addr.phone.replace(/\D/g, '') : "9876543210"
        },
        theme: { color: "#4a2535" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Payment initiation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'card') {
      handleRazorpayPayment();
    } else {
      toast.success("COD functionality coming soon!");
    }
  };

  return (
    <div className="checkout-page page-wrapper">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>

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
          <div className="checkout-form-section">
            {step === 0 && (
              <div className="checkout-panel">
                <h2>Shipping Information</h2>
                <div className="form-grid">
                  <div className="form-field full">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" value={shipping_addr.name} onChange={e => setShipping({...shipping_addr, name: e.target.value})} placeholder="Full Name" />
                  </div>
                  <div className="form-field full">
                    <label className="form-label">Street Address</label>
                    <input className="form-input" value={shipping_addr.street} onChange={e => setShipping({...shipping_addr, street: e.target.value})} placeholder="House No, Society, Area" />
                  </div>
                  <div className="form-field">
                    <label className="form-label">City</label>
                    <input className="form-input" value={shipping_addr.city} onChange={e => setShipping({...shipping_addr, city: e.target.value})} placeholder="City" />
                  </div>
                  <div className="form-field">
                    <label className="form-label">State</label>
                    <input className="form-input" value={shipping_addr.state} onChange={e => setShipping({...shipping_addr, state: e.target.value})} placeholder="State" />
                  </div>
                  <div className="form-field"><label className="form-label">ZIP Code</label><input className="form-input" value={shipping_addr.zip} onChange={e => setShipping({...shipping_addr, zip: e.target.value})} placeholder="Pin Code" /></div>
                  <div className="form-field"><label className="form-label">Phone</label><input className="form-input" value={shipping_addr.phone} onChange={e => setShipping({...shipping_addr, phone: e.target.value})} placeholder="+91" /></div>
                </div>
                <button className="btn-primary next-btn" onClick={() => setStep(1)}>Continue to Payment →</button>
              </div>
            )}

            {step === 1 && (
              <div className="checkout-panel">
                <h2>Payment Method</h2>
                <div className="payment-methods">
                  <label className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`}>
                    <input type="radio" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                    <span className="pm-icon">💳</span>
                    <span>Razorpay (UPI, Card, Netbanking)</span>
                  </label>
                </div>
                <div className="step-nav">
                  <button className="btn-secondary" onClick={() => setStep(0)}>← Back</button>
                  <button className="btn-primary next-btn" onClick={() => setStep(2)}>Review Order →</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="checkout-panel">
                <h2>Review Your Order</h2>
                <div className="review-section">
                  <div className="review-block">
                    <div className="review-block-header"><span>📦 Shipping to</span><button className="edit-link" onClick={() => setStep(0)}>Edit</button></div>
                    <p>{shipping_addr.name}<br />{shipping_addr.street}<br />{shipping_addr.city}, {shipping_addr.zip}</p>
                  </div>
                </div>
                <div className="step-nav">
                  <button className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn-primary place-order-btn" onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? 'Processing...' : 'Pay & Place Order 💅'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="order-summary-panel">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cart.map(item => (
                <div key={item.key || item._id} className="summary-item">
                  <div className="summary-item-img">
                    <img src={item.product.images?.[0]?.url} alt="" />
                    <span className="summary-qty">{item.quantity}</span>
                  </div>
                  <span className="summary-item-name">{item.product.name}</span>
                  <span className="summary-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="summary-divider" />

            {/* ✅ DYNAMIC COUPON SECTION */}
            <div className="premium-coupon-section" style={{ margin: '15px 0' }}>
              {appliedCoupon ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(74, 37, 53, 0.05)', padding: '10px 15px', borderRadius: '8px', border: '1px dashed #4a2535' }}>
                  <span style={{ color: '#4a2535', fontWeight: '600', fontSize: '0.85rem' }}>✓ {appliedCoupon.code}</span>
                  <button onClick={removeCoupon} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>REMOVE</button>
                </div>
              ) : (
                <div style={{ display: 'flex', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
                  <input 
                    type="text" 
                    placeholder="COUPON CODE" 
                    value={couponInput} 
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())} 
                    style={{ flex: 1, padding: '10px', border: 'none', outline: 'none', fontSize: '0.8rem' }} 
                  />
                  <button 
                    onClick={handleApply} 
                    disabled={loading}
                    style={{ background: '#4a2535', color: 'white', border: 'none', padding: '0 15px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                  >
                    {loading ? '...' : 'APPLY'}
                  </button>
                </div>
              )}
            </div>

            <div className="summary-row"><span>Subtotal</span><span>₹{(subtotal || 0).toFixed(2)}</span></div>
            {discountAmount > 0 && (<div className="summary-row" style={{ color: "#4a2535", fontWeight: '600' }}><span>Discount</span><span>-₹{(discountAmount || 0).toFixed(2)}</span></div>)}
            <div className="summary-row"><span>Tax (8%)</span><span>₹{(tax || 0).toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${(shipping || 0).toFixed(2)}`}</span></div>
            <div className="summary-divider" />
            <div className="summary-total"><span>Total</span><span>₹{(total || 0).toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;