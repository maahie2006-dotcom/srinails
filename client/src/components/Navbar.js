import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { count: wishCount } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const navigate = useNavigate();
  const searchRef = useRef();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const categories = [
    { label: 'Coffin', path: '/shop/coffin' },
    { label: 'Almond', path: '/shop/almond' },
    { label: 'Square', path: '/shop/square' },
    { label: 'Stiletto', path: '/shop/stiletto' },
    { label: 'Round', path: '/shop/round' },
    { label: 'Ballerina', path: '/shop/ballerina' },
    { label: 'Custom Sets', path: '/shop/custom' },
  ];

  return (
    <>
      {/* Announcement bar */}
      <div className="announce-bar">
        <p>✨ Free shipping on orders over ₹500 &nbsp;|&nbsp; Use code <strong>SRI10</strong> for 10% off ✨</p>
      </div>

      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner container">
          {/* Left links */}
          <div className="nav-left">
            {/* <NavLink to="/shop" className="nav-link" onMouseEnter={() => setDropdownOpen('shop')} onMouseLeave={() => setDropdownOpen(null)}> */}
                <NavLink to="/shop" className="nav-link">
              Shop
              {/* {dropdownOpen === 'shop' && (
                <div className="nav-dropdown" onMouseEnter={() => setDropdownOpen('shop')} onMouseLeave={() => setDropdownOpen(null)}>
                  <div className="dropdown-grid">
                    {categories.map(c => (
                      <Link key={c.path} to={c.path} className="dropdown-item" onClick={() => setDropdownOpen(null)}>
                        <span className="dropdown-label">{c.label}</span>
                      </Link>
                    ))}
                    <Link to="/shop" className="dropdown-item dropdown-all" onClick={() => setDropdownOpen(null)}>
                      <span className="dropdown-label">All Styles →</span>
                    </Link>
                  </div>
                </div>
              )} */}
            </NavLink>
            <NavLink to="/sizing-guide" className="nav-link">
  Sizing Guide
</NavLink>
            <NavLink to="/how-to-apply" className="nav-link">How To Apply</NavLink>
            <NavLink to="/about" className="nav-link">About</NavLink>
          </div>

          {/* Logo */}
          <Link to="/" className="nav-logo">
            <div className="logo-icon">💅</div>
            <div className="logo-text">
              <span className="logo-main">SriNails</span>
              <span className="logo-sub">Nails</span>
            </div>
          </Link>

          {/* Right icons */}
          <div className="nav-right">
            <button className="nav-icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            <Link to="/wishlist" className="nav-icon-btn" aria-label="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishCount > 0 && <span className="nav-badge">{wishCount}</span>}
            </Link>

            {user ? (
             <div
  className="nav-user"
  onMouseEnter={() => {
    clearTimeout(timeoutRef.current);
    setDropdownOpen('user');
  }}
  onMouseLeave={() => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(null);
    }, 200); // delay = smooth fix
  }}
>
                <button className="nav-icon-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </button>
                {dropdownOpen === 'user' && (
                  <div className="nav-dropdown user-dropdown">
                    <div className="user-greeting">Hi, {user.name?.split(' ')[0]}! 👋</div>
                    <Link to="/account" className="dropdown-item" onClick={() => setDropdownOpen(null)}>My Account</Link>
                    <Link to="/orders" className="dropdown-item" onClick={() => setDropdownOpen(null)}>My Orders</Link>
                    <Link to="/wishlist" className="dropdown-item" onClick={() => setDropdownOpen(null)}>Wishlist</Link>
                    {user.role === 'admin' && <Link to="/admin" className="dropdown-item admin-link" onClick={() => setDropdownOpen(null)}>Admin Panel</Link>}
                    <button className="dropdown-item logout-btn" onClick={() => { logout(); setDropdownOpen(null); }}>Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-icon-btn" aria-label="Account">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </Link>
            )}

            <Link to="/cart" className="nav-icon-btn cart-btn" aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {itemCount > 0 && <span className="nav-badge cart-badge">{itemCount}</span>}
            </Link>

            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <span className={menuOpen ? 'open' : ''}></span>
              <span className={menuOpen ? 'open' : ''}></span>
              <span className={menuOpen ? 'open' : ''}></span>
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className={`search-bar ${searchOpen ? 'open' : ''}`}>
          <form onSubmit={handleSearch} className="search-form">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search for nail styles, collections..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-submit">Search</button>
            <button type="button" className="search-close" onClick={() => setSearchOpen(false)}>✕</button>
          </form>
        </div>

        {/* Mobile menu */}
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <div className="mobile-links">
            <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop All</Link>
            {categories.map(c => <Link key={c.path} to={c.path} onClick={() => setMenuOpen(false)}>{c.label}</Link>)}
            <Link to="/sizing-guide" onClick={() => setMenuOpen(false)}>
  Sizing Guide
</Link>
            <Link to="/how-to-apply" onClick={() => setMenuOpen(false)}>How To Apply</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
            {user ? (
              <>
                <Link to="/account" onClick={() => setMenuOpen(false)}>My Account</Link>
                <Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
                <button onClick={() => { logout(); setMenuOpen(false); }}>Sign Out</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)}>Sign In / Register</Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
