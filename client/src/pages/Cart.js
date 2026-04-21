import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    shipping, 
    discount,
    tax, 
    total, 
    itemCount
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="empty-cart page-wrapper">
        <div className="container">
          <div className="empty-cart-inner">
            <div className="cart-empty-emoji">🛒</div>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added any beautiful nails yet!</p>
            <Link to="/shop" className="btn-primary">Start Shopping 💅</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page-wrapper">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Bag</h1>
          <span>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
        </div>

        <div className="cart-layout">
          {/* Items Section */}
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.key} className="cart-item">
                <div className="cart-item-img">
                  <img src={item.product.images?.[0]?.url || 'https://via.placeholder.com/100'} alt={item.product.name} />
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-header">
                    <div>
                      <span className="cart-item-category">{item.product.category}</span>
                      <h3 className="cart-item-name">{item.product.name}</h3>
                      {item.variant && <p className="cart-item-variant">Color: {item.variant.color} · {item.variant.finish}</p>}
                      {item.size && <p className="cart-item-variant">Size: {item.size}</p>}
                    </div>
                    <button className="cart-remove-btn" onClick={() => removeFromCart(item.key)} aria-label="Remove">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>

                  <div className="cart-item-footer">
                    <div className="qty-control">
                      <button onClick={() => updateQuantity(item.key, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.key, item.quantity + 1)}>+</button>
                    </div>
                    <span className="cart-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Section */}
          <div className="cart-summary">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Tax (8%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>

            {/* Discount Row - Only shows when a coupon was applied elsewhere (like Checkout) */}
            {discount > 0 && (
              <div className="summary-row discount-row" style={{ color: '#4a2535', fontWeight: 'bold' }}>
                <span>Discount</span>
                <span>- ₹{discount.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'free-ship' : ''}>
                {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
              </span>
            </div>

            {/* Free Shipping Progress Bar */}
            {shipping > 0 && (
              <div className="free-ship-msg">
                Add <strong>₹{(500 - subtotal).toFixed(2)}</strong> more for free shipping!
                <div className="ship-progress">
                  <div className="ship-bar" style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }} />
                </div>
              </div>
            )}

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <Link to="/checkout" className="btn-primary checkout-btn">Proceed to Checkout →</Link>
            <Link to="/shop" className="continue-shopping">← Continue Shopping</Link>

            <div className="secure-notice">
              <span>🔒</span>
              <span>Secure checkout with SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;