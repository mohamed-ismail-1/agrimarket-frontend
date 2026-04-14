import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { FaBox, FaCalendarAlt, FaTruck, FaCheckCircle, FaClock, FaTimes } from 'react-icons/fa';

/**
 * Orders page displaying the user's order history with status tracking.
 */
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders');
      setOrders(res.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get status icon and color based on order status
  const getStatusInfo = (status) => {
    const statusMap = {
      PENDING: { icon: <FaClock />, className: 'status-pending', label: 'Pending' },
      CONFIRMED: { icon: <FaCheckCircle />, className: 'status-confirmed', label: 'Confirmed' },
      SHIPPED: { icon: <FaTruck />, className: 'status-shipped', label: 'Shipped' },
      DELIVERED: { icon: <FaCheckCircle />, className: 'status-delivered', label: 'Delivered' },
      CANCELLED: { icon: <FaTimes />, className: 'status-cancelled', label: 'Cancelled' },
    };
    return statusMap[status] || statusMap.PENDING;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="page-header">
          <h1><FaBox /> My Orders</h1>
          <p>{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <FaBox className="empty-icon" />
            <h3>No Orders Yet</h3>
            <p>You haven't placed any orders yet. Start shopping!</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-id">
                      <strong>Order #{order.id}</strong>
                      <span className="order-date">
                        <FaCalendarAlt /> {new Date(order.orderDate).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </span>
                    </div>
                    <span className={`order-status ${statusInfo.className}`}>
                      {statusInfo.icon} {statusInfo.label}
                    </span>
                  </div>

                  <div className="order-items">
                    {order.items?.map((item) => (
                      <div key={item.id} className="order-item">
                        <img
                          src={item.product?.imageUrl || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'}
                          alt={item.product?.name}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'; }}
                        />
                        <div className="order-item-info">
                          <span className="item-name">{item.product?.name}</span>
                          <span className="item-qty">Qty: {item.quantity} × ₹{item.price?.toFixed(2)}</span>
                        </div>
                        <span className="item-subtotal">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <div className="order-details">
                      <span><strong>Payment:</strong> {order.paymentMethod}</span>
                      <span><strong>Address:</strong> {order.shippingAddress}</span>
                    </div>
                    <div className="order-total">
                      <span>Total: </span>
                      <strong>₹{order.totalAmount?.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
