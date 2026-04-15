import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlist } = useWishlist();
  return (
    <div className="page-wrapper" style={{ padding: '48px 0 80px' }}>
      <div className="container">
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '36px' }}>
          <span className="section-label">Your Collection</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--plum)' }}>My Wishlist 🤍</h1>
        </div>
        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🤍</div>
            <h2 style={{ color: 'var(--plum)', marginBottom: '8px' }}>Your wishlist is empty</h2>
            <p style={{ color: 'var(--mid-gray)', marginBottom: '24px', fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontSize: '1.05rem' }}>Save your favourite styles for later!</p>
            <Link to="/shop" className="btn-primary">Browse Nails</Link>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--mid-gray)', marginBottom: '28px' }}>{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>
            <div className="products-grid">
              {wishlist.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
