import React, { useState } from 'react';
import './Static.css';

export const About = () => (
  <div className="static-page page-wrapper">
    <div className="static-hero">
      <div className="container">
        <span className="section-label">Our Story</span>
        <h1>Made for the Woman<br /><em>Who Has It All</em></h1>
        <p>Premium press-on nails that look like you just left the salon.</p>
      </div>
    </div>
    <div className="container static-content">
      <div className="about-grid">
        <div className="about-text">
          <h2>Why SriNails?</h2>
          <p>We started SriNails because we believed every woman deserves beautiful nails — without spending hours at a salon or breaking the bank. Our handcrafted press-on nails are designed with premium materials that look and feel just like acrylics.</p>
          <p>Each set is carefully designed to be easy to apply, comfortable to wear, and stunning to look at. With proper care, they last up to 3 weeks — long enough to get through your biggest moments in style.</p>
          <div className="about-values">
            {[
              { emoji: '💝', title: 'Made with Love', desc: 'Each nail is designed with care and attention to every detail.' },
              { emoji: '✨', title: 'Premium Quality', desc: 'We use only the finest materials for salon-quality results.' },
              { emoji: '🌿', title: 'Cruelty-Free', desc: 'All our products are cruelty-free and ethically produced.' },
              { emoji: '♻️', title: 'Sustainable', desc: 'Eco-friendly packaging because we care about the planet too.' },
            ].map(v => (
              <div key={v.title} className="value-card">
                <span>{v.emoji}</span>
                <div><strong>{v.title}</strong><p>{v.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="about-img">
          <img src="https://i.pinimg.com/1200x/95/a5/0a/95a50ac0a3b9676b2fd61e18dcc8331d.jpg" alt="About SriNails" />
        </div>
      </div>
    </div>
  </div>
);

export const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const handleSubmit = (e) => { e.preventDefault(); setSent(true); };
  return (
    <div className="static-page page-wrapper">
      <div className="static-hero">
        <div className="container">
          <span className="section-label">Get in Touch</span>
          <h1>We'd Love to <em>Hear From You</em></h1>
        </div>
      </div>
      <div className="container" style={{ padding: '60px 24px 80px', maxWidth: '800px' }}>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>💌</div>
            <h2 style={{ color: 'var(--plum)', marginBottom: '12px' }}>Message Sent!</h2>
            <p style={{ color: 'var(--mid-gray)' }}>We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <div className="contact-layout">
            <div className="contact-info">
              <h3>Contact Information</h3>
              {[['📧', 'Email', 'hello@prettypressnails.com'], ['💬', 'Instagram', '@prettypressnails'], ['🕐', 'Hours', 'Mon–Fri, 9am–5pm EST']].map(([i, l, v]) => (
                <div key={l} className="contact-info-item"><span>{i}</span><div><strong>{l}</strong><p>{v}</p></div></div>
              ))}
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-field"><label className="form-label">Name</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
              <div className="form-field"><label className="form-label">Email</label><input type="email" className="form-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
              <div className="form-field"><label className="form-label">Subject</label><input className="form-input" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} /></div>
              <div className="form-field"><label className="form-label">Message</label><textarea className="form-input" rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} required style={{ resize: 'vertical' }} /></div>
              <button type="submit" className="btn-primary">Send Message 💌</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const HowToApply = () => (
  <div className="static-page page-wrapper">
    <div className="static-hero">
      <div className="container">
        <span className="section-label">Application Guide</span>
        <h1>Perfect Nails,<br /><em>Every Time</em></h1>
      </div>
    </div>
    <div className="container" style={{ padding: '60px 24px 80px' }}>
      <div className="how-to-steps">
        {[
          { n: '01', emoji: '🧼', title: 'Prep & Clean', steps: ['Remove any existing nail polish', 'Wash hands thoroughly with soap', 'Push back cuticles gently', 'Lightly buff nail surface for better adhesion'] },
          { n: '02', emoji: '📏', title: 'Find Your Size', steps: ['Lay out all nail sizes', 'Match each press-on to your nail width', 'Choose the closest fit (slightly smaller is better)', 'Set aside your matched set'] },
          { n: '03', emoji: '💅', title: 'Apply with Glue', steps: ['Apply a thin layer of glue to your natural nail', 'Press nail on at a slight angle from the cuticle', 'Hold firmly for 30–60 seconds', 'Repeat for all nails'] },
          { n: '04', emoji: '✨', title: 'Apply with Tabs', steps: ['Peel adhesive tab backing', 'Stick tab to press-on nail', 'Align with cuticle and press down firmly', 'Great for short-term wear (up to 7 days)'] },
          { n: '05', emoji: '🌟', title: 'Finishing Touches', steps: ['Smooth any lifted edges gently', 'Apply top coat for extra shine (optional)', 'Avoid water for 1–2 hours after application', 'Enjoy your beautiful nails!'] },
          { n: '06', emoji: '🔄', title: 'Removal', steps: ['Soak nails in warm soapy water for 10 minutes', 'Gently wiggle nail side to side', 'Never force or rip off — this damages natural nails', 'Use cuticle oil to nourish after removal'] },
        ].map(step => (
          <div key={step.n} className="how-to-card">
            <div className="how-to-num">{step.n}</div>
            <div className="how-to-emoji">{step.emoji}</div>
            <h3>{step.title}</h3>
            <ul>{step.steps.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </div>
        ))}
      </div>
      <div className="tips-banner">
        <h3>💡 Pro Tips for Longer Wear</h3>
        <div className="tips-grid">
          {['Avoid water for 1-2 hours after application', 'Apply glue to both the press-on and natural nail', 'Use cuticle oil daily around the edges', 'Avoid picking at your nails or using them as tools'].map(t => (
            <div key={t} className="tip-item"><span>✓</span>{t}</div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default About;
