// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { Link, NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { useCart } from '../context/CartContext';
// import { useWishlist } from '../context/WishlistContext';
// import './Navbar.css';

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const { itemCount } = useCart();
//   const { count: wishCount } = useWishlist();
//   const [scrolled, setScrolled] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [dropdownOpen, setDropdownOpen] = useState(null);
//   const [activeOffer, setActiveOffer] = useState("✨ Free shipping on orders over ₹500 | Use code SRI10 ✨");
//   const [unreadMessages, setUnreadMessages] = useState(0);
//   const [adminNotifications, setAdminNotifications] = useState(0);
  
//   const navigate = useNavigate();
//   const searchRef = useRef();
//   const timeoutRef = useRef(null);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 40);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     if (searchOpen) searchRef.current?.focus();
//   }, [searchOpen]);

//   useEffect(() => {
//     // Dynamic Announcement Bar Logic
//     axios.get('/api/coupons/latest-active')
//       .then(res => {
//         if (res.data) {
//           const { offerType, code, discountValue } = res.data;
//           let offerText = "";
//           if (offerType === 'BOGO') offerText = `✨ BUY 1 GET 1 FREE! Use code: ${code} ✨`;
//           else if (offerType === 'Flat') offerText = `✨ ₹${discountValue} OFF on your order! Use code: ${code} ✨`;
//           else offerText = `✨ ${discountValue}% OFF Luxury Sets! Use code: ${code} ✨`;
          
//           setActiveOffer(offerText);
//         }
//       })
//       .catch(() => {});

//     const fetchNotifications = () => {
//       if (!user) return;

//       if (user.role === 'admin') {
//         // Updated to your new admin unread count route
//         axios.get('/api/contacts/admin/unread-count')
//           .then(res => setAdminNotifications(res.data.count))
//           .catch(() => {});
//       } 
      
//       if (user.email) {
//         axios.get(`/api/contacts/my-messages/${user.email}`)
//           .then(res => {
//             const unread = res.data.filter(m => !m.isReadByUser).length;
//             setUnreadMessages(unread);
//           })
//           .catch(() => {});
//       }
//     };

//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 30000); 
//     return () => clearInterval(interval);
//   }, [user]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
//       setSearchOpen(false);
//       setSearchQuery('');
//     }
//   };

//   return (
//     <>
//       <div className="announce-bar">
//         <p>{activeOffer}</p>
//       </div>

//       <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
//         <div className="nav-inner container">
//           <div className="nav-left">
//             <NavLink to="/" className="nav-link">Home</NavLink>
//             <NavLink to="/shop" className="nav-link">Shop</NavLink>
//             <NavLink to="/sizing-guide" className="nav-link">Sizing Guide</NavLink>
//             <NavLink to="/how-to-apply" className="nav-link">How To Apply</NavLink>
//             <NavLink to="/about" className="nav-link">About</NavLink>
//             <NavLink to="/contact" className="nav-link">
//               Contact {(unreadMessages > 0 || (user?.role === 'admin' && adminNotifications > 0)) && <span className="nav-dot-small"></span>}
//             </NavLink>
//           </div>

//           <Link to="/" className="nav-logo">
//             <div className="logo-icon">💅</div>
//             <div className="logo-text">
//               <span className="logo-main">SriNails</span>
//               <span className="logo-sub">Nails</span>
//             </div>
//           </Link>

//           <div className="nav-right">
//             <button className="nav-icon-btn" onClick={() => setSearchOpen(!searchOpen)}>
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//                 <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
//               </svg>
//             </button>

//             <Link to="/wishlist" className="nav-icon-btn">
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//                 <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
//               </svg>
//               {wishCount > 0 && <span className="nav-badge">{wishCount}</span>}
//             </Link>

//             {user ? (
//               <div
//                 className="nav-user"
//                 onMouseEnter={() => {
//                   clearTimeout(timeoutRef.current);
//                   setDropdownOpen('user');
//                 }}
//                 onMouseLeave={() => {
//                   timeoutRef.current = setTimeout(() => setDropdownOpen(null), 200);
//                 }}
//               >
//                 <button className="nav-icon-btn">
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//                     <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
//                   </svg>
//                   {(unreadMessages > 0 || adminNotifications > 0) && <span className="nav-dot-profile"></span>}
//                 </button>

//                 {dropdownOpen === 'user' && (
//                   <div className="nav-dropdown user-dropdown">
//                     <div className="user-greeting">Hi, {user.name?.split(' ')[0]}! 👋</div>
                    
//                     {user.role === 'admin' ? (
//                       <>
//                         <div className="dropdown-divider">MY SHOP</div>
//                         <Link to="/admin/dashboard" className="dropdown-item admin-link" onClick={() => setDropdownOpen(null)}>Shop Dashboard</Link>
//                         <Link to="/admin/products" className="dropdown-item" onClick={() => setDropdownOpen(null)}>Nail Sets (Stock)</Link>
                        
//                         {/* ✅ FIXED CLICKABLE LINK BELOW */}
//                         <Link to="/admin/offers" className="dropdown-item" onClick={() => setDropdownOpen(null)}>Offers & Coupons</Link>
                        
//                         <Link to="/admin/orders" className="dropdown-item" onClick={() => setDropdownOpen(null)}>New Sales</Link>
//                         <Link to="/admin/messages" className="dropdown-item" onClick={() => setDropdownOpen(null)}>
//                           Message Inbox 💬 {adminNotifications > 0 && <span className="nav-badge-inline">{adminNotifications}</span>}
//                         </Link>
                        
//                         <div className="dropdown-divider" style={{border: 'none', marginTop: '5px'}}>MY PROFILE</div>
//                         <Link to="/account" className="dropdown-item" onClick={() => setDropdownOpen(null)}>Edit Profile</Link>
//                       </>
//                     ) : (
//                       <>
//                         <Link to="/account" className="dropdown-item" onClick={() => setDropdownOpen(null)}>My Account</Link>
//                         <Link to="/orders" className="dropdown-item" onClick={() => setDropdownOpen(null)}>My Orders</Link>
//                         <Link to="/wishlist" className="dropdown-item" onClick={() => setDropdownOpen(null)}>Wishlist ❤️</Link>
//                         <Link to="/contact" className="dropdown-item" onClick={() => setDropdownOpen(null)}>
//                           Messages {unreadMessages > 0 && <span className="red-dot"></span>}
//                         </Link>
//                       </>
//                     )}
                    
//                     <button className="dropdown-item logout-btn" onClick={() => { logout(); setDropdownOpen(null); }}>Sign Out</button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <Link to="/login" className="nav-icon-btn">
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//                   <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
//                 </svg>
//               </Link>
//             )}

//             <Link to="/cart" className="nav-icon-btn cart-btn">
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//                 <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
//                 <path d="M16 10a4 4 0 0 1-8 0"/>
//               </svg>
//               {itemCount > 0 && <span className="nav-badge cart-badge">{itemCount}</span>}
//             </Link>

//             <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
//               <span className={menuOpen ? 'open' : ''}></span>
//               <span className={menuOpen ? 'open' : ''}></span>
//               <span className={menuOpen ? 'open' : ''}></span>
//             </button>
//           </div>
//         </div>

//         <div className={`search-bar ${searchOpen ? 'open' : ''}`}>
//           <form onSubmit={handleSearch} className="search-form">
//             <input
//               ref={searchRef}
//               type="text"
//               placeholder="Search nail styles..."
//               value={searchQuery}
//               onChange={e => setSearchQuery(e.target.value)}
//               className="search-input"
//             />
//             <button type="submit" className="search-submit">Search</button>
//             <button type="button" className="search-close" onClick={() => setSearchOpen(false)}>✕</button>
//           </form>
//         </div>

//         <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
//           <div className="mobile-links">
//             <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop All</Link>
//             <Link to="/sizing-guide" onClick={() => setMenuOpen(false)}>Sizing Guide</Link>
//             <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
//             {user ? (
//               <>
//                 {user.role === 'admin' ? (
//                   <>
//                     <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)} style={{color: '#d4af37'}}>Admin Dashboard</Link>
//                     <Link to="/admin/offers" onClick={() => setMenuOpen(false)}>Offers & Coupons</Link>
//                   </>
//                 ) : (
//                   <>
//                     <Link to="/account" onClick={() => setMenuOpen(false)}>My Account</Link>
//                     <Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
//                   </>
//                 )}
//                 <button onClick={() => { logout(); setMenuOpen(false); }}>Sign Out</button>
//               </>
//             ) : (
//               <Link to="/login" onClick={() => setMenuOpen(false)}>Sign In</Link>
//             )}
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// };

// export default Navbar;
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  
  // Changed this line to match the export from your WishlistContext
  const { wishlistCount } = useWishlist();
  
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [activeOffer, setActiveOffer] = useState("✨ Free shipping on orders over ₹500 | Use code SRI10 ✨");
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [adminNotifications, setAdminNotifications] = useState(0);
  
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

  useEffect(() => {
    axios.get('/api/coupons/latest-active')
      .then(res => {
        if (res.data) {
          const { offerType, code, discountValue } = res.data;
          let offerText = "";
          if (offerType === 'BOGO') offerText = `✨ BUY 1 GET 1 FREE! Use code: ${code} ✨`;
          else if (offerType === 'Flat') offerText = `✨ ₹${discountValue} OFF on your order! Use code: ${code} ✨`;
          else offerText = `✨ ${discountValue}% OFF Luxury Sets! Use code: ${code} ✨`;
          
          setActiveOffer(offerText);
        }
      })
      .catch(() => {});

    const fetchNotifications = () => {
      if (!user) return;

      if (user.role === 'admin') {
        axios.get('/api/contacts/admin/unread-count')
          .then(res => setAdminNotifications(res.data.count))
          .catch(() => {});
      } 
      
      if (user.email) {
        axios.get(`/api/contacts/my-messages/${user.email}`)
          .then(res => {
            const unread = res.data.filter(m => !m.isReadByUser).length;
            setUnreadMessages(unread);
          })
          .catch(() => {});
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); 
    return () => clearInterval(interval);
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <div className="announce-bar">
        <p>{activeOffer}</p>
      </div>

      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner container">
          <div className="nav-left">
            <NavLink to="/" className="nav-link">Home</NavLink>
            <NavLink to="/shop" className="nav-link">Shop</NavLink>
            <NavLink to="/sizing-guide" className="nav-link">Sizing Guide</NavLink>
            <NavLink to="/how-to-apply" className="nav-link">How To Apply</NavLink>
            <NavLink to="/about" className="nav-link">About</NavLink>
            <NavLink to="/contact" className="nav-link">
              Contact {(unreadMessages > 0 || (user?.role === 'admin' && adminNotifications > 0)) && <span className="nav-dot-small"></span>}
            </NavLink>
          </div>

          <Link to="/" className="nav-logo">
            <div className="logo-icon">💅</div>
            <div className="logo-text">
              <span className="logo-main">SriNails</span>
              <span className="logo-sub">Nails</span>
            </div>
          </Link>

          <div className="nav-right">
            <button className="nav-icon-btn" onClick={() => setSearchOpen(!searchOpen)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            <Link to="/wishlist" className="nav-icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {/* ✅ Dynamically shows 1, 2, 3 etc based on wishlist length */}
              {wishlistCount > 0 && <span className="nav-badge">{wishlistCount}</span>}
            </Link>

            {user ? (
              <div
                className="nav-user"
                onMouseEnter={() => {
                  clearTimeout(timeoutRef.current);
                  setDropdownOpen('user');
                }}
                onMouseLeave={() => {
                  timeoutRef.current = setTimeout(() => setDropdownOpen(null), 200);
                }}
              >
                <button className="nav-icon-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  {(unreadMessages > 0 || adminNotifications > 0) && <span className="nav-dot-profile"></span>}
                </button>

                {dropdownOpen === 'user' && (
                  <div className="nav-dropdown user-dropdown">
                    <div className="user-greeting">Hi, {user.name?.split(' ')[0]}! 👋</div>
                    
                    {user.role === 'admin' ? (
                      <>
                        <div className="dropdown-divider">MY SHOP</div>
                        <Link to="/admin/dashboard" className="dropdown-item admin-link" onClick={() => setDropdownOpen(null)}>Shop Dashboard</Link>
                        <Link to="/admin/products" className="dropdown-item" onClick={() => setDropdownOpen(null)}>Nail Sets (Stock)</Link>
                        <Link to="/admin/offers" className="dropdown-item" onClick={() => setDropdownOpen(null)}>Offers & Coupons</Link>
                        <Link to="/admin/orders" className="dropdown-item" onClick={() => setDropdownOpen(null)}>New Sales</Link>
                        <Link to="/admin/messages" className="dropdown-item" onClick={() => setDropdownOpen(null)}>
                          Message Inbox 💬 {adminNotifications > 0 && <span className="nav-badge-inline">{adminNotifications}</span>}
                        </Link>
                        <div className="dropdown-divider" style={{border: 'none', marginTop: '5px'}}>MY PROFILE</div>
                        <Link to="/account" className="dropdown-item" onClick={() => setDropdownOpen(null)}>Edit Profile</Link>
                      </>
                    ) : (
                      <>
                        <Link to="/account" className="dropdown-item" onClick={() => setDropdownOpen(null)}>My Account</Link>
                        <Link to="/orders" className="dropdown-item" onClick={() => setDropdownOpen(null)}>My Orders</Link>
                        <Link to="/wishlist" className="dropdown-item" onClick={() => setDropdownOpen(null)}>Wishlist ❤️</Link>
                        <Link to="/contact" className="dropdown-item" onClick={() => setDropdownOpen(null)}>
                          Messages {unreadMessages > 0 && <span className="red-dot"></span>}
                        </Link>
                      </>
                    )}
                    <button className="dropdown-item logout-btn" onClick={() => { logout(); setDropdownOpen(null); }}>Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-icon-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </Link>
            )}

            <Link to="/cart" className="nav-icon-btn cart-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {itemCount > 0 && <span className="nav-badge cart-badge">{itemCount}</span>}
            </Link>

            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              <span className={menuOpen ? 'open' : ''}></span>
              <span className={menuOpen ? 'open' : ''}></span>
              <span className={menuOpen ? 'open' : ''}></span>
            </button>
          </div>
        </div>

        <div className={`search-bar ${searchOpen ? 'open' : ''}`}>
          <form onSubmit={handleSearch} className="search-form">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search nail styles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-submit">Search</button>
            <button type="button" className="search-close" onClick={() => setSearchOpen(false)}>✕</button>
          </form>
        </div>

        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <div className="mobile-links">
            <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop All</Link>
            <Link to="/sizing-guide" onClick={() => setMenuOpen(false)}>Sizing Guide</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <>
                    <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)} style={{color: '#d4af37'}}>Admin Dashboard</Link>
                    <Link to="/admin/offers" onClick={() => setMenuOpen(false)}>Offers & Coupons</Link>
                  </>
                ) : (
                  <>
                    <Link to="/account" onClick={() => setMenuOpen(false)}>My Account</Link>
                    <Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
                  </>
                )}
                <button onClick={() => { logout(); setMenuOpen(false); }}>Sign Out</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)}>Sign In</Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;