import React from 'react';
import { Link } from 'react-router-dom';

import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-top">
      <div className="container footer-grid">
        
        
        <div className="footer-brand">
          <div className="footer-logo">
            <span>💅</span>
            <div>
              <div className="footer-logo-main">SriNails</div>
              <div className="footer-logo-sub">Luxury at your fingertips</div>
            </div>
          </div>

          <p className="footer-tagline">
            Handcrafted press-on nails that last up to 3 weeks. Salon quality, 
            delivered to your door.
          </p>

         
        </div>

        
        <div className="footer-col">
          <h4>Help</h4>
          <ul>
            {[
              ['How To Apply', '/how-to-apply'],
              ['Sizing Guide', '/sizing-guide'],
              ['FAQ', '/faq'],
              ['Track My Order', '/orders'],
              ['Returns & Exchanges', '/returns'],
              ['Contact Us', '/contact'],
            ].map(([l, p]) => (
              <li key={l}>
                <Link to={p}>{l}</Link>
              </li>
            ))}
          </ul>
        </div>

        
        <div className="footer-col">
          <h4>Get in Touch</h4>

          <div className="footer-contact">

            <p>
              📧 <a href="mailto:nailnrutya@gmail.com?subject=Press On Nails Order&body=Hi, I want to order press-on nails">
                Email Us
              </a>
            </p>

            <p>
              📸 <a 
                href="https://instagram.com/nailnrutya" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                DM on Instagram
              </a>
            </p>

            <p>
              💬 <a 
                href="https://wa.me/917016121297" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </a>
            </p>

            <p>🕐 Mon–Fri, 9am–5pm</p>

          </div>
        </div>

      </div>
    </div>

    <div className="footer-bottom">
      <div className="container footer-bottom-inner">
        <p>© {new Date().getFullYear()} SriNails. Made with 💅 & love.</p>

        <div className="footer-legal">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
