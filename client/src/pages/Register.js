import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Account.css';
import './Auth.css';    

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      toast.success("Welcome to the Studio! ✨");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
     
      <div className="aura-glow aura-top-right"></div>
      <div className="aura-glow aura-bottom-left"></div>
      
      <div className="glass-auth-card">
        <header className="auth-header-luxe">
          <h1>Create Your Profile</h1>
          <p>Join SriNails for exclusive access to custom drops.</p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form-luxe">
          <div className="luxe-input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. Mahi Chauhan" 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>

          <div className="luxe-input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>

         
<div className="luxe-input-row">
  <div className="luxe-input-group">
    <label>Password</label>
    <input 
      className="luxe-input"
      type="password" 
      placeholder="••••••••" 
      onChange={(e) => setFormData({...formData, password: e.target.value})}
      required 
    />
  </div>
  <div className="luxe-input-group">
    <label>Confirm</label>
    <input 
      className="luxe-input"
      type="password" 
      placeholder="••••••••" 
      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
      required 
    />
  </div>
</div>

          <button type="submit" className="btn-luxe-submit" disabled={loading}>
            {loading ? "Creating Profile..." : "JOIN THE STUDIO ✨"}
          </button>
        </form>

        <footer className="auth-footer-luxe">
          <span>Already a member?</span>
          <Link to="/login" className="accent-link">Sign In</Link>
        </footer>
      </div>
    </div>
  );
};

export default Register;