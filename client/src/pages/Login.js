import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/account';
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 💅');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-deco" />
      <div className="auth-card">
        <div className="auth-logo">
          <span>💅</span>
          <h1>Welcome Back</h1>
          <p>Sign in to your SriNails account</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-field">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="form-field">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="••••••••" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="divider"><span>or</span></div>
        <p className="auth-switch">Don't have an account? <Link to="/register">Create one</Link></p>
      </div>
    </div>
  );
};

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to the family 💅');
      navigate('/account');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-deco" />
      <div className="auth-card">
        <div className="auth-logo">
          <span>✨</span>
          <h1>Join the Club</h1>
          <p>Create your account & get 10% off your first order</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-field">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" placeholder="Your name" value={form.name}
              onChange={e => setForm({...form, name: e.target.value})} required />
          </div>
          <div className="form-field">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="form-field">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="••••••••" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          <div className="form-field">
            <label className="form-label">Confirm Password</label>
            <input type="password" className="form-input" placeholder="••••••••" value={form.confirm}
              onChange={e => setForm({...form, confirm: e.target.value})} required />
          </div>
          <p className="auth-terms">By creating an account, you agree to our <a href="/terms">Terms</a> & <a href="/privacy">Privacy Policy</a>.</p>
          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account ✨'}
          </button>
        </form>
        <div className="divider"><span>or</span></div>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
};

export default Login;
