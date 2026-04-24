import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext'; 
import './ProductCard.css';

const Stars = ({ rating }) => (
  <div className="stars">
    {[1, 2, 3, 4, 5].map(i => (
      <span   
        key={i} 
        style={{ 
          color: i <= Math.round(rating || 5) ? '#f2f4f5' : '#e0e0e0', 
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

  
  const wished = typeof isWishlisted === 'function' ? isWishlisted(product._id) : false;

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    
   
    if (!user) {
        alert("Please login to add items to your wishlist!");
        navigate('/login');
        return;
    }

    if (product && typeof toggleWishlist === 'function') {
        
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
        
        
        <div className="product-card-tags">
          {product.isBestSeller && <span className="card-tag tag-gold">BEST SELLER</span>}
          {product.isNew && <span className="card-tag tag-blush">NEW</span>}
        </div>

        
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

        
        <button 
          type="button"
          className={`card-wishlist-icon ${wished ? 'active' : ''}`} 
          onClick={handleWishlistToggle}
          aria-label="Toggle Wishlist"
        >
          
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