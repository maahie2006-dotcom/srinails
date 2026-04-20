import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AdminOrders.css';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('ppn_token');
            const { data } = await axios.get('http://localhost:5000/api/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Handle multiple data structures (Direct array or { orders: [] })
            if (Array.isArray(data)) {
                setOrders(data);
            } else if (data && Array.isArray(data.orders)) {
                setOrders(data.orders);
            } else {
                setOrders([]);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            toast.error("Failed to load boutique orders");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('ppn_token');
            await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Order updated to: ${status.toUpperCase()} ✨`);
            fetchOrders();
        } catch (err) {
            toast.error("Status update failed");
        }
    };

    if (loading) return <div className="loading-center">💅 Loading Boutique Orders...</div>;

    return (
        <div className="admin-orders-page page-wrapper">
            <div className="container animate-in">
                <header className="admin-header-flex">
                    <div className="admin-title-group">
                        <h1 className="luxe-title">Manage Orders</h1>
                        <p className="luxe-subtitle">Track and process your press-on sales</p>
                    </div>
                    <div className="order-count-badge">
                        {orders.length} Total Transactions
                    </div>
                </header>

                <div className="admin-table-wrapper luxe-card">
                    <table className="luxe-admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Total Amount</th>
                                <th>Status</th>
                                <th>Order Date</th>
                                <th>Quick Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order._id}>
                                        <td className="order-num-cell">
                                            #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td>
                                            <div className="customer-info">
                                                <strong>{order.shippingAddress?.name || order.user?.name || "Guest User"}</strong>
                                                <span>{order.shippingAddress?.city || "Online"}</span>
                                            </div>
                                        </td>
                                        <td className="price-cell">₹{order.total?.toLocaleString()}</td>
                                        <td>
                                            <span className={`status-badge ${order.status?.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="date-cell">
                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td>
                                            <select 
                                                className="status-select"
                                                value={order.status} 
                                                onChange={(e) => updateStatus(order._id, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="no-data-cell">
                                        No orders found in the boutique yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;