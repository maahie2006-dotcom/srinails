import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Admin.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '', price: '', collection: 'Everyday Glam', image: '',
    isFeatured: false, isBestSeller: false, isNew: true
  });

  // Helper for Headers
  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('ppn_token')}` }
  });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products', getAuthHeader());
      setProducts(res.data.products || res.data || []);
    } catch (err) { 
      toast.error("Session expired."); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        images: [{ url: form.image, isPrimary: true }],
        description: `Premium set from ${form.collection} collection.`
      };

      if (editId) {
        await axios.put(`/api/products/${editId}`, payload, getAuthHeader());
        toast.success("Product Updated");
      } else {
        await axios.post('/api/products', payload, getAuthHeader());
        toast.success("Added to Boutique");
      }
      fetchProducts();
      setShowForm(false);
      setEditId(null);
      resetForm();
    } catch (err) { 
      toast.error("Save failed."); 
    } finally { 
      setSaving(false); 
    }
  };

  // ✅ WORKING REMOVE FUNCTION
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this set from Srinails?')) return;
    
    try {
      // 1. Call the backend delete route
      await axios.delete(`/api/products/${id}`, getAuthHeader());
      
      // 2. Remove from local state so it disappears instantly
      setProducts(prev => prev.filter(product => product._id !== id));
      
      toast.success('Product removed successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove product');
    }
  };

  const handleEdit = (p) => {
    setEditId(p._id);
    setForm({
      name: p.name, price: p.price, collection: p.collection, 
      image: p.images?.[0]?.url, isFeatured: p.isFeatured, 
      isBestSeller: p.isBestSeller, isNew: p.isNew
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ name: '', price: '', collection: 'Everyday Glam', image: '', isFeatured: false, isBestSeller: false, isNew: true });
  };

  return (
    <div className="luxury-admin">
      <div className="container">
        <header className="admin-header-luxe">
          <h1>Srinails Inventory</h1>
          <button className="btn-luxe-main" onClick={() => { setShowForm(!showForm); if(showForm) {setEditId(null); resetForm();} }}>
            {showForm ? "CLOSE PANEL" : "ADD NEW SET"}
          </button>
        </header>

        {showForm && (
          <div className="admin-form-container-luxe">
            <form onSubmit={handleSubmit}>
              <div className="luxe-input-grid">
                <div className="luxe-group">
                  <label>Product Name</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div className="luxe-group">
                  <label>Price (₹)</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
                </div>
                <div className="luxe-group">
                  <label>Collection</label>
                  <select value={form.collection} onChange={e => setForm({...form, collection: e.target.value})}>
                    <option value="Everyday Glam">Everyday Glam</option>
                    <option value="Special Occasion">Special Occasion</option>
                    <option value="Seasonal">Seasonal</option>
                    <option value="Minimalist">Minimalist</option>
                  </select>
                </div>
                <div className="luxe-group">
                  <label>Image URL</label>
                  <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} required />
                </div>
              </div>

              <div className="feature-toggles">
                <div className="toggle-item">
                  <span>Featured</span>
                  <label className="switch">
                    <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} />
                    <span className="slider round"></span>
                  </label>
                </div>
                <div className="toggle-item">
                  <span>Bestseller</span>
                  <label className="switch">
                    <input type="checkbox" checked={form.isBestSeller} onChange={e => setForm({...form, isBestSeller: e.target.checked})} />
                    <span className="slider round"></span>
                  </label>
                </div>
                <div className="toggle-item">
                  <span>New Arrival</span>
                  <label className="switch">
                    <input type="checkbox" checked={form.isNew} onChange={e => setForm({...form, isNew: e.target.checked})} />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>

              <button className="btn-luxe-submit" disabled={saving}>
                {saving ? "SAVING..." : editId ? "UPDATE PRODUCT" : "SAVE TO INVENTORY"}
              </button>
            </form>
          </div>
        )}

        {loading ? <div className="loader">Loading Inventory...</div> : (
          <div className="luxe-inventory-list">
            {products.map(p => (
              <div key={p._id} className="inventory-item">
                <img src={p.images?.[0]?.url} className="item-img" alt="" />
                <div className="item-details">
                  <span className="item-name">{p.name}</span>
                  <span className="item-collection">{p.collection}</span>
                </div>
                <div className="item-price">₹{p.price}</div>
                <div className="item-actions">
                  <button className="btn-action-edit" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="btn-action-remove" onClick={() => handleDelete(p._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;