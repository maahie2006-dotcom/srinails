import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Home.css';

const MOCK_PRODUCTS = [
  { _id: '1', name: 'Rosé Dreams', slug: 'rose-dreams', price: 600,  category: 'almond', images: [{ url: 'https://i.pinimg.com/1200x/24/15/b0/2415b05294173f924453df503dc8fd7f.jpg', isPrimary: true }], isBestSeller: true, ratings: { average: 4.8, count: 124 }, isNew: false },
  { _id: '2', name: 'Midnight Velvet', slug: 'midnight-velvet', price: 700, category: 'almond', images: [{ url: 'https://i.pinimg.com/1200x/77/61/1c/77611cd6c3bf2812cd02da22896f33ab.jpg', isPrimary: true }], isNew: true, ratings: { average: 4.9, count: 87 } },
  { _id: '3', name: 'Cherry Blossom', slug: 'cherry-blossom', price: 800,  category: 'almond', images: [{ url: 'https://i.pinimg.com/1200x/1a/d7/8a/1ad78aa1960137d6772aeeb7c6ced99d.jpg', isPrimary: true }], ratings: { average: 4.7, count: 203 } },
  { _id: '4', name: 'Golden Hour', slug: 'golden-hour', price: 900, category: 'almond', images: [{ url: 'https://i.pinimg.com/1200x/cc/79/be/cc79bebf9eae91f6ff60ed1bf189e4cf.jpg', isPrimary: true }], isFeatured: true, ratings: { average: 5.0, count: 56 } },
];

const COLLECTIONS = [
  { name: 'Coffin', emoji: '⬟', desc: 'Bold & dramatic', path: '/shop/coffin', color: '#f2cfc7' },
  { name: 'Almond', emoji: '◇', desc: 'Soft & feminine', path: '/shop/almond', color: '#f0dfc1' },
  { name: 'Stiletto', emoji: '△', desc: 'Sharp & edgy', path: '/shop/stiletto', color: '#e8d4e0' },
  { name: 'Square', emoji: '□', desc: 'Classic & clean', path: '/shop/square', color: '#d4e8e0' },
  { name: 'Ballerina', emoji: '♡', desc: 'Graceful & chic', path: '/shop/ballerina', color: '#dce4f0' },
  { name: 'Custom', emoji: '✦', desc: 'Your vision', path: '/shop/custom', color: '#ead4f0' },
];

const TESTIMONIALS = [
  { name: 'Sophia M.', text: 'These nails last me 3 weeks! I get compliments every single day. Worth every penny.', stars: 5, img: 'S' },
  { name: 'Aisha K.', text: 'The quality is unreal — they look like I just left a salon. Applying took less than 10 minutes!', stars: 5, img: 'A' },
  { name: 'Emma R.', text: 'I\'ve tried so many press-on brands and Pretty Press is by far the best. The designs are stunning!', stars: 5, img: 'E' },
];

const Home = () => {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    axios.get('/api/products?featured=true&limit=4')
      .then(res => { if (res.data.products?.length) setProducts(res.data.products); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
          <div className="hero-orb orb-3" />
        </div>
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-eyebrow">✦ Handcrafted with love ✦</span>
            <h1 className="hero-title">
              Salon-Perfect<br />
              <em>Nails at Home</em>
            </h1>
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
              <img src="https://i.pinimg.com/1200x/f8/80/96/f88096217ce1c03f92fd6fbef7dce260.jpg" alt="Beautiful press-on nails" />
              <div className="hero-badge-float badge-float-1">
                <span>💅</span>
                <div><strong>Lasts 3 Weeks</strong><small>Guaranteed</small></div>
              </div>
              <div className="hero-badge-float badge-float-2">
                <span>⭐</span>
                <div><strong>4.9 / 5 Stars</strong><small>2,400+ reviews</small></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
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
              <div>
                <strong>{t.label}</strong>
                <span>{t.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Collections
      <section className="collections-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Browse by Shape</span>
            <h2 className="section-title">Find Your Perfect Style</h2>
            <p className="section-subtitle">Every shape tells a story — which one is yours?</p>
          </div>
          <div className="collections-grid">
            {COLLECTIONS.map(col => (
              <Link key={col.name} to={col.path} className="collection-card" style={{ '--col-bg': col.color }}>
                <div className="col-emoji">{col.emoji}</div>
                <h3>{col.name}</h3>
                <p>{col.desc}</p>
                <span className="col-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section> */}

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Editor's Picks</span>
            <h2 className="section-title">Trending Right Now</h2>
            <p className="section-subtitle">Our most-loved styles, curated just for you</p>
          </div>
          <div className="products-grid">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
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
          <div className="section-cta">
            <Link to="/how-to-apply" className="btn-secondary">Full Application Guide →</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Real Love</span>
            <h2 className="section-title">What Our Customers Say</h2>
          </div>
          <div className="testimonials-track">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`testimonial-card ${i === activeTestimonial ? 'active' : ''}`}>
                <div className="stars">{'★'.repeat(t.stars)}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.img}</div>
                  <strong>{t.name}</strong>
                </div>
              </div>
            ))}
          </div>
          <div className="testimonial-dots">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} className={`dot ${i === activeTestimonial ? 'active' : ''}`} onClick={() => setActiveTestimonial(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
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
