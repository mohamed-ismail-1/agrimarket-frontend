import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaShoppingCart, FaUser, FaLeaf, FaBars, FaTimes, FaSignOutAlt, FaUserShield } from 'react-icons/fa';

/**
 * Main navigation bar component with responsive mobile menu.
 * Shows different links based on authentication status and user role.
 */
const Navbar = ({ cartCount }) => {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <nav className="navbar-custom">
      <div className="container">
        <div className="navbar-inner">
          {/* Brand Logo */}
          <Link to="/" className="navbar-brand-custom" onClick={() => setMobileOpen(false)}>
            <FaLeaf className="brand-icon" />
            <span className="brand-text">AgriMarket</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className={`nav-links ${mobileOpen ? 'nav-open' : ''}`}>
            <Link to="/" className="nav-link-custom" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/products" className="nav-link-custom" onClick={() => setMobileOpen(false)}>Products</Link>

            {isAuthenticated() && (
              <>
                <Link to="/cart" className="nav-link-custom cart-link" onClick={() => setMobileOpen(false)}>
                  <FaShoppingCart />
                  <span>Cart</span>
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </Link>
                <Link to="/orders" className="nav-link-custom" onClick={() => setMobileOpen(false)}>My Orders</Link>
              </>
            )}

            {isAdmin() && (
              <Link to="/admin" className="nav-link-custom admin-link" onClick={() => setMobileOpen(false)}>
                <FaUserShield /> Admin
              </Link>
            )}

            {/* Auth Buttons */}
            <div className="nav-auth">
              {isAuthenticated() ? (
                <div className="user-menu">
                  <span className="user-greeting">
                    <FaUser /> {user?.fullName?.split(' ')[0]}
                  </span>
                  <button className="btn-logout" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="btn-nav-login" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link to="/register" className="btn-nav-register" onClick={() => setMobileOpen(false)}>Register</Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
