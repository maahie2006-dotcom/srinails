import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Log in and get the user data back
      const userData = await login(form.email, form.password);
      
      // 2. Check if the user is an admin
      if (userData && userData.role === 'admin') {
        localStorage.setItem("admin", "true"); // This "unlocks" the dashboard
        toast.success('Welcome back, Mahi! 💅');
        navigate('/admin/dashboard'); // Redirect straight to business
      } else {
        // Regular customers go to their account
        localStorage.removeItem("admin"); 
        toast.success('Welcome back to the Studio! ✨');
        navigate('/account');
      }
    } catch (err) {
      toast.error('Invalid credentials. Please try again.');
    }
  };
  const styles = {
    wrapper: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fdf8f4', 
      padding: '140px 20px 60px',
      fontFamily: "'Jost', sans-serif"
    },
    card: {
      background: '#ffffff',
      width: '100%',
      maxWidth: '450px',
      padding: '50px 40px',
      borderRadius: '30px',
      boxShadow: '0 20px 50px rgba(74, 37, 53, 0.1)',
      textAlign: 'center',
      border: '1px solid #f2cfc7'
    },
    labelLuxe: {
      fontSize: '0.7rem',
      fontWeight: '700',
      letterSpacing: '0.2em',
      color: '#c9a96e', 
      display: 'block',
      marginBottom: '10px'
    },
    title: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '2.2rem',
      color: '#4a2535', 
      marginBottom: '8px'
    },
    subtitle: {
      fontFamily: "'Cormorant Garamond', serif",
      fontStyle: 'italic', // ✅ Fixed the missing quote here!
      fontSize: '1.1rem',
      color: '#9e8e89',
      marginBottom: '35px'
    },
    inputGroup: {
      textAlign: 'left',
      marginBottom: '20px'
    },
    inputLabel: {
      fontSize: '0.75rem',
      fontWeight: '700',
      textTransform: 'uppercase',
      color: '#8b5e6b',
      marginBottom: '8px',
      display: 'block'
    },
    input: {
      width: '100%',
      padding: '15px',
      borderRadius: '12px',
      border: '1px solid #f2cfc7',
      fontSize: '0.95rem',
      outline: 'none',
      backgroundColor: '#fafafa',
      fontFamily: "'Jost', sans-serif"
    },
    submitBtn: {
      width: '100%',
      padding: '16px',
      background: '#4a2535',
      color: 'white',
      border: 'none',
      borderRadius: '50px',
      fontWeight: '600',
      letterSpacing: '1px',
      cursor: 'pointer',
      marginTop: '10px',
      transition: '0.3s'
    },
    footer: {
      marginTop: '30px',
      paddingTop: '20px',
      borderTop: '1px solid #f5f0ed'
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <span style={styles.labelLuxe}>SRINAILS LUXE</span>
        <h1 style={styles.title}>The Art of Press-Ons</h1>
        <p style={styles.subtitle}>Sign in to manage your collection</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>Email Address</label>
            <input 
              type="email" 
              style={styles.input} 
              placeholder="email@example.com"
              onChange={e => setForm({...form, email: e.target.value})}
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <label style={styles.inputLabel}>Password</label>
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{fontSize: '0.65rem', color: '#d4817a', fontWeight: '700', border: 'none', background: 'none'}}
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              style={styles.input} 
              placeholder="••••••••"
              onChange={e => setForm({...form, password: e.target.value})}
              required 
            />
            <div style={{textAlign: 'right', marginTop: '10px'}}>
              <Link to="/forgot-password" style={{fontSize: '0.8rem', color: '#9e8e89', textDecoration: 'none'}}>
                Forgot Password?
              </Link>
            </div>
          </div>

          <button type="submit" style={styles.submitBtn}>
            SIGN IN TO STUDIO
          </button>
        </form>

        <div style={styles.footer}>
          <p style={{fontSize: '0.9rem', color: '#9e8e89', marginBottom: '8px'}}>New to SriNails?</p>
          <Link to="/register" style={{color: '#4a2535', fontWeight: '700', textDecoration: 'underline'}}>
            Create Your Collection Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;