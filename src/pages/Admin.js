import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { toast } from 'react-toastify';
import {
  FaUserShield, FaBox, FaUsers, FaShoppingBag,
  FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaChartBar
} from 'react-icons/fa';

/**
 * Admin dashboard with tabs for managing products, orders, and viewing users.
 */
const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Product form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', stockQuantity: '',
    imageUrl: '', unit: 'packet', brand: '', categoryId: '', isActive: true,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, prodRes, catRes, ordRes, usrRes] = await Promise.all([
        API.get('/admin/dashboard'),
        API.get('/admin/products'),
        API.get('/categories'),
        API.get('/admin/orders'),
        API.get('/admin/users'),
      ]);
      setStats(statsRes.data.data || {});
      setProducts(prodRes.data.data || []);
      setCategories(catRes.data.data || []);
      setOrders(ordRes.data.data || []);
      setUsers(usrRes.data.data || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  // ============ Product Management ============
  const handleProductFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm({
      ...productForm,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '', description: '', price: '', stockQuantity: '',
      imageUrl: '', unit: 'packet', brand: '', categoryId: categories[0]?.id || '', isActive: true,
    });
    setShowProductForm(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl || '',
      unit: product.unit || 'packet',
      brand: product.brand || '',
      categoryId: product.category?.id || '',
      isActive: product.isActive,
    });
    setShowProductForm(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...productForm,
        price: parseFloat(productForm.price),
        stockQuantity: parseInt(productForm.stockQuantity),
        categoryId: parseInt(productForm.categoryId),
      };

      if (editingProduct) {
        await API.put(`/products/${editingProduct.id}`, data);
        toast.success('Product updated successfully');
      } else {
        await API.post('/products', data);
        toast.success('Product created successfully');
      }

      setShowProductForm(false);
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await API.delete(`/products/${id}`);
        toast.success('Product deleted');
        fetchDashboardData();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  // ============ Order Management ============
  const handleStatusUpdate = async (orderId, status) => {
    try {
      await API.put(`/admin/orders/${orderId}/status?status=${status}`);
      toast.success('Order status updated');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <h1><FaUserShield /> Admin Dashboard</h1>
          <p>Manage your AgriMarket store</p>
        </div>

        {/* Dashboard Stats */}
        <div className="admin-stats">
          <div className="stat-card" onClick={() => setActiveTab('products')}>
            <FaBox className="stat-icon" />
            <div>
              <h3>{stats.totalProducts || 0}</h3>
              <span>Products</span>
            </div>
          </div>
          <div className="stat-card" onClick={() => setActiveTab('orders')}>
            <FaShoppingBag className="stat-icon" />
            <div>
              <h3>{stats.totalOrders || 0}</h3>
              <span>Orders</span>
            </div>
          </div>
          <div className="stat-card" onClick={() => setActiveTab('users')}>
            <FaUsers className="stat-icon" />
            <div>
              <h3>{stats.totalUsers || 0}</h3>
              <span>Users</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FaChartBar /> Dashboard
          </button>
          <button
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <FaBox /> Products
          </button>
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FaShoppingBag /> Orders
          </button>
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FaUsers /> Users
          </button>
        </div>

        {/* Tab Content */}
        <div className="admin-content">
          {/* ====== Dashboard Tab ====== */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-content">
              <h3>Recent Orders</h3>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.user?.fullName}</td>
                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td>₹{order.totalAmount?.toFixed(2)}</td>
                        <td><span className={`order-status status-${order.status?.toLowerCase()}`}>{order.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ====== Products Tab ====== */}
          {activeTab === 'products' && (
            <div className="products-content">
              <div className="tab-header">
                <h3>Manage Products ({products.length})</h3>
                <button className="btn-add" onClick={openAddProduct}>
                  <FaPlus /> Add Product
                </button>
              </div>

              {/* Product Form Modal */}
              {showProductForm && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                      <button className="btn-close-modal" onClick={() => setShowProductForm(false)}>
                        <FaTimes />
                      </button>
                    </div>
                    <form onSubmit={handleSaveProduct} className="product-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Product Name *</label>
                          <input type="text" name="name" value={productForm.name} onChange={handleProductFormChange} required className="form-control" />
                        </div>
                        <div className="form-group">
                          <label>Brand</label>
                          <input type="text" name="brand" value={productForm.brand} onChange={handleProductFormChange} className="form-control" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" value={productForm.description} onChange={handleProductFormChange} rows="3" className="form-control" />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Price (₹) *</label>
                          <input type="number" name="price" value={productForm.price} onChange={handleProductFormChange} step="0.01" min="0.01" required className="form-control" />
                        </div>
                        <div className="form-group">
                          <label>Stock Quantity *</label>
                          <input type="number" name="stockQuantity" value={productForm.stockQuantity} onChange={handleProductFormChange} min="0" required className="form-control" />
                        </div>
                        <div className="form-group">
                          <label>Unit</label>
                          <select name="unit" value={productForm.unit} onChange={handleProductFormChange} className="form-control">
                            <option value="packet">Packet</option>
                            <option value="kg">Kg</option>
                            <option value="litre">Litre</option>
                            <option value="piece">Piece</option>
                            <option value="bag">Bag</option>
                            <option value="bottle">Bottle</option>
                            <option value="set">Set</option>
                            <option value="kit">Kit</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Category *</label>
                          <select name="categoryId" value={productForm.categoryId} onChange={handleProductFormChange} required className="form-control">
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Image URL</label>
                          <input type="url" name="imageUrl" value={productForm.imageUrl} onChange={handleProductFormChange} className="form-control" placeholder="https://..." />
                        </div>
                      </div>
                      <div className="form-group checkbox-group">
                        <label>
                          <input type="checkbox" name="isActive" checked={productForm.isActive} onChange={handleProductFormChange} />
                          Product is Active
                        </label>
                      </div>
                      <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={() => setShowProductForm(false)}>Cancel</button>
                        <button type="submit" className="btn-save"><FaSave /> {editingProduct ? 'Update' : 'Create'} Product</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Products Table */}
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>
                          <img src={product.imageUrl || 'https://via.placeholder.com/50'} alt="" className="table-img"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }} />
                        </td>
                        <td>{product.name}</td>
                        <td>{product.category?.name}</td>
                        <td>₹{product.price?.toFixed(2)}</td>
                        <td>{product.stockQuantity}</td>
                        <td>
                          <span className={`badge ${product.isActive ? 'badge-active' : 'badge-inactive'}`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-edit" onClick={() => openEditProduct(product)}>
                              <FaEdit />
                            </button>
                            <button className="btn-delete" onClick={() => handleDeleteProduct(product.id)}>
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ====== Orders Tab ====== */}
          {activeTab === 'orders' && (
            <div className="orders-content">
              <h3>All Orders ({orders.length})</h3>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.user?.fullName}<br /><small>{order.user?.email}</small></td>
                        <td>{order.items?.length} items</td>
                        <td>₹{order.totalAmount?.toFixed(2)}</td>
                        <td>{order.paymentMethod}</td>
                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td><span className={`order-status status-${order.status?.toLowerCase()}`}>{order.status}</span></td>
                        <td>
                          <select
                            className="status-select"
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ====== Users Tab ====== */}
          {activeTab === 'users' && (
            <div className="users-content">
              <h3>Registered Users ({users.length})</h3>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.fullName}</td>
                        <td>{u.email}</td>
                        <td>{u.phone || '-'}</td>
                        <td><span className={`badge ${u.role === 'ADMIN' ? 'badge-admin' : 'badge-user'}`}>{u.role}</span></td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
