import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, Edit3, Package, Users, ShoppingCart, Calendar, Check, X } from 'lucide-react';
import { apiRequest } from '../services/api.js';

export const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'subscriptions'
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'HIGH PROTEIN',
    description: '',
    price: 199,
    stock: 50,
    image: '/images/salad_bowl.jpg',
    calories: 250,
    proteinGrams: 20,
    carbsGrams: 25,
    fatsGrams: 8,
    fiberGrams: 6,
  });

  const fetchData = async () => {
    try {
      const [statsRes, ordersRes, subsRes, prodsRes] = await Promise.all([
        apiRequest('/admin/stats'),
        apiRequest('/admin/orders'),
        apiRequest('/admin/subscriptions'),
        apiRequest('/store/products'),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (ordersRes.success) setOrders(ordersRes.orders || []);
      if (subsRes.success) setSubscriptions(subsRes.subscriptions || []);
      if (prodsRes.success) setProducts(prodsRes.products || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await apiRequest(`/admin/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (res.success) {
        setOrders(prev => prev.map(o => o._id === orderId ? res.order : o));
      }
    } catch (err) {
      alert('Failed to update order status: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product from store?')) return;
    try {
      const res = await apiRequest(`/admin/products/${id}`, { method: 'DELETE' });
      if (res.success) {
        setProducts(prev => prev.filter(p => p._id !== id));
      }
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await apiRequest('/admin/products', {
        method: 'POST',
        body: JSON.stringify({
          ...newProduct,
          nutrition: {
            calories: Number(newProduct.calories),
            proteinGrams: Number(newProduct.proteinGrams),
            carbsGrams: Number(newProduct.carbsGrams),
            fatsGrams: Number(newProduct.fatsGrams),
            fiberGrams: Number(newProduct.fiberGrams),
          },
        }),
      });
      if (res.success) {
        setProducts(prev => [res.product, ...prev]);
        setIsAddProductOpen(false);
      }
    } catch (err) {
      alert('Failed to add product: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          Admin Portal
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-2 tracking-tight">
          Store & Operations Management
        </h1>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase block">Total Orders</span>
          <span className="text-2xl font-extrabold text-gray-900">{stats?.totalOrders || 0}</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase block">Total Revenue</span>
          <span className="text-2xl font-extrabold text-emerald-700">₹{stats?.totalRevenue || 0}</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase block">Active Subscriptions</span>
          <span className="text-2xl font-extrabold text-purple-700">{stats?.activeSubscriptions || 0}</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase block">Store Products</span>
          <span className="text-2xl font-extrabold text-blue-700">{stats?.totalProducts || products.length}</span>
        </div>
      </div>

      {/* Tab Controls */}
      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
        <div className="flex gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'orders' ? 'bg-purple-600 text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Manage Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'products' ? 'bg-purple-600 text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Product Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'subscriptions' ? 'bg-purple-600 text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Subscriptions ({subscriptions.length})
          </button>
        </div>

        {activeTab === 'products' && (
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        )}
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-gray-900">Customer Orders</h3>
          {orders.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">No orders received yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((ord) => (
                <div key={ord._id} className="p-4 rounded-2xl bg-[#FBFBFA] border border-gray-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                  <div>
                    <span className="font-bold text-gray-900 block">
                      Order #{ord._id.slice(-8)} • ₹{ord.totalAmount}
                    </span>
                    <span className="text-gray-500 text-[11px]">
                      Customer: {ord.shippingAddress?.fullName} ({ord.shippingAddress?.phone}) • {ord.items?.length} items
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-medium">Status:</span>
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                      className="px-2.5 py-1 rounded-lg border border-gray-200 font-bold bg-white text-gray-900"
                    >
                      <option value="Placed">Placed</option>
                      <option value="Processing">Processing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-gray-900">Store Products Catalog</h3>
          <div className="space-y-3">
            {products.map((prod) => (
              <div key={prod._id} className="p-3.5 rounded-2xl bg-[#FBFBFA] border border-gray-200/80 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-gray-900">{prod.name}</h4>
                    <span className="text-gray-500 text-[11px]">
                      {prod.category} • ₹{prod.price} • Stock: {prod.stock || 50}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteProduct(prod._id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                  title="Delete product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SUBSCRIPTIONS */}
      {activeTab === 'subscriptions' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-gray-900">All Subscriptions</h3>
          {subscriptions.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">No subscriptions active.</p>
          ) : (
            <div className="space-y-3">
              {subscriptions.map((sub) => (
                <div key={sub._id} className="p-4 rounded-2xl bg-[#FBFBFA] border border-gray-200/80 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-gray-900">{sub.planType} ({sub.frequency})</h4>
                    <span className="text-gray-500 text-[11px]">
                      Next delivery: {sub.nextDeliveryDate} • Status: {sub.status}
                    </span>
                  </div>
                  <span className="font-extrabold text-emerald-700">₹{sub.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsAddProductOpen(false)}
              className="absolute top-5 right-5 text-gray-400 p-1.5 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-gray-900 mb-4">Add Product to VitaCare Store</h3>
            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-medium bg-gray-50"
                >
                  <option value="HIGH PROTEIN">HIGH PROTEIN</option>
                  <option value="HEALTHY BREAKFAST">HEALTHY BREAKFAST</option>
                  <option value="FRUITS & FRESH FOODS">FRUITS & FRESH FOODS</option>
                  <option value="HEALTHY READY-TO-EAT">HEALTHY READY-TO-EAT</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <textarea
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-medium resize-none h-16"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-sm"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
