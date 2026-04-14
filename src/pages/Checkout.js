import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaMapMarkerAlt, FaCreditCard, FaTruck, FaArrowLeft } from 'react-icons/fa';

/**
 * Checkout page with shipping address form, payment method selection,
 * order summary, and place order functionality.
 */
const Checkout = ({ onCartUpdate }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    shippingAddress: user?.address || '',
    paymentMethod: 'COD',
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await API.get('/cart');
      const cartData = res.data.data;
      if (!cartData?.items?.length) {
        toast.info('Your cart is empty');
        navigate('/products');
        return;
      }
      setCart(cartData);
    } catch (error) {
      toast.error('Failed to load cart');
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!formData.shippingAddress.trim()) {
      toast.error('Please enter a shipping address');
      return;
    }

    setPlacing(true);
    try {
      const res = await API.post('/orders/place', formData);
      setOrderPlaced(true);
      setOrderId(res.data.data.id);
      onCartUpdate && onCartUpdate();
      toast.success('Order placed successfully! 🎉');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  // Calculate totals
  const subtotal = cart?.items?.reduce((total, item) =>
    total + (item.product.price * item.quantity), 0) || 0;
  const deliveryFee = subtotal >= 999 ? 0 : 49;
  const total = subtotal + deliveryFee;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Preparing checkout...</p>
      </div>
    );
  }

  // Order Success Screen
  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="order-success">
            <FaCheckCircle className="success-icon" />
            <h2>Order Placed Successfully!</h2>
            <p>Your order #{orderId} has been confirmed.</p>
            <p>We'll deliver your products to your doorstep soon.</p>
            <div className="success-actions">
              <button className="btn-hero-primary" onClick={() => navigate('/orders')}>
                View My Orders
              </button>
              <button className="btn-hero-secondary" onClick={() => navigate('/products')}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <button className="btn-back" onClick={() => navigate('/cart')}>
          <FaArrowLeft /> Back to Cart
        </button>

        <div className="page-header">
          <h1>Checkout</h1>
          <p>Complete your order</p>
        </div>

        <div className="checkout-layout">
          {/* Checkout Form */}
          <div className="checkout-form-section">
            <form onSubmit={handlePlaceOrder}>
              {/* Shipping Address */}
              <div className="checkout-card">
                <h3><FaMapMarkerAlt /> Shipping Address</h3>
                <div className="form-group">
                  <label htmlFor="shippingAddress">Delivery Address *</label>
                  <textarea
                    id="shippingAddress"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your full delivery address including city, state, and PIN code"
                    rows="4"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="checkout-card">
                <h3><FaCreditCard /> Payment Method</h3>
                <div className="payment-options">
                  <label className={`payment-option ${formData.paymentMethod === 'COD' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={handleInputChange}
                    />
                    <div className="payment-info">
                      <strong>💵 Cash on Delivery</strong>
                      <span>Pay when you receive your order</span>
                    </div>
                  </label>
                  <label className={`payment-option ${formData.paymentMethod === 'ONLINE' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ONLINE"
                      checked={formData.paymentMethod === 'ONLINE'}
                      onChange={handleInputChange}
                    />
                    <div className="payment-info">
                      <strong>💳 Online Payment</strong>
                      <span>Pay using UPI, Card, or Net Banking</span>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn-place-order"
                disabled={placing}
                id="place-order-btn"
              >
                {placing ? (
                  <>
                    <div className="spinner-small"></div> Placing Order...
                  </>
                ) : (
                  <>
                    <FaCheckCircle /> Place Order - ₹{total.toFixed(2)}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cart?.items?.map((item) => (
                <div key={item.id} className="summary-item">
                  <img
                    src={item.product.imageUrl || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'}
                    alt={item.product.name}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'; }}
                  />
                  <div className="summary-item-info">
                    <span className="item-name">{item.product.name}</span>
                    <span className="item-qty">Qty: {item.quantity}</span>
                  </div>
                  <span className="item-price">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-divider"></div>
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
            <div className="summary-divider"></div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="delivery-estimate">
              <FaTruck /> Estimated delivery: 3-5 business days
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
