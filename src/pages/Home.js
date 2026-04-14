import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaLeaf, FaTruck, FaShieldAlt, FaHeadset, FaSeedling, FaArrowRight } from 'react-icons/fa';

/**
 * Home page with hero banner, featured categories, featured products,
 * and feature highlights section.
 */
const Home = ({ onCartUpdate }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        API.get('/products'),
        API.get('/categories')
      ]);
      setProducts(prodRes.data.data || []);
      setCategories(catRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated()) {
      toast.info('Please login to add items to cart');
      return;
    }
    try {
      await API.post('/cart/add', { productId, quantity: 1 });
      toast.success('Product added to cart! 🛒');
      onCartUpdate && onCartUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading AgriMarket...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* ========== Hero Section ========== */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-badge">
              <FaSeedling /> Trusted by 10,000+ Farmers
            </span>
            <h1 className="hero-title">
              Grow Better with
              <span className="text-gradient"> Premium Agri Products</span>
            </h1>
            <p className="hero-subtitle">
              Discover high-quality seeds, fertilizers, tools, and organic solutions
              for modern farming. Everything your farm needs, delivered to your doorstep.
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="btn-hero-primary">
                Shop Now <FaArrowRight />
              </Link>
              <Link to="/register" className="btn-hero-secondary">
                Join Free
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <strong>500+</strong>
                <span>Products</span>
              </div>
              <div className="stat-item">
                <strong>10K+</strong>
                <span>Farmers</span>
              </div>
              <div className="stat-item">
                <strong>50+</strong>
                <span>Brands</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Features Bar ========== */}
      <section className="features-bar">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <FaTruck className="feature-icon" />
              <div>
                <strong>Free Delivery</strong>
                <span>On orders above ₹999</span>
              </div>
            </div>
            <div className="feature-item">
              <FaShieldAlt className="feature-icon" />
              <div>
                <strong>Quality Guaranteed</strong>
                <span>100% genuine products</span>
              </div>
            </div>
            <div className="feature-item">
              <FaLeaf className="feature-icon" />
              <div>
                <strong>Organic Certified</strong>
                <span>Eco-friendly options</span>
              </div>
            </div>
            <div className="feature-item">
              <FaHeadset className="feature-icon" />
              <div>
                <strong>24/7 Support</strong>
                <span>Expert farming advice</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Categories Section ========== */}
      <section className="section-categories">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Browse our wide range of agricultural product categories</p>
          </div>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link to={`/products?category=${cat.id}`} key={cat.id} className="category-card">
                <div className="category-img-wrapper">
                  <img
                    src={cat.imageUrl || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'}
                    alt={cat.name}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'; }}
                  />
                </div>
                <div className="category-info">
                  <h3>{cat.name}</h3>
                  <p>{cat.description?.substring(0, 60)}...</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Featured Products Section ========== */}
      <section className="section-products">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Handpicked products for the best farming experience</p>
          </div>
          <div className="products-grid">
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/products" className="btn-view-all">
              View All Products <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== CTA Section ========== */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Farming?</h2>
            <p>Join thousands of farmers who trust AgriMarket for their agricultural needs.</p>
            <Link to="/register" className="btn-cta">
              Get Started Today <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
