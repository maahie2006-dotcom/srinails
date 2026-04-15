import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Account.css';

export const Account = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await axios.put('/api/auth/me', form); toast.success('Profile updated!'); }
    catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) return toast.error('Passwords do not match');
    setSaving(true);
    try { await axios.put('/api/auth/password', pwForm); toast.success('Password updated!'); setPwForm({ currentPassword: '', newPassword: '', confirm: '' }); }
    catch { toast.error('Wrong current password'); }
    finally { setSaving(false); }
  };

  return (
    <div className="account-page page-wrapper">
      <div className="container">
        <div className="account-header">
          <div className="account-avatar">{user?.name?.[0] || '?'}</div>
          <div>
            <h1>My Account</h1>
            <p>{user?.email}</p>
          </div>
        </div>
        <div className="account-layout">
          <nav className="account-nav">
            {[['profile', '👤', 'Profile'], ['password', '🔒', 'Password'], ['orders', '📦', 'My Orders'], ['addresses', '📍', 'Addresses']].map(([t, i, l]) => (
              <button key={t} className={`acc-nav-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{i} {l}</button>
            ))}
            <Link to="/wishlist" className="acc-nav-btn">🤍 Wishlist</Link>
          </nav>
          <div className="account-content">
            {tab === 'profile' && (
              <div className="acc-panel">
                <h2>Personal Information</h2>
                <form onSubmit={handleProfileSave} className="acc-form">
                  <div className="form-field"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                  <div className="form-field"><label className="form-label">Email</label><input className="form-input" value={user?.email} disabled style={{ opacity: 0.6 }} /></div>
                  <div className="form-field"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+1 (555) 000-0000" /></div>
                  <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                </form>
              </div>
            )}
            {tab === 'password' && (
              <div className="acc-panel">
                <h2>Change Password</h2>
                <form onSubmit={handlePasswordChange} className="acc-form">
                  <div className="form-field"><label className="form-label">Current Password</label><input className="form-input" type="password" value={pwForm.currentPassword} onChange={e => setPwForm({...pwForm, currentPassword: e.target.value})} /></div>
                  <div className="form-field"><label className="form-label">New Password</label><input className="form-input" type="password" value={pwForm.newPassword} onChange={e => setPwForm({...pwForm, newPassword: e.target.value})} /></div>
                  <div className="form-field"><label className="form-label">Confirm New Password</label><input className="form-input" type="password" value={pwForm.confirm} onChange={e => setPwForm({...pwForm, confirm: e.target.value})} /></div>
                  <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Updating...' : 'Update Password'}</button>
                </form>
              </div>
            )}
            {tab === 'orders' && <OrdersTab />}
            {tab === 'addresses' && <AddressesTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => { axios.get('/api/orders/my').then(r => setOrders(r.data)).catch(() => {}); }, []);
  return (
    <div className="acc-panel">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <div className="empty-orders"><div>📦</div><p>No orders yet</p><Link to="/shop" className="btn-primary">Start Shopping</Link></div>
      ) : (
        <div className="orders-list">
          {orders.map(o => (
            <div key={o._id} className="order-row">
              <div><strong>#{o.orderNumber}</strong><span>{new Date(o.createdAt).toLocaleDateString()}</span></div>
              <div><span className={`order-status ${o.status}`}>{o.status}</span></div>
              <div><strong>₹{o.total?.toFixed(2)}</strong></div>
              <Link to={`/orders/${o._id}`} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>View</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

 const AddressesTab = () => {
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    pincode: ""
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log(address);
    alert("Address Saved ✅ (check console)");
  };

  return (
    <div className="acc-panel">
      <h2>Saved Addresses</h2>

      <div className="acc-form">

        <div className="form-field">
          <label className="form-label">Full Name</label>
          <input
            className="form-input"
            name="fullName"
            value={address.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label className="form-label">Phone</label>
          <input
            className="form-input"
            name="phone"
            value={address.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label className="form-label">Address</label>
          <input
            className="form-input"
            name="addressLine"
            value={address.addressLine}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label className="form-label">City</label>
          <input
            className="form-input"
            name="city"
            value={address.city}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label className="form-label">Pincode</label>
          <input
            className="form-input"
            name="pincode"
            value={address.pincode}
            onChange={handleChange}
          />
        </div>

        <button className="btn-primary" onClick={handleSave}>
          Save Address
        </button>

      </div>
    </div>
  );
};

export default Account;
