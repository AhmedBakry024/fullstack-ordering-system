import React, { useEffect, useState } from 'react';
import { getAllOrdersByCustomerID } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiHome } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, userId, userRole, logout } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getAllOrdersByCustomerID(userId);
        setOrders(ordersData);
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleLogout = () => {
    // Add logout logic here
    navigate('/login');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="w-full bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-800 flex-grow text-center">
              My Orders
            </h2>
            
            {/* Navigation Buttons */}
            <div className="flex items-center space-x-4">
              <button
                className="text-blue-600 text-2xl hover:text-blue-800 transition-colors"
                onClick={() => navigate('/home-page')}
                title="Home"
              >
                <FiHome />
              </button>
              <button
                className="text-red-600 text-2xl hover:text-red-800 transition-colors"
                onClick={handleLogout}
                title="Logout"
              >
                <FiLogOut />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Orders List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {orders.map(order => (
                <div
                  key={order.id}
                  className="bg-white p-4 border rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                >
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-semibold">Order #{order.id}</h3>
                  </div>
                  <p className="text-gray-600">Customer: {order.customer_name}</p>
                  <p className="text-gray-600">Phone: {order.customer_phone}</p>
                  <p className="text-gray-600">Pickup Location: {order.pickup_location}</p>
                  <p className="text-gray-600">Dropoff Location: {order.dropoff_location}</p>
                  <p className="text-gray-600">Status: {order.status}</p>
                  <p className="text-gray-600">Total Price: ${order.total_price}</p>
                  <p className="text-gray-600">Package Details: {order.package_details}</p>
                  <p className="text-gray-600">Delivery Time: {new Date(order.delivery_time).toLocaleString()}</p>
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold">Items:</h4>
                    <ul className="list-disc list-inside">
                      {order.items.map(item => (
                        <li key={item.id}>
                          {item.name} - Quantity: {item.quantity}, Weight: {item.weight}kg, Price: ${item.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;