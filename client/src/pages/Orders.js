import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './Orders.css';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { axios.get('/api/orders/my').then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="loading-center">💅</div>;

  return (
    <div className="orders-page page-wrapper">
      <div className="container">
        <h1>My Orders</h1>
        {orders.length === 0 ? (
          <div className="empty-orders-big">
            <div className="empty-emoji">📦</div>
            <h2>No orders yet</h2>
            <p>Time to treat yourself! 💅</p>
            <Link to="/shop" className="btn-primary">Shop Now</Link>
          </div>
        ) : (
          <div className="orders-table">
            <div className="orders-table-header">
              <span>Order #</span><span>Date</span><span>Items</span><span>Total</span><span>Status</span><span></span>
            </div>
            {orders.map(o => (
              <div key={o._id} className="orders-table-row">
                <span className="order-num">{o.orderNumber}</span>
                <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                <span>{o.items?.length} item{o.items?.length !== 1 ? 's' : ''}</span>
                <span className="price">₹{o.total?.toFixed(2)}</span>
                <span><span className={`order-status ${o.status}`}>{o.status}</span></span>
                <Link to={`/orders/${o._id}`} className="btn-secondary" style={{ padding: '8px 20px', fontSize: '0.8rem' }}>Details</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => { axios.get(`/api/orders/${id}`).then(r => setOrder(r.data)).catch(() => {}); }, [id]);

  if (!order) return <div className="loading-center">💅</div>;

  const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const stepIdx = steps.indexOf(order.status);

  return (
    <div className="order-detail-page page-wrapper">
      <div className="container">
        <div className="order-detail-header">
          <div>
            <Link to="/orders" className="back-link">← Back to Orders</Link>
            <h1>Order {order.orderNumber}</h1>
            <p>Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <span className={`order-status ${order.status}`} style={{ fontSize: '0.9rem', padding: '8px 18px' }}>{order.status}</span>
        </div>

        {/* Progress tracker */}
        {order.status !== 'cancelled' && (
          <div className="order-progress">
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div className={`prog-step ${i <= stepIdx ? 'done' : ''}`}>
                  <div className="prog-circle">{i < stepIdx ? '✓' : i === stepIdx ? '●' : ''}</div>
                  <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                </div>
                {i < steps.length - 1 && <div className={`prog-line ${i < stepIdx ? 'done' : ''}`} />}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="order-detail-layout">
          <div>
            <div className="order-items-card">
              <h3>Items Ordered</h3>
              {order.items?.map((item, i) => (
                <div key={i} className="order-item-row">
                  <img src={item.image || 'https://via.placeholder.com/64'} alt={item.name} />
                  <div className="oi-info">
                    <strong>{item.name}</strong>
                    {item.variant?.color && <span>Color: {item.variant.color}</span>}
                    {item.size && <span>Size: {item.size}</span>}
                    <span>Qty: {item.quantity}</span>
                  </div>
                  <span className="price">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {order.trackingNumber && (
              <div className="tracking-card">
                <h3>📦 Tracking Information</h3>
                <p>Tracking #: <strong>{order.trackingNumber}</strong></p>
              </div>
            )}
          </div>

          <div>
            <div className="order-info-card">
              <h3>Shipping Address</h3>
              <address>
                {order.shippingAddress?.name}<br />
                {order.shippingAddress?.street}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}
              </address>
            </div>
            <div className="order-info-card">
              <h3>Order Summary</h3>
              <div className="summary-row"><span>Subtotal</span><span>₹{order.subtotal?.toFixed(2)}</span></div>
              <div className="summary-row"><span>Shipping</span><span>{order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost?.toFixed(2)}`}</span></div>
              <div className="summary-row"><span>Tax</span><span>₹{order.tax?.toFixed(2)}</span></div>
              <div className="summary-divider" style={{ height: '1px', background: 'var(--blush)', margin: '12px 0' }} />
              <div className="summary-total"><span>Total</span><span>₹{order.total?.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
