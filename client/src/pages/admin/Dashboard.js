import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Admin.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    unreadMessages: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);

  // 🔐 Protect Admin Route
  useEffect(() => {
    const token = localStorage.getItem("ppn_token");
    const isAdmin = localStorage.getItem("admin");
    
    if (!token || isAdmin !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  // 📊 Fetch Business Data
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('ppn_token');
      const headers = { Authorization: `Bearer ${token}` };

      const [ordersRes, msgRes] = await Promise.all([
        axios.get("http://localhost:5000/api/orders", { headers }),
        axios.get("http://localhost:5000/api/contacts/admin/unread-count", { headers })
          .catch(() => ({ data: { count: 0 } }))
      ]);

      const allOrders = ordersRes.data.orders || ordersRes.data || [];
      setRecentOrders(allOrders.slice(0, 5));

      const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);

      setStats({
        orders: allOrders.length,
        revenue: totalRevenue,
        unreadMessages: msgRes.data.count || 0
      });

    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { 
      label: "Revenue", 
      value: `₹${stats.revenue.toLocaleString('en-IN')}`, 
      emoji: "💰", 
      color: "#f0dfc1",
      path: "/admin/orders" 
    },
    { 
      label: "Total Orders", 
      value: stats.orders, 
      emoji: "📦", 
      color: "#f2cfc7",
      path: "/admin/orders" 
    },
  ];

  if (loading) return <div className="loading-center">💅 Polishing SriNails Dashboard...</div>;

  return (
    <div className="admin-page dashboard-wrapper page-wrapper">
      <div className="container animate-in">

        {/* --- LUXURY ADMIN HEADER --- */}
        <header className="admin-main-header">
          <div className="header-title">
            <h1>SriNails Overview</h1>
            <p>Welcome back, Mahi. Your studio is looking great today.</p>
          </div>

          <div className="admin-actions-group">
            <div className="personal-admin-links">
              <Link to="/admin/offers" className="luxe-icon-link">🎫 Coupons</Link>
              <Link to="/admin/messages" className="luxe-icon-link inbox-link-container">
                💬 Inbox {stats.unreadMessages > 0 && <span className="nav-dot-small">{stats.unreadMessages}</span>}
              </Link>
            </div>
            
            <div className="action-btns">
              {/* ✅ CHANGED: Using btn-luxe-dark for Maroon branding */}
              <Link to="/admin/products" className="btn-luxe-dark">+ New Set</Link>
              
              <button
                onClick={() => {
                  localStorage.removeItem("admin");
                  localStorage.removeItem("ppn_token");
                  navigate("/login");
                }}
                /* ✅ CHANGED: Using btn-luxe-outline to remove yellow logout */
                className="btn-luxe-outline"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* --- STATS GRID --- */}
        <section className="stats-grid">
          {statCards.map(s => (
            <Link to={s.path} key={s.label} className="stat-card-anchor">
              <div className="stat-card-luxe" style={{ borderLeft: `5px solid ${s.color}` }}>
                <div className="stat-info">
                  <div className="label-row">
                      <span className="stat-label">{s.label}</span>
                  </div>
                  <h2 className="stat-number">{s.value}</h2>
                </div>
                <div className="stat-icon-bg" style={{ backgroundColor: s.color }}>{s.emoji}</div>
              </div>
            </Link>
          ))}
        </section>

        {/* --- RECENT ACTIVITY --- */}
        <section className="admin-content-section luxe-card">
          <div className="section-header-luxe" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h2>Recent Store Orders</h2>
            <Link to="/admin/orders" className="text-link" style={{color: '#a84d4d', fontWeight: '600'}}>View All Orders →</Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="empty-state-luxe">
              <p>No customer orders yet. Time to market your sets! 💅</p>
            </div>
          ) : (
            <div className="luxe-table-wrapper">
              <table className="luxe-admin-table">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>CUSTOMER</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(o => (
                    <tr key={o._id}>
                      <td className="bold-text">#{o.orderNumber || o._id.slice(-6).toUpperCase()}</td>
                      <td>
                        <div className="customer-cell">
                          <strong>{o.shippingAddress?.name || o.user?.name || "Guest User"}</strong>
                          <span style={{fontSize: '0.7rem', opacity: 0.6}}>{o.shippingAddress?.city || "Online"}</span>
                        </div>
                      </td>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="price-text" style={{fontWeight: '700'}}>₹{o.total?.toLocaleString('en-IN')}</td>
                      <td>
                        <span className={`status-pill ${o.status?.toLowerCase()}`}>
                          {o.status}
                        </span>
                      </td>
                      <td>
                        {/* ✅ CHANGED: Swapped yellow Review for luxury Outline button */}
                        <Link 
                          to={`/admin/orders/${o._id}`} 
                          className="btn-luxe-outline" 
                          style={{padding: '5px 15px', fontSize: '0.7rem'}}
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default AdminDashboard;