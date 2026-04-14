import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaStar, FaShoppingCart, FaArrowLeft, FaMinus, FaPlus, FaLeaf, FaTruck, FaShieldAlt } from 'react-icons/fa';

/**
 * Product details page showing full product information,
 * quantity selector, and add to cart functionality.
 */
const ProductDetails = ({ onCartUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data.data);
    } catch (error) {
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }
    try {
      await API.post('/cart/add', { productId: product.id, quantity });
      toast.success(`${product.name} added to cart! 🛒`);
      onCartUpdate && onCartUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar key={i} className={i <= Math.round(rating || 0) ? 'star-filled' : 'star-empty'} />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="product-details-page">
      <div className="container">
        {/* Back Button */}
        <button className="btn-back" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back to Products
        </button>

        <div className="product-details-grid">
          {/* Product Image */}
          <div className="product-detail-image">
            <img
              src={product.imageUrl || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'}
              alt={product.name}
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'; }}
            />
            {product.rating >= 4.5 && (
              <span className="detail-badge"><FaLeaf /> Popular Choice</span>
            )}
          </div>

          {/* Product Info */}
          <div className="product-detail-info">
            <span className="detail-category">{product.category?.name}</span>
            <h1 className="detail-name">{product.name}</h1>

            {/* Rating */}
            <div className="detail-rating">
              {renderStars(product.rating)}
              <span className="rating-text">{product.rating || 0} / 5</span>
            </div>

            {/* Price */}
            <div className="detail-price">
              <span className="price-value">₹{product.price?.toFixed(2)}</span>
              {product.unit && <span className="price-unit">per {product.unit}</span>}
            </div>

            {/* Brand */}
            {product.brand && (
              <p className="detail-brand">Brand: <strong>{product.brand}</strong></p>
            )}

            {/* Stock Status */}
            <div className={`stock-status ${product.stockQuantity > 0 ? 'in-stock' : 'oos'}`}>
              {product.stockQuantity > 0
                ? `✅ In Stock (${product.stockQuantity} available)`
                : '❌ Out of Stock'
              }
            </div>

            {/* Description */}
            <div className="detail-description">
              <h3>Description</h3>
              <p>{product.description || 'No description available.'}</p>
            </div>

            {/* Quantity Selector & Add to Cart */}
            {product.stockQuantity > 0 && (
              <div className="detail-actions">
                <div className="quantity-selector">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="qty-btn"
                    id="qty-decrease"
                  >
                    <FaMinus />
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="qty-btn"
                    id="qty-increase"
                  >
                    <FaPlus />
                  </button>
                </div>
                <button className="btn-add-to-cart-detail" onClick={handleAddToCart} id="add-to-cart-btn">
                  <FaShoppingCart /> Add to Cart - ₹{(product.price * quantity).toFixed(2)}
                </button>
              </div>
            )}

            {/* Guarantees */}
            <div className="detail-guarantees">
              <div className="guarantee-item">
                <FaTruck /> <span>Free delivery on orders above ₹999</span>
              </div>
              <div className="guarantee-item">
                <FaShieldAlt /> <span>100% quality guaranteed</span>
              </div>
              <div className="guarantee-item">
                <FaLeaf /> <span>Eco-friendly packaging</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
