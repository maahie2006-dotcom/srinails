import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext'; // Un-commented for dynamic checks
import './ProductCard.css';

const Stars = ({ rating }) => (
  <div className="stars">
    {[1, 2, 3, 4, 5].map(i => (
      <span 
        key={i} 
        style={{ 
          color: i <= Math.round(rating || 5) ? '#d4af37' : '#e0e0e0', 
          fontSize: '12px',
          marginRight: '2px' 
        }}
      >
        ★
      </span>
    ))}
  </div>
);

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth(); 
  const navigate = useNavigate();

  // Check if this specific product (from Admin Panel) is already in the user's wishlist
  const wished = typeof isWishlisted === 'function' ? isWishlisted(product._id) : false;

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    // Safety check: User must be logged in to save dynamic data to MongoDB
    if (!user) {
        alert("Please login to add items to your wishlist!");
        navigate('/login');
        return;
    }

    if (product && typeof toggleWishlist === 'function') {
        // This triggers the API call in your WishlistContext to update MongoDB
        await toggleWishlist(product); 
    } else {
        console.warn("Product or toggleWishlist function is missing");
    }
  };

  const image = product.images?.find(i => i.isPrimary)?.url || 
                product.images?.[0]?.url || 
                'https://via.placeholder.com/300x400';

  return (
    <div className="product-card-container">
      <div className="product-image-section">
        <Link to={`/product/${product.slug}`}>
          <img src={image} alt={product.name} className="product-image-main" loading="lazy" />
        </Link>
        
        {/* Badges Overlay */}
        <div className="product-card-tags">
          {product.isBestSeller && <span className="card-tag tag-gold">BEST SELLER</span>}
          {product.isNew && <span className="card-tag tag-blush">NEW</span>}
        </div>

        {/* THE FLOATING GLASS ACTION BOX */}
        <div className="product-floating-glass">
          <button 
            className="action-btn-primary" 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
          >
            QUICK ADD
          </button>
          <Link to={`/product/${product.slug}`} className="action-btn-secondary">
            DETAILS
          </Link>
        </div>

        {/* Wishlist Icon - Styled for Sri Nails Premium Look */}
        <button 
          type="button"
          className={`card-wishlist-icon ${wished ? 'active' : ''}`} 
          onClick={handleWishlistToggle}
          aria-label="Toggle Wishlist"
        >
          {/* Using filled heart when 'wished' is true */}
          {wished ? '❤️' : '♡'}
        </button>
      </div>

      <div className="product-card-body">
        <div className="card-meta">
           <span className="product-card-cat">{product.category}</span>
        </div>
        <Link to={`/product/${product.slug}`} className="product-card-title">
          {product.name}
        </Link>
        <div className="product-card-rating">
          <Stars rating={product.ratings?.average} />
          <span className="product-card-count">({product.ratings?.count || 0})</span>
        </div>
        <div className="product-card-price">
          ₹{product.price?.toLocaleString('en-IN')}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;