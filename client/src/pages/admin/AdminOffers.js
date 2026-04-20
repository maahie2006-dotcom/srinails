import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';


const AdminOffers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ 
        code: '', 
        offerType: 'Percentage', 
        discountValue: '', 
        minPurchase: 0, 
        expiryDate: '' 
    });

    // 📊 Fetch dynamic offers from your boutique database
    const fetchOffers = async () => {
        try {
            const token = localStorage.getItem('ppn_token');
            const { data } = await axios.get('http://localhost:5000/api/coupons', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Handle both direct arrays and object-wrapped arrays
            const couponData = Array.isArray(data) ? data : (data.coupons || []);
            setOffers(couponData);
        } catch (err) {
            console.error("Error fetching coupons:", err);
            setOffers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchOffers(); 
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('ppn_token');
            await axios.post('http://localhost:5000/api/coupons', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Luxury offer created! 💅");
            setFormData({ code: '', offerType: 'Percentage', discountValue: '', minPurchase: 0, expiryDate: '' });
            fetchOffers(); // Refresh the list immediately
        } catch (err) {
            toast.error(err.response?.data?.message || "Error creating offer");
        }
    };

    const deleteOffer = async (id) => {
        if (!window.confirm("Delete this coupon?")) return;
        try {
            const token = localStorage.getItem('ppn_token');
            await axios.delete(`http://localhost:5000/api/coupons/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Offer removed");
            fetchOffers();
        } catch (err) { 
            toast.error("Delete failed"); 
        }
    };

    // 💅 Prevent "Blank Screen" during first load
    if (loading) return (
        <div className="page-wrapper loading-center">
            <h2 className="animate-pulse" style={{ color: 'var(--plum)', fontFamily: 'var(--font-display)' }}>
                💅 Initializing SriNails Offers...
            </h2>
        </div>
    );

    return (
        <div className="page-wrapper">
            <div className="container animate-in">
                {/* --- LUXURY HEADER --- */}
                <header className="section-header">
                    <span className="section-label">MANAGEMENT</span>
                    <h1 className="section-title">Offers & Coupons</h1>
                    <p className="section-subtitle">Create and manage dynamic discounts for your customers</p>
                </header>

                {/* --- CREATION FORM CARD --- */}
                <div className="luxe-card" style={{ maxWidth: '850px', margin: '0 auto 60px', padding: '40px' }}>
                    <h3 style={{ marginBottom: '25px', color: 'var(--plum)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        ✨ Create New Coupon
                    </h3>
                    <form onSubmit={handleSubmit} className="luxe-offer-form">
                        <div className="input-group" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <label className="form-label">Coupon Code</label>
                                <input 
                                    className="form-input" 
                                    type="text" 
                                    placeholder="e.g. SRI10" 
                                    value={formData.code} 
                                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} 
                                    required 
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className="form-label">Offer Type</label>
                                <select 
                                    className="form-input" 
                                    value={formData.offerType} 
                                    onChange={(e) => setFormData({...formData, offerType: e.target.value})}
                                >
                                    <option value="Percentage">Percentage (%)</option>
                                    <option value="Flat">Flat Amount (₹)</option>
                                    <option value="BOGO">BOGO (Buy 1 Get 1)</option>
                                </select>
                            </div>
                        </div>

                        <div className="input-group" style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                            <div style={{ flex: 1 }}>
                                <label className="form-label">Value</label>
                                <input 
                                    className="form-input" 
                                    type="number" 
                                    placeholder="Value" 
                                    value={formData.discountValue} 
                                    onChange={(e) => setFormData({...formData, discountValue: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className="form-label">Min Purchase (₹)</label>
                                <input 
                                    className="form-input" 
                                    type="number" 
                                    value={formData.minPurchase} 
                                    onChange={(e) => setFormData({...formData, minPurchase: e.target.value})} 
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className="form-label">Expiry Date</label>
                                <input 
                                    className="form-input" 
                                    type="date" 
                                    value={formData.expiryDate} 
                                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} 
                                    required 
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                            Launch Offer 💅
                        </button>
                    </form>
                </div>

                {/* --- DISPLAY GRID --- */}
                <div className="products-grid">
                    {offers.length > 0 ? (
                        offers.map(offer => (
                            <div key={offer._id} className="card" style={{ padding: '35px', textAlign: 'center', position: 'relative' }}>
                                <div className="badge badge-new" style={{ position: 'absolute', top: '20px', right: '20px' }}>
                                    {offer.isActive ? 'Active' : 'Paused'}
                                </div>
                                <h4 style={{ fontSize: '1.8rem', margin: '20px 0 10px', letterSpacing: '2px', color: 'var(--plum)' }}>
                                    {offer.code}
                                </h4>
                                <div className="price" style={{ fontSize: '1.6rem', marginBottom: '12px' }}>
                                    {offer.offerType === 'Percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`} OFF
                                </div>
                                <p style={{ color: 'var(--mid-gray)', fontSize: '0.85rem' }}>
                                    Requirement: ₹{offer.minPurchase}+
                                </p>
                                <p style={{ color: 'var(--rose)', fontSize: '0.8rem', marginTop: '8px', fontWeight: '500' }}>
                                    Valid Until: {new Date(offer.expiryDate).toLocaleDateString()}
                                </p>
                                <button 
                                    onClick={() => deleteOffer(offer._id)} 
                                    className="btn-secondary" 
                                    style={{ marginTop: '25px', padding: '12px 24px', fontSize: '0.75rem' }}
                                >
                                    Delete Coupon 🗑️
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="no-offers" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', border: '2px dashed var(--blush)', borderRadius: '30px' }}>
                            <p style={{ fontSize: '1.2rem', color: 'var(--mid-gray)', fontFamily: 'var(--font-accent)', fontStyle: 'italic' }}>
                                Your collection is empty. Create your first boutique coupon above. ✨
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOffers;