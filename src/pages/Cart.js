import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

/**
 * Cart page displaying all items in the user's cart with
 * quantity controls, removal, and checkout summary.
 */
const Cart = ({ onCartUpdate }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await API.get('/cart');
      setCart(res.data.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const res = await API.put(`/cart/update/${itemId}?quantity=${newQuantity}`);
      setCart(res.data.data);
      onCartUpdate && onCartUpdate();
      toast.success('Cart updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await API.delete(`/cart/remove/${itemId}`);
      setCart(res.data.data);
      onCartUpdate && onCartUpdate();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await API.delete('/cart/clear');
      setCart({ ...cart, items: [] });
      onCartUpdate && onCartUpdate();
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  // Calculate totals
  const calculateSubtotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const deliveryFee = subtotal >= 999 ? 0 : 49;
  const total = subtotal + deliveryFee;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="page-header">
          <h1><FaShoppingCart /> Your Cart</h1>
          <p>{cart?.items?.length || 0} item{cart?.items?.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        {!cart?.items?.length ? (
          <div className="empty-state">
            <FaShoppingCart className="empty-icon" />
            <h3>Your Cart is Empty</h3>
            <p>Looks like you haven't added any products yet.</p>
            <Link to="/products" className="btn-hero-primary">
              Start Shopping <FaArrowRight />
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Cart Items */}
            <div className="cart-items-section">
              <div className="cart-items-header">
                <h3>Cart Items</h3>
                <button className="btn-clear" onClick={clearCart}>
                  <FaTrash /> Clear All
                </button>
              </div>

              {cart.items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img
                      src={item.product.imageUrl || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'}
                      alt={item.product.name}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'; }}
                    />
                  </div>
                  <div className="cart-item-details">
                    <Link to={`/products/${item.product.id}`} className="cart-item-name">
                      {item.product.name}
                    </Link>
                    <span className="cart-item-brand">{item.product.brand}</span>
                    <span className="cart-item-price">₹{item.product.price?.toFixed(2)} / {item.product.unit}</span>
                  </div>
                  <div className="cart-item-quantity">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stockQuantity}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <div className="cart-item-total">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </div>
                  <button className="btn-remove-item" onClick={() => removeItem(item.id)}>
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <span className={deliveryFee === 0 ? 'free-delivery' : ''}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              {deliveryFee > 0 && (
                <div className="delivery-hint">
                  Add ₹{(999 - subtotal).toFixed(2)} more for free delivery
                </div>
              )}
              <div className="summary-divider"></div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <button
                className="btn-checkout"
                onClick={() => navigate('/checkout')}
                id="checkout-btn"
              >
                Proceed to Checkout <FaArrowRight />
              </button>
              <Link to="/products" className="btn-continue-shopping">
                <FaArrowLeft /> Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
