import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './Wishlist.css'; 

const Wishlist = () => {
 
  const { state, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  
  const items = state?.items || [];
  const loading = state?.loading ?? true;

 
  const backendUrl = "http://localhost:5000";

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to bag! ✨`);
  };

  if (loading) {
    return (
      <div className="sri-nails-wishlist luxe-loading-state">
        <div className="spinner-gold"></div>
        <p>Opening the Studio doors...</p>
      </div>
    );
  }

  return (
    <div className="sri-nails-wishlist">
      <div className="wishlist-hero">
        <span className="brand-badge">SRINAILS LUXE</span>
        <h1>My Collection</h1>
        <p>Your curated selection of premium press-on sets.</p>
      </div>
      
      {items.length === 0 ? (
        <div className="empty-wishlist-state">
          <div className="empty-heart-icon">♡</div>
          <p>Your wishlist is currently empty.</p>
          <Link to="/shop" className="cta-button-outline">
            Explore Studio
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {items.map((item) => {
           
            const product = item.productId;
            
            
            if (!product || typeof product === 'string') {
              return (
                <div key={item._id} className="wishlist-card error-card">
                   <p>Updating product details...</p>
                   
                   <button onClick={() => toggleWishlist({ _id: product })}>Remove</button>
                </div>
              );
            }

            
            const imagePath = product.images && product.images.length > 0 
              ? product.images[0].url 
              : product.image;

            let fullImageUrl = 'https://via.placeholder.com/400x500?text=SriNails';
            
            if (imagePath) {
              fullImageUrl = imagePath.startsWith('http') 
                ? imagePath 
                : `${backendUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
            }

            return (
              <div key={item._id} className="wishlist-card">
                <div className="image-box">
                  <Link to={`/product/${product.slug}`}>
                    <img 
                      src={fullImageUrl} 
                      alt={product.name} 
                      className="wishlist-main-img"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500?text=Image+Not+Found'; }}
                    />
                  </Link>
                  
                  <button 
                    className="remove-btn" 
                    onClick={() => toggleWishlist(product)}
                    aria-label="Remove"
                  >
                    ✕
                  </button>
                </div>

                <div className="content-box">
                  <span className="category-tag">{product.category || 'Luxury Set'}</span>
                  <h3>{product.name}</h3>
                  <div className="price">₹{product.price?.toLocaleString('en-IN')}</div>
                  
                  <button 
                    className="cta-button"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;