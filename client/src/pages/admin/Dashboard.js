import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Admin.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    products: 0,
    customers: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);

  // 🔐 Protect Admin Route
  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");

    if (!isAdmin) {
      navigate("/admin/login");
    }
  }, [navigate]);

  // 📊 Fetch Data
  useEffect(() => {
    axios.get("/api/orders?limit=5")
      .then(r => {
        const orders = r.data.orders || [];
        setRecentOrders(orders);

        const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);

        setStats(prev => ({
          ...prev,
          orders: r.data.total || orders.length,
          revenue
        }));
      })
      .catch(() => {});

    axios.get("/api/products?limit=1")
      .then(r => {
        setStats(prev => ({
          ...prev,
          products: r.data.total || 0
        }));
      })
      .catch(() => {});
  }, []);

  // 📊 Cards
  const statCards = [
    { label: "Total Orders", value: stats.orders, emoji: "📦", color: "#f2cfc7" },
    { label: "Revenue", value: `₹${stats.revenue.toFixed(2)}`, emoji: "💰", color: "#f0dfc1" },
    { label: "Products", value: stats.products, emoji: "💅", color: "#e8d4e0" },
    { label: "Customers", value: stats.customers, emoji: "👥", color: "#d4e8e0" },
  ];

  return (
    <div className="admin-page page-wrapper">
      <div className="container">

        {/* Header */}
        <div className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back! Here's your store overview.</p>
          </div>

          <div className="admin-quick-links">
            <Link to="/admin/products" className="btn-primary">+ Add Product</Link>
            <Link to="/admin/orders" className="btn-secondary">View Orders</Link>

            {/* 🔐 Logout */}
            <button
              onClick={() => {
                localStorage.removeItem("admin");
                navigate("/admin/login");
              }}
              className="btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          {statCards.map(s => (
            <div key={s.label} className="admin-stat-card" style={{ "--stat-color": s.color }}>
              <div className="stat-emoji">{s.emoji}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Orders */}
        <div className="admin-section">
          <div className="admin-section-header">
            <h2>Recent Orders</h2>
            <Link to="/admin/orders" className="view-all-link">View all →</Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="admin-empty">No orders yet.</div>
          ) : (
            <div className="admin-table">
              <div className="admin-table-head">
                <span>Order #</span>
                <span>Customer</span>
                <span>Date</span>
                <span>Total</span>
                <span>Status</span>
                <span>Action</span>
              </div>

              {recentOrders.map(o => (
                <div key={o._id} className="admin-table-row">
                  <span>{o.orderNumber}</span>
                  <span>{o.user?.name || "Unknown"}</span>
                  <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                  <span>₹{o.total?.toFixed(2)}</span>
                  <span>{o.status}</span>
                  <Link to={`/orders/${o._id}`}>View</Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// // import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import './Admin.css';

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, customers: 0 });
//   const [recentOrders, setRecentOrders] = useState([]);

//   useEffect(() => {
//     axios.get('/api/orders?limit=5').then(r => {
//       const orders = r.data.orders || [];
//       setRecentOrders(orders);
//       const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
//       setStats(prev => ({ ...prev, orders: r.data.total || orders.length, revenue }));
//     }).catch(() => {});
//     axios.get('/api/products?limit=1').then(r => setStats(prev => ({ ...prev, products: r.data.total || 0 }))).catch(() => {});
//   }, []);

//   const statCards = [
//     { label: 'Total Orders', value: stats.orders, emoji: '📦', color: '#f2cfc7' },
//     { label: 'Revenue', value: `₹${stats.revenue.toFixed(2)}`, emoji: '💰', color: '#f0dfc1' },
//     { label: 'Products', value: stats.products, emoji: '💅', color: '#e8d4e0' },
//     { label: 'Customers', value: stats.customers, emoji: '👥', color: '#d4e8e0' },
//   ];

//   return (
//     <div className="admin-page page-wrapper">
//       <div className="container">
//         <div className="admin-header">
//           <div>
//             <h1>Admin Dashboard</h1>
//             <p>Welcome back! Here's your store overview.</p>
//           </div>
//           <div className="admin-quick-links">
//             <Link to="/admin/products" className="btn-primary">+ Add Product</Link>
//             <Link to="/admin/orders" className="btn-secondary">View Orders</Link>
//           </div>
//         </div>

//         {/* Stat cards */}
//         <div className="admin-stats">
//           {statCards.map(s => (
//             <div key={s.label} className="admin-stat-card" style={{ '--stat-color': s.color }}>
//               <div className="stat-emoji">{s.emoji}</div>
//               <div className="stat-value">{s.value}</div>
//               <div className="stat-label">{s.label}</div>
//             </div>
//           ))}
//         </div>

//         {/* Recent orders */}
//         <div className="admin-section">
//           <div className="admin-section-header">
//             <h2>Recent Orders</h2>
//             <Link to="/admin/orders" className="view-all-link">View all →</Link>
//           </div>
//           {recentOrders.length === 0 ? (
//             <div className="admin-empty">No orders yet.</div>
//           ) : (
//             <div className="admin-table">
//               <div className="admin-table-head">
//                 <span>Order #</span><span>Customer</span><span>Date</span><span>Total</span><span>Status</span><span>Action</span>
//               </div>
//               {recentOrders.map(o => (
//                 <div key={o._id} className="admin-table-row">
//                   <span className="admin-order-num">{o.orderNumber}</span>
//                   <span>{o.user?.name || 'Unknown'}</span>
//                   <span>{new Date(o.createdAt).toLocaleDateString()}</span>
//                   <span className="price">₹{o.total?.toFixed(2)}</span>
//                   <span><span className={`order-status ${o.status}`}>{o.status}</span></span>
//                   <Link to={`/orders/${o._id}`} className="admin-action-btn">View</Link>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
