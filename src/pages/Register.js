import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaLeaf, FaEye, FaEyeSlash } from 'react-icons/fa';

/**
 * Registration page with form validation and auto-login after signup.
 */
const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      const res = await API.post('/auth/register', registerData);
      const data = res.data.data;
      login(
        { fullName: data.fullName, email: data.email, role: data.role, userId: data.userId },
        data.token
      );
      toast.success(`Welcome to AgriMarket, ${data.fullName}! 🌿`);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
            <h2>Join AgriMarket</h2>
            <p>Create your account and start shopping for the best agricultural products</p>
            <div className="auth-features">
              <div className="auth-feature">✅ Free account creation</div>
              <div className="auth-feature">🌾 Access to 500+ products</div>
              <div className="auth-feature">📦 Track your orders</div>
              <div className="auth-feature">💰 Exclusive member deals</div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="auth-form-section">
            <h2>Create Account</h2>
            <p className="auth-subtitle">Fill in your details to get started</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="reg-name"><FaUser /> Full Name *</label>
                  <input
                    type="text"
                    id="reg-name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    minLength="2"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="reg-phone"><FaPhone /> Phone</label>
                  <input
                    type="tel"
                    id="reg-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-email"><FaEnvelope /> Email Address *</label>
                <input
                  type="email"
                  id="reg-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="form-control"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="reg-password"><FaLock /> Password *</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="reg-password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
                      required
                      minLength="6"
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
                <div className="form-group">
                  <label htmlFor="reg-confirm"><FaLock /> Confirm Password *</label>
                  <input
                    type="password"
                    id="reg-confirm"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    required
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-address"><FaMapMarkerAlt /> Address</label>
                <textarea
                  id="reg-address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your delivery address"
                  rows="3"
                  className="form-control"
                />
              </div>

              <button type="submit" className="btn-auth-submit" disabled={loading} id="register-btn">
                {loading ? (
                  <><div className="spinner-small"></div> Creating Account...</>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
