import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaLeaf, FaEye, FaEyeSlash } from 'react-icons/fa';

/**
 * Login page with email/password form and JWT authentication.
 */
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', formData);
      const data = res.data.data;
      login(
        { fullName: data.fullName, email: data.email, role: data.role, userId: data.userId },
        data.token
      );
      toast.success(`Welcome back, ${data.fullName}! 🌿`);
      navigate(data.role === 'ADMIN' ? '/admin' : '/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          {/* Left Side - Branding */}
          <div className="auth-branding">
            <FaLeaf className="auth-logo" />
            <h2>Welcome to AgriMarket</h2>
            <p>Your trusted marketplace for premium agricultural products</p>
            <div className="auth-features">
              <div className="auth-feature">🌾 500+ Quality Products</div>
              <div className="auth-feature">🚚 Free Delivery on ₹999+</div>
              <div className="auth-feature">🛡️ Secure Payments</div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="auth-form-section">
            <h2>Sign In</h2>
            <p className="auth-subtitle">Enter your credentials to access your account</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="login-email"><FaEnvelope /> Email Address</label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="login-password"><FaLock /> Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="form-control"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-auth-submit" disabled={loading} id="login-btn">
                {loading ? (
                  <><div className="spinner-small"></div> Signing in...</>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account? <Link to="/register">Create Account</Link>
            </p>

            {/* Demo Credentials */}
            <div className="demo-credentials">
              <p><strong>Demo Accounts:</strong></p>
              <p>Admin: admin@agrimarket.com / admin123</p>
              <p>Customer: customer@demo.com / customer123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
