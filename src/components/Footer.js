import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

/**
 * Footer component with company info, quick links, and social media icons.
 */
const Footer = () => {
  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-brand">
              <FaLeaf className="footer-icon" />
              <h3>AgriMarket</h3>
            </div>
            <p className="footer-desc">
              Your trusted online store for quality agricultural products.
              Empowering farmers with the best seeds, tools, and solutions.
            </p>
            <div className="social-links">
              <a href="#!" aria-label="Facebook"><FaFacebook /></a>
              <a href="#!" aria-label="Twitter"><FaTwitter /></a>
              <a href="#!" aria-label="Instagram"><FaInstagram /></a>
              <a href="#!" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-section">
            <h4>Categories</h4>
            <ul className="footer-links">
              <li><Link to="/products?category=1">Seeds</Link></li>
              <li><Link to="/products?category=2">Fertilizers</Link></li>
              <li><Link to="/products?category=3">Tools & Equipment</Link></li>
              <li><Link to="/products?category=4">Pesticides</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contact Us</h4>
            <div className="contact-info">
              <p><FaMapMarkerAlt /> 123 Farm Road, Agriculture Hub</p>
              <p><FaPhone /> +91 98765 43210</p>
              <p><FaEnvelope /> support@agrimarket.com</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} AgriMarket. All rights reserved. Built with 🌱 for farmers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
