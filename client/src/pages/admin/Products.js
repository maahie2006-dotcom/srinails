import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Admin.css';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', comparePrice: '', category: 'coffin', description: '', stock: '', collection: '', isFeatured: false, isBestSeller: false, isNew: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => { axios.get('/api/products').then(r => setProducts(r.data.products || [])).catch(() => {}).finally(() => setLoading(false)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await axios.post('/api/products', { ...form, price: Number(form.price), comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined, stock: Number(form.stock) });
      setProducts(prev => [data, ...prev]);
      setShowForm(false);
      setForm({ name: '', price: '', comparePrice: '', category: 'coffin', description: '', stock: '', collection: '', isFeatured: false, isBestSeller: false, isNew: true });
      toast.success('Product added!');
    } catch { toast.error('Failed to add product'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await axios.delete(`/api/products/${id}`); setProducts(prev => prev.filter(p => p._id !== id)); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="admin-page page-wrapper">
      <div className="container">
        <div className="admin-header">
          <h1>Products</h1>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Add Product</button>
        </div>

        {showForm && (
          <div className="admin-form-card">
            <h2>New Product</h2>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-grid">
                <div className="form-field"><label className="form-label">Name *</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                <div className="form-field"><label className="form-label">Category *</label>
                  <select className="form-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {['coffin','almond','square','stiletto','round','oval','ballerina','custom'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-field"><label className="form-label">Price *</label><input className="form-input" type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required /></div>
                <div className="form-field"><label className="form-label">Compare Price</label><input className="form-input" type="number" step="0.01" value={form.comparePrice} onChange={e => setForm({...form, comparePrice: e.target.value})} /></div>
                <div className="form-field"><label className="form-label">Stock</label><input className="form-input" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} /></div>
                <div className="form-field"><label className="form-label">Collection</label><input className="form-input" value={form.collection} onChange={e => setForm({...form, collection: e.target.value})} /></div>
                <div className="form-field full"><label className="form-label">Description *</label><textarea className="form-input" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} required /></div>
                <div className="form-field">
                  <label className="form-label">Flags</label>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {[['isFeatured','Featured'],['isBestSeller','Best Seller'],['isNew','New']].map(([k,l]) => (
                      <label key={k} style={{ display:'flex', gap:'6px', alignItems:'center', fontSize:'0.88rem', cursor:'pointer' }}>
                        <input type="checkbox" checked={form[k]} onChange={e => setForm({...form, [k]: e.target.checked})} style={{ accentColor: 'var(--rose)' }} />{l}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Add Product'}</button>
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading ? <div className="admin-empty">Loading...</div> : (
          <div className="admin-table">
            <div className="admin-table-head" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 0.8fr auto' }}>
              <span>Product</span><span>Category</span><span>Price</span><span>Stock</span><span>Status</span><span>Actions</span>
            </div>
            {products.map(p => (
              <div key={p._id} className="admin-table-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 0.8fr auto' }}>
                <span className="product-name-cell">
                  <img src={p.images?.[0]?.url} alt={p.name} style={{ width: 40, height: 48, objectFit: 'cover', borderRadius: '6px', marginRight: '12px' }} />
                  {p.name}
                </span>
                <span style={{ textTransform: 'capitalize' }}>{p.category}</span>
                <span className="price">₹{p.price?.toFixed(2)}</span>
                <span>{p.stock || 0}</span>
                <span><span className={`badge ${p.isActive !== false ? 'badge-new' : 'badge-sale'}`}>{p.isActive !== false ? 'Active' : 'Hidden'}</span></span>
                <button className="admin-delete-btn" onClick={() => handleDelete(p._id)}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { axios.get('/api/orders').then(r => setOrders(r.data.orders || [])).catch(() => {}).finally(() => setLoading(false)); }, []);

  const updateStatus = async (id, status) => {
    try { const { data } = await axios.put(`/api/orders/${id}/status`, { status }); setOrders(prev => prev.map(o => o._id === id ? data : o)); toast.success('Status updated'); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="admin-page page-wrapper">
      <div className="container">
        <div className="admin-header"><h1>Orders</h1></div>
        {loading ? <div className="admin-empty">Loading...</div> : (
          <div className="admin-table">
            <div className="admin-table-head">
              <span>Order #</span><span>Customer</span><span>Date</span><span>Total</span><span>Status</span><span>Update Status</span>
            </div>
            {orders.map(o => (
              <div key={o._id} className="admin-table-row">
                <span className="admin-order-num">{o.orderNumber}</span>
                <span>{o.user?.name || o.user?.email}</span>
                <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                <span className="price">₹{o.total?.toFixed(2)}</span>
                <span><span className={`order-status ${o.status}`}>{o.status}</span></span>
                <select value={o.status} onChange={e => updateStatus(o._id, e.target.value)} className="admin-status-select">
                  {['pending','confirmed','processing','shipped','delivered','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
