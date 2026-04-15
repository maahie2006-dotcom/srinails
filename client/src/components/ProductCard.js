import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

const Stars = ({ rating }) => (
  <div className="stars" aria-label={`${rating} stars`}>
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ color: i <= Math.round(rating) ? 'var(--gold)' : 'var(--blush)' }}>★</span>
    ))}
  </div>
);

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const image = product.images?.find(i => i.isPrimary)?.url || product.images?.[0]?.url || 'https://i.pinimg.com/1200x/d6/ca/04/d6ca0458395d778a769e60020fbfbb55.jpg'
  const wished = isWishlisted(product._id);
  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : null;

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        <Link to={`/product/${product.slug}`}>
          <img src={image} alt={product.name} className="product-img" loading="lazy" />
          <div className="product-img-overlay" />
        </Link>

        {/* Badges */}
        <div className="product-badges">
          {product.isNew && <span className="badge badge-new">New</span>}
          {product.isBestSeller && <span className="badge badge-bestseller">Best Seller</span>}
          {discount && <span className="badge badge-sale">-{discount}%</span>}
        </div>

        {/* Wishlist */}
        <button
          className={`wishlist-btn ${wished ? 'wished' : ''}`}
          onClick={() => toggleWishlist(product)}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wished ? '♥' : '♡'}
        </button>

        {/* Quick add */}
        <div className="product-quick-add">
          <button className="quick-add-btn" onClick={() => addToCart(product)}>
            + Quick Add
          </button>
          <Link to={`/product/${product.slug}`} className="quick-view-btn">View Details</Link>
        </div>
      </div>

      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <Link to={`/product/${product.slug}`} className="product-name">{product.name}</Link>
        {product.ratings?.count > 0 && (
          <div className="product-rating">
            <Stars rating={product.ratings.average} />
            <span className="rating-count">({product.ratings.count})</span>
          </div>
        )}
       <div className="product-price-row">
  <span className="price">₹{product.price.toLocaleString('en-IN')}</span>
  {product.comparePrice && (
    <span className="price-compare">
      ₹{product.comparePrice.toLocaleString('en-IN')}
    </span>
  )}
</div>
      </div>
    </div>
  );
};

export default ProductCard;
