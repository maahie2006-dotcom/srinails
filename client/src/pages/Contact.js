import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./Contact.css";
import { useAuth } from "../context/AuthContext"; // Ensure you have AuthContext imported

function Contact() {
  const { user } = useAuth(); // Get logged-in user info
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '', 
    subject: '',
    message: ''
  });

  // --- FETCH MESSAGES LOGIC ---
  const fetchMessages = async (targetEmail) => {
    // Priority: 1. Passed email, 2. Logged in user, 3. LocalStorage
    const emailToFetch = targetEmail || user?.email || localStorage.getItem("lastContactEmail");
    
    if (!emailToFetch) return;

    try {
      const emailLower = emailToFetch.toLowerCase().trim();
      
      // Fetch conversation history from your new backend route
      const res = await axios.get(`/api/contact/my-messages/${emailLower}`);
      
      // Sort: Newest messages at the top
      const sortedMessages = res.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setMessages(sortedMessages);

      // Mark as read for the user
      await axios.put(`/api/contact/mark-as-read/${emailLower}`);
      
      // Save this email so history persists on refresh
      localStorage.setItem("lastContactEmail", emailLower);
    } catch (err) {
      console.error("Error loading history:", err);
    }
  };

  // Load history on page load
  useEffect(() => {
    fetchMessages();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Send the message to Backend
      await axios.post("/api/contact", formData);
      toast.success("Message sent to SriNails! ✨");
      
      const submittedEmail = formData.email;
      
      // 2. Clear message & subject, but KEEP name/email for convenience
      setFormData(prev => ({
        ...prev,
        subject: '',
        message: ''
      }));
      
      // 3. IMMEDIATELY refresh the sidebar history
      fetchMessages(submittedEmail); 
      
    } catch (error) {
      toast.error("Failed to send ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-luxe-page">
      <div className="container luxe-wrapper">
        <header className="contact-header">
          <h1>Customer Care</h1>
          <p>Handcrafted support for your luxury press-on experience.</p>
        </header>

        <div className="contact-grid">
          
          {/* LEFT COLUMN: Info & Message History */}
          <aside className="contact-sidebar">
            <section className="info-block">
              <h3>Connect With Us</h3>
              <div className="contact-methods">
                <p>✉️ <a href="mailto:nailnrutya@gmail.com">nailnrutya@gmail.com</a></p>
                <p className="contact-method-item">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a2c2a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '10px'}}>
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <a href="https://instagram.com/nailnrutya" target="_blank" rel="noopener noreferrer">
                    @nailnrutya
                  </a>
                </p>
                <p>🕒 Mon–Fri, 9am–5pm IST</p>
              </div>
            </section>

            <section className="history-block">
              <h3>Previous Inquiries</h3>
              <div className="message-scroll-area">
                {messages.length === 0 ? (
                  <p className="empty-text">No conversation history yet.</p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg._id} className="history-card">
                      <div className="history-user">
                        <span className="msg-tag user-tag">You:</span> {msg.message}
                      </div>
                      
                      {msg.reply ? (
                        <div className="history-admin">
                          <span className="msg-tag admin-tag">SriNails Studio:</span> {msg.reply}
                        </div>
                      ) : (
                        <div className="history-pending">✨ We're reviewing your request...</div>
                      )}
                      <div className="msg-date">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </aside>

          {/* RIGHT COLUMN: Send New Message */}
          <main className="contact-main">
            <form onSubmit={handleSubmit} className="luxe-contact-form">
              <h3>Send a New Inquiry</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Enter your name" 
                    value={formData.name}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input 
                  type="text" 
                  name="subject" 
                  placeholder="Custom Order / Sizing Help" 
                  value={formData.subject}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label>How can we help?</label>
                <textarea 
                  name="message" 
                  placeholder="Type your message here..." 
                  value={formData.message}
                  onChange={handleChange}
                  required 
                />
              </div>
              <button type="submit" className="btn-luxe-submit" disabled={loading}>
                {loading ? "Sending..." : "SEND MESSAGE 💅"}
              </button>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Contact;