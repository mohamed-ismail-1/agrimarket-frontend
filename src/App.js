import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import { useAuth } from './context/AuthContext';
import API from './api/axios';

/**
 * Main App component with routing and global state management.
 */
function App() {
  const [cartCount, setCartCount] = useState(0);
  const { isAuthenticated } = useAuth();

  // Fetch cart count for the badge on the navbar
  const fetchCartCount = useCallback(async () => {
    if (isAuthenticated()) {
      try {
        const res = await API.get('/cart');
        const items = res.data.data?.items || [];
        setCartCount(items.reduce((total, item) => total + item.quantity, 0));
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    } else {
      setCartCount(0);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  return (
    <div className="app">
      {/* Global Navigation */}
      <Navbar cartCount={cartCount} />

      {/* Main Content Area */}
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home onCartUpdate={fetchCartCount} />} />
          <Route path="/products" element={<Products onCartUpdate={fetchCartCount} />} />
          <Route path="/products/:id" element={<ProductDetails onCartUpdate={fetchCartCount} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes (require login) */}
          <Route path="/cart" element={
            <ProtectedRoute><Cart onCartUpdate={fetchCartCount} /></ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute><Checkout onCartUpdate={fetchCartCount} /></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute><Orders /></ProtectedRoute>
          } />

          {/* Admin Routes (require ADMIN role) */}
          <Route path="/admin" element={
            <AdminRoute><Admin /></AdminRoute>
          } />

          {/* 404 Fallback */}
          <Route path="*" element={
            <div className="not-found">
              <h1>404</h1>
              <p>Page not found</p>
              <a href="/" className="btn-hero-primary">Go Home</a>
            </div>
          } />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default App;
