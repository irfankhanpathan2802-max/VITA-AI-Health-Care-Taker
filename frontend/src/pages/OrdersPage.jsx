import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api.js';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiRequest('/store/orders');
        if (res.success && res.orders) {
          setOrders(res.orders);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
          Order History & Delivery
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Track the status of your healthy meal boxes and marketplace orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No orders placed yet</h3>
          <p className="text-xs text-gray-400 mt-1 mb-6">
            When you purchase clean meal boxes or ingredients, your delivery status will appear here.
          </p>
          <Link
            to="/store"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            Visit VitaCare Store
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">
                    Order ID: #{order._id.slice(-8)}
                  </span>
                  <span className="text-xs text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} item(s)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Status: {order.orderStatus}
                  </span>
                  <span className="text-sm font-extrabold text-gray-950">
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>

              {/* Items in order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-[#FBFBFA] p-3 rounded-2xl border border-gray-100">
                    <img src={item.productImage} alt={item.productName} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{item.productName}</h4>
                      <span className="text-[11px] text-gray-500">
                        Qty: {item.quantity} • ₹{item.price} each
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery ETA */}
              <div className="pt-2 flex items-center justify-between text-xs text-gray-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  Estimated Delivery: <strong className="text-gray-900">{order.deliveryEstimate || '2-3 Business Days'}</strong>
                </span>
                <span className="text-[11px] text-emerald-700 font-bold">
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
