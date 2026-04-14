import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaLeaf } from 'react-icons/fa';

/**
 * Reusable product card component displaying product image, name, price,
 * rating, and an "Add to Cart" button.
 */
const ProductCard = ({ product, onAddToCart }) => {
  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= Math.round(rating || 0) ? 'star-filled' : 'star-empty'}
        />
      );
    }
    return stars;
  };

  // Fallback image if product image fails to load
  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400';
  };

  return (
    <div className="product-card">
      {/* Product Image */}
      <Link to={`/products/${product.id}`} className="product-image-wrapper">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'}
          alt={product.name}
          className="product-image"
          onError={handleImageError}
        />
        {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
          <span className="stock-badge low-stock">Only {product.stockQuantity} left!</span>
        )}
        {product.stockQuantity === 0 && (
          <span className="stock-badge out-of-stock">Out of Stock</span>
        )}
        {product.rating >= 4.5 && (
          <span className="trending-badge"><FaLeaf /> Popular</span>
        )}
      </Link>

      {/* Product Details */}
      <div className="product-info">
        <span className="product-category">{product.category?.name || 'Uncategorized'}</span>
        <Link to={`/products/${product.id}`} className="product-name-link">
          <h3 className="product-name">{product.name}</h3>
        </Link>

        {/* Rating */}
        <div className="product-rating">
          {renderStars(product.rating)}
          <span className="rating-value">({product.rating || 0})</span>
        </div>

        {/* Price & Brand */}
        <div className="product-price-row">
          <span className="product-price">₹{product.price?.toFixed(2)}</span>
          {product.unit && <span className="product-unit">/ {product.unit}</span>}
        </div>
        {product.brand && <span className="product-brand">by {product.brand}</span>}

        {/* Add to Cart Button */}
        <button
          className="btn-add-to-cart"
          onClick={() => onAddToCart && onAddToCart(product.id)}
          disabled={product.stockQuantity === 0}
        >
          <FaShoppingCart /> {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
