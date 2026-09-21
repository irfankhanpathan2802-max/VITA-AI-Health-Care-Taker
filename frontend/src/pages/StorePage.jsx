import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingBag, Search, Filter, Sparkles, Package } from 'lucide-react';
import { apiRequest } from '../services/api.js';
import { ProductCard } from '../components/ProductCard.jsx';

export const StorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'ALL';

  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: 'ALL', label: 'All Products' },
    { id: 'HIGH PROTEIN', label: 'High Protein' },
    { id: 'HEALTHY BREAKFAST', label: 'Healthy Breakfast' },
    { id: 'FRUITS & FRESH FOODS', label: 'Fruits & Fresh' },
    { id: 'HEALTHY READY-TO-EAT', label: 'Ready-to-Eat' },
  ];

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      let endpoint = '/store/products';
      const params = new URLSearchParams();

      if (activeCategory !== 'ALL') {
        params.append('category', activeCategory);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }

      const res = await apiRequest(endpoint);
      if (res.success && res.products) {
        setProducts(res.products);
      }
    } catch (err) {
      console.error('Failed to load store products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-xl relative z-10">
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
            VitaCare Marketplace
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-3 mb-2 tracking-tight">
            Clean, Nutrient-Dense Food Access
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed mb-6">
            Explore freshly prepared clean meals, sprouted ragi, organic pulses, antioxidant fruits, and high-protein essentials delivered directly to your doorstep.
          </p>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSearchParams(cat.id === 'ALL' ? {} : { category: cat.id });
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search healthy products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray-200 text-xs font-medium text-gray-900 bg-white focus:border-emerald-500 shadow-xs"
          />
        </form>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No products found</h3>
          <p className="text-xs text-gray-400 mt-1">Try selecting a different category or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
