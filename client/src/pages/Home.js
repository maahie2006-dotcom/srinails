// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import ProductCard from '../components/ProductCard';
// import './Home.css';

// const Home = () => {
//   const [products, setProducts] = useState([]); // ✅ Initialized empty to remove static products
//   const [reviews, setReviews] = useState([]); 
//   const [activeTestimonial, setActiveTestimonial] = useState(0);
//   const [loading, setLoading] = useState(true);

//   // 1. Fetch REAL Featured Products from MongoDB
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get('/api/products?featured=true&limit=4');
//         const fetchedProducts = res.data.products || res.data;
//         if (Array.isArray(fetchedProducts)) {
//           setProducts(fetchedProducts);
//         }
//       } catch (err) {
//         console.error("Error fetching featured products:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // 2. Fetch REAL Customer Reviews
//   useEffect(() => {
//     const fetchHomeReviews = async () => {
//       try {
//         const res = await axios.get('/api/reviews');
//         if (res.data && res.data.length > 0) {
//           setReviews(res.data.slice(0, 6)); 
//         }
//       } catch (err) {
//         console.error("Error loading reviews:", err);
//       }
//     };
//     fetchHomeReviews();
//   }, []);

//   // 3. Testimonial Timer Logic
//   useEffect(() => {
//     if (reviews.length <= 1) return;
//     const timer = setInterval(() => {
//       setActiveTestimonial(p => (p + 1) % reviews.length);
//     }, 6000); 
//     return () => clearInterval(timer);
//   }, [reviews]);

//   return (
//     <div className="home">
//       {/* Hero Section */}
//       <section className="hero">
//         <div className="hero-bg">
//           <div className="hero-orb orb-1" />
//           <div className="hero-orb orb-2" />
//           <div className="hero-orb orb-3" />
//         </div>
//         <div className="container hero-content">
//           <div className="hero-text">
//             <span className="hero-eyebrow">✦ Handcrafted with love ✦</span>
//             <h1 className="hero-title">Salon-Perfect<br /><em>Nails at Home</em></h1>
//             <p className="hero-desc">
//               Luxury press-on nails designed for the modern woman. Wear up to 3 weeks, 
//               apply in minutes — no appointment needed.
//             </p>
//             <div className="hero-actions">
//               <Link to="/shop" className="btn-primary">Shop the Collection</Link>
//               <Link to="/how-to-apply" className="btn-ghost">How To Apply →</Link>
//             </div>
//             <div className="hero-stats">
//               <div className="stat"><strong>10K+</strong><span>Happy Customers</span></div>
//               <div className="stat-divider" />
//               <div className="stat"><strong>4.9★</strong><span>Average Rating</span></div>
//               <div className="stat-divider" />
//               <div className="stat"><strong>50+</strong><span>Designs</span></div>
//             </div>
//           </div>
//           <div className="hero-visual">
//             <div className="hero-img-wrap">
//               <img src="https://i.pinimg.com/1200x/f8/80/96/f88096217ce1c03f92fd6fbef7dce260.jpg" alt="SriNails Luxury Art" />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Trust Bar */}
//       <section className="trust-bar">
//         <div className="container trust-inner">
//           {[
//             { icon: '🚚', label: 'Free Shipping', sub: 'On orders over ₹500' },
//             { icon: '💝', label: 'Made with Care', sub: 'Handcrafted designs' },
//             { icon: '🔄', label: 'Easy Returns', sub: '30-day guarantee' },
//             { icon: '✨', label: 'Salon Quality', sub: 'Premium materials' },
//           ].map(t => (
//             <div key={t.label} className="trust-item">
//               <span className="trust-icon">{t.icon}</span>
//               <div><strong>{t.label}</strong><span>{t.sub}</span></div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Featured Products Section */}
//       <section className="featured-section">
//         <div className="container">
//           <div className="section-header">
//             <span className="section-label">Editor's Picks</span>
//             <h2 className="section-title">Trending Right Now</h2>
//             <p className="section-subtitle">Our most-loved styles, curated just for you</p>
//           </div>
          
//           <div className="products-grid">
//             {loading ? (
//               <div className="luxe-loader-text">Curating the collection... ✨</div>
//             ) : products.length > 0 ? (
//               products.map(p => <ProductCard key={p._id} product={p} />)
//             ) : (
//               <div className="empty-state-text">New designs coming soon! Stay tuned.</div>
//             )}
//           </div>
          
//           <div className="section-cta">
//             <Link to="/shop" className="btn-secondary">View All Products</Link>
//           </div>
//         </div>
//       </section>

//       {/* How it works */}
//       <section className="how-section">
//         <div className="container">
//           <div className="section-header">
//             <span className="section-label">Simple as 1-2-3</span>
//             <h2 className="section-title">Gorgeous Nails in Minutes</h2>
//           </div>
//           <div className="steps-grid">
//             {[
//               { n: '01', title: 'Choose Your Style', desc: 'Browse 50+ stunning designs and pick your perfect shape & finish.', emoji: '💅' },
//               { n: '02', title: 'Prep Your Nails', desc: 'Clean, buff and size your nails for the best fit and longest wear.', emoji: '✨' },
//               { n: '03', title: 'Apply & Slay', desc: 'Press on and go — up to 3 weeks of flawless, salon-perfect nails.', emoji: '🌟' },
//             ].map(step => (
//               <div key={step.n} className="step-card">
//                 <div className="step-num">{step.n}</div>
//                 <div className="step-emoji">{step.emoji}</div>
//                 <h3>{step.title}</h3>
//                 <p>{step.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Newsletter Section */}
//       <section className="newsletter-section">
//         <div className="container">
//           <div className="newsletter-inner">
//             <div className="newsletter-text">
//               <span className="section-label">Stay in the loop</span>
//               <h2>Get 10% Off Your First Order</h2>
//               <p>Subscribe for exclusive deals, new arrivals, and nail inspo delivered to your inbox.</p>
//             </div>
//             <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
//               <input type="email" placeholder="Your email address" className="newsletter-input" required />
//               <button type="submit" className="btn-primary">Subscribe ✨</button>
//             </form>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]); 
  const [reviews, setReviews] = useState([]); 
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. Fetch REAL Featured Products from MongoDB
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/products?featured=true&limit=4');
        const fetchedProducts = res.data.products || res.data;
        if (Array.isArray(fetchedProducts)) {
          setProducts(fetchedProducts);
        }
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Fetch REAL Customer Reviews
  useEffect(() => {
    const fetchHomeReviews = async () => {
      try {
        const res = await axios.get('/api/reviews');
        if (res.data && res.data.length > 0) {
          setReviews(res.data.slice(0, 6)); 
        }
      } catch (err) {
        console.error("Error loading reviews:", err);
      }
    };
    fetchHomeReviews();
  }, []);

  // 3. Testimonial Timer Logic
  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => {
      setActiveTestimonial(p => (p + 1) % reviews.length);
    }, 6000); 
    return () => clearInterval(timer);
  }, [reviews]);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
          <div className="hero-orb orb-3" />
        </div>
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-eyebrow">✦ Handcrafted with love ✦</span>
            <h1 className="hero-title">Salon-Perfect<br /><em>Nails at Home</em></h1>
            <p className="hero-desc">
              Luxury press-on nails designed for the modern woman. Wear up to 3 weeks, 
              apply in minutes — no appointment needed.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn-primary">Shop the Collection</Link>
              <Link to="/how-to-apply" className="btn-ghost">How To Apply →</Link>
            </div>
            <div className="hero-stats">
              <div className="stat"><strong>10K+</strong><span>Happy Customers</span></div>
              <div className="stat-divider" />
              <div className="stat"><strong>4.9★</strong><span>Average Rating</span></div>
              <div className="stat-divider" />
              <div className="stat"><strong>50+</strong><span>Designs</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-img-wrap">
              <img src="https://i.pinimg.com/1200x/f8/80/96/f88096217ce1c03f92fd6fbef7dce260.jpg" alt="SriNails Luxury Art" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="trust-bar">
        <div className="container trust-inner">
          {[
            { icon: '🚚', label: 'Free Shipping', sub: 'On orders over ₹500' },
            { icon: '💝', label: 'Made with Care', sub: 'Handcrafted designs' },
            { icon: '🔄', label: 'Easy Returns', sub: '30-day guarantee' },
            { icon: '✨', label: 'Salon Quality', sub: 'Premium materials' },
          ].map(t => (
            <div key={t.label} className="trust-item">
              <span className="trust-icon">{t.icon}</span>
              <div><strong>{t.label}</strong><span>{t.sub}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Editor's Picks</span>
            <h2 className="section-title">Trending Right Now</h2>
            <p className="section-subtitle">Our most-loved styles, curated just for you</p>
          </div>
          
          {/* Apply the logic to center single products */}
          <div className={`products-grid ${products.length === 1 ? 'single-product' : ''}`}>
            {loading ? (
              <div className="luxe-loader-text">Curating the collection... ✨</div>
            ) : products.length > 0 ? (
              products.map(p => <ProductCard key={p._id} product={p} />)
            ) : (
              <div className="empty-state-text">New designs coming soon! Stay tuned.</div>
            )}
          </div>
          
          <div className="section-cta">
            <Link to="/shop" className="btn-secondary">View All Products</Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Simple as 1-2-3</span>
            <h2 className="section-title">Gorgeous Nails in Minutes</h2>
          </div>
          <div className="steps-grid">
            {[
              { n: '01', title: 'Choose Your Style', desc: 'Browse 50+ stunning designs and pick your perfect shape & finish.', emoji: '💅' },
              { n: '02', title: 'Prep Your Nails', desc: 'Clean, buff and size your nails for the best fit and longest wear.', emoji: '✨' },
              { n: '03', title: 'Apply & Slay', desc: 'Press on and go — up to 3 weeks of flawless, salon-perfect nails.', emoji: '🌟' },
            ].map(step => (
              <div key={step.n} className="step-card">
                <div className="step-num">{step.n}</div>
                <div className="step-emoji">{step.emoji}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-inner">
            <div className="newsletter-text">
              <span className="section-label">Stay in the loop</span>
              <h2>Get 10% Off Your First Order</h2>
              <p>Subscribe for exclusive deals, new arrivals, and nail inspo delivered to your inbox.</p>
            </div>
            <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Your email address" className="newsletter-input" required />
              <button type="submit" className="btn-primary">Subscribe ✨</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;