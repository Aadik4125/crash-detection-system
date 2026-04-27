import React, { useState } from 'react';
import { User, Mail, Lock, Car, UserPlus, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

const Signup = ({ onSwitchToLogin }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', vehicleNumber: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => onSwitchToLogin(), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-orb auth-bg-orb-1"></div>
      <div className="auth-bg-orb auth-bg-orb-2"></div>
      <div className="auth-bg-orb auth-bg-orb-3"></div>

      <div className="auth-card">
        <div className="auth-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        </div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Register your vehicle to get started</p>

        {error && (
          <div className="auth-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {success && (
          <div className="auth-success">
            <CheckCircle size={16} />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <User size={18} className="input-icon" />
            <input
              id="signup-name"
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>

          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input
              id="signup-email"
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input
              id="signup-password"
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div className="input-group">
            <Car size={18} className="input-icon" />
            <input
              id="signup-vehicle"
              type="text"
              name="vehicleNumber"
              placeholder="Vehicle Number (e.g. KA01AB1234)"
              value={form.vehicleNumber}
              onChange={handleChange}
              required
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <button id="signup-submit" type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <span className="auth-btn-loading"></span>
            ) : (
              <>
                <UserPlus size={18} />
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <button id="goto-login" onClick={onSwitchToLogin} className="auth-link">
            Sign In <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
