import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './ProductReviews.css';

const ProductReviews = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ rating: 5, title: '', comment: '' });

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/api/reviews/product/${productId}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to share your experience! ✨");

    setLoading(true);
    try {
      await axios.post('/api/reviews', { ...formData, product: productId, user: user._id });
      toast.success("Review posted! Your feedback means a lot. 💖");
      setFormData({ rating: 5, title: '', comment: '' });
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="luxe-reviews-container">
      <div className="reviews-header">
        <h2>Client Appraisals</h2>
        <p className="subtitle">Real feedback from our SriNails community</p>
      </div>
      
      {user && (
        <form className="luxe-review-form" onSubmit={handleSubmit}>
          <h3>Write a Review</h3>
          <div className="star-picker">
            {[1, 2, 3, 4, 5].map(star => (
              <span 
                key={star} 
                className={star <= formData.rating ? "star active" : "star"}
                onClick={() => setFormData({ ...formData, rating: star })}
              >★</span>
            ))}
          </div>
          <div className="form-grid">
            <input 
              type="text" 
              placeholder="Give your review a title..." 
              value={formData.title} 
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="luxe-input"
              required
            />
            <textarea 
              placeholder="Share your experience with quality, fit, and design..." 
              value={formData.comment} 
              onChange={e => setFormData({ ...formData, comment: e.target.value })}
              className="luxe-textarea"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-review-submit">
            {loading ? "Publishing..." : "Publish Review"}
          </button>
        </form>
      )}

      <div className="reviews-feed">
        {reviews.length === 0 ? (
          <div className="empty-reviews">No appraisals yet. Be the first to share your experience!</div>
        ) : (
          reviews.map(r => (
            <div key={r._id} className="review-card-item">
              <div className="card-top">
                <div className="user-avatar">{r.user?.name?.charAt(0)}</div>
                <div className="user-meta">
                  <strong>{r.user?.name}</strong>
                  <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="card-stars">{"★".repeat(r.rating)}</div>
              </div>
              <div className="card-content">
                <h4>{r.title}</h4>
                <p>"{r.comment}"</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;