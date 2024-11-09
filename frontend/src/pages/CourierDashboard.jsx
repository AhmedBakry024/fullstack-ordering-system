import React, { useState, useEffect } from 'react';
import { Package, Truck, Check, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAllOrdersByCourierID, updateOrderStatus, declineOrder } from '../services/apiService';

const OrderStatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      picked_up: 'bg-purple-100 text-purple-800',
      in_transit: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      declined: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
      {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </span>
  );
};

const CourierDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrdersByCourierID(userId);
        setOrders(data);
      } catch (err) {
        setError('Failed to fetch assigned orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const acceptOrder = async (orderId) => {
    try {
      await updateOrderStatus(orderId, userId, 'accepted');
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: 'accepted' } : order
      ));
    } catch (error) {
      setError("Failed to accept the order.");
    }
  };

  const declineOrderRequest = async (orderId) => {
    try {
      await declineOrder(orderId, userId);
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: 'declined' } : order
      ));
    } catch (error) {
      setError("Failed to decline the order.");
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, userId, newStatus);
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      setError("Failed to update the order status.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courier Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your assigned deliveries</p>
        </div>
        <div className="flex items-center gap-4">
          <Truck className="h-6 w-6 text-blue-500" />
          <span className="text-sm font-medium">
            Active Orders: {orders.filter(o => !['delivered', 'declined'].includes(o.status)).length}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-50 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Order #{order.id}</span>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {order.status === 'pending' ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => acceptOrder(order.id)}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Accept
                    </button>
                    <button
                      onClick={() => declineOrderRequest(order.id)}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Decline
                    </button>
                  </div>
                ) : (
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="accepted">Accepted</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="declined">Declined</option>
                  </select>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Package className="w-4 h-4" />
                  <span>Status last updated: {new Date().toLocaleString()}</span>
                </div>
                {/* Order Details */}
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Pickup:</span>
                    <span>{order.pickup_location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Dropoff:</span>
                    <span>{order.dropoff_location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Package Details:</span>
                    <span>{order.package_details}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Total Price:</span>
                    <span>${order.total_price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Delivery Time:</span>
                    <span>{new Date(order.delivery_time).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourierDashboard;