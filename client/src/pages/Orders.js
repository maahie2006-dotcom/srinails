import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('ppn_token');
        const { data } = await axios.get('http://localhost:5000/api/orders/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="loading-center">💅</div>;

  return (
    <div className="orders-page page-wrapper">
      <div className="container">
        <h1 className="luxe-title">My Luxury Orders</h1>
        {orders.length === 0 ? (
          <div className="empty-orders-big">
            <div className="empty-emoji">📦</div>
            <h2>No orders yet</h2>
            <p>Time to treat yourself to some SriNails! 💅</p>
            <Link to="/shop" className="btn-primary">Shop Now</Link>
          </div>
        ) : (
          <div className="orders-table">
            <div className="orders-table-header">
              <span>Order #</span>
              <span>Date</span>
              <span>Items</span>
              <span>Total</span>
              <span>Status</span>
              <span>Action</span>
            </div>
            {orders.map(o => (
              <div key={o._id} className="orders-table-row">
                <span className="order-num">{o.orderNumber}</span>
                <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                <span>{o.items?.length} Set{o.items?.length !== 1 ? 's' : ''}</span>
                <span className="price">₹{o.total?.toFixed(2)}</span>
                <span>
                  <span className={`status-badge ${o.status}`}>{o.status}</span>
                </span>
                <Link to={`/orders/${o._id}`} className="btn-luxe-details">View Details</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;