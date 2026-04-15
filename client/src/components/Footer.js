import React from 'react';
import { Link } from 'react-router-dom';

import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-top">
      <div className="container footer-grid">
        
        {/* Brand */}
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

          <div className="footer-social">
            {[
              { icon: '📸', label: 'Instagram', url: 'https://instagram.com/nailnrutya' },
            ].map(s => (
              <a 
                key={s.label} 
                href={s.url} 
                className="social-btn" 
                aria-label={s.label} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Help */}
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

        {/* Contact */}
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
// import React from 'react';
// import { Link } from 'react-router-dom';

// import './Footer.css';

// const Footer = () => (
//   <footer className="footer">
//     <div className="footer-top">
//       <div className="container footer-grid">
//         {/* Brand */}
//         <div className="footer-brand">
//           <div className="footer-logo">
//             <span>💅</span>
//             <div>
//               <div className="footer-logo-main">SriNails</div>
//               <div className="footer-logo-sub">Luxury at your fingertips</div>
//             </div>
//           </div>
//           <p className="footer-tagline">
//             Handcrafted press-on nails that last up to 3 weeks. Salon quality, 
//             delivered to your door.
//           </p>
//           <div className="footer-social">
//             {[
//               { icon: '📸', label: 'Instagram', url: 'https://instagram.com/nailnrutya' },
//               // { icon: '🎵', label: 'TikTok', url: '#' },
//               // { icon: '📌', label: 'Pinterest', url: '#' },
//               // { icon: '👥', label: 'Facebook', url: '#' },
//             ].map(s => (
//               <a key={s.label} href={s.url} className="social-btn" aria-label={s.label} target="_blank" rel="noopener noreferrer">
//                 {s.icon}
//               </a>
//             ))}
//           </div>
//         </div>

//         {/* Shop
//         <div className="footer-col">
//           <h4>Shop</h4>
//           <ul>
//             {['All Nails', 'Coffin', 'Almond', 'Stiletto', 'Square', 'Ballerina', 'Custom Sets'].map(l => (
//               <li key={l}><Link to={`/shop${l === 'All Nails' ? '' : `/${l.toLowerCase()}`}`}>{l}</Link></li>
//             ))}
//           </ul>
//         </div> */}

//         {/* Help */}
//         <div className="footer-col">
//           <h4>Help</h4>
//           <ul>
//             {[
//               ['How To Apply', '/how-to-apply'],
//               // ['Sizing Guide', '/sizing'],
//               ['Sizing Guide', '/sizing-guide'],
//               ['FAQ', '/faq'],
//               ['Track My Order', '/orders'],
//               ['Returns & Exchanges', '/returns'],
//               ['Contact Us', '/contact'],
//             ].map(([l, p]) => <li key={l}><Link to={p}>{l}</Link></li>)}
//           </ul>
//         </div>
// {/*  */}
//         {/* Contact */}
//         <div className="footer-col">
//           <h4>Get in Touch</h4>
//           <div className="footer-contact">
//             <p>
//   📧 <a href="mailto:nailnrutya@gmail.com">
//      nailnrutya@gmail.com
//   </a>
// </p>
//             <p>
//   💬 <a 
//     href="https://instagram.com/nailnrutya" 
//     target="_blank" 
//     rel="noopener noreferrer"
//   >
//     DM us on Instagram
//   </a>
// </p>
//             <p>🕐 Mon–Fri, 9am–5pm</p>
//           </div>
//           {/* <div className="footer-payment">
//             <p className="payment-label">We Accept</p>
//             <div className="payment-icons">
//               {['Visa', 'MC', 'Amex', 'PayPal', 'ApplePay'].map(p => (
//                 <span key={p} className="payment-chip">{p}</span>
//               ))}
//             </div>
//           </div> */}
//         </div>
//       </div>
//     </div>

//     <div className="footer-bottom">
//       <div className="container footer-bottom-inner">
//         <p>© {new Date().getFullYear()} SriNails. Made with 💅 & love.</p>
//         <div className="footer-legal">
//           <Link to="/privacy">Privacy Policy</Link>
//           <Link to="/terms">Terms of Service</Link>
//           <Link to="/cookies">Cookie Policy</Link>
//         </div>
//       </div>
//     </div>
//   </footer>
// );

// export default Footer;
