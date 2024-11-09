import React, { useEffect, useState } from 'react';
import { getAllOrdersByCustomerID, deleteOrder, getOrderById, getUserFromId } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiHome } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courierName, setCourierName] = useState('Not assigned');

  const navigate = useNavigate();
  const { userId, logout } = useAuth();

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
  }, [userId]);

  useEffect(() => {
    const fetchCourierName = async () => {
      if (selectedOrder?.courier_id) {
        try {
          const courier = await getUserFromId(selectedOrder.courier_id);
          setCourierName(courier.name);
        } catch (err) {
          setCourierName('Not assigned');
        }
      }
    };

    fetchCourierName();
  }, [selectedOrder]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId, userId);
      setOrders(orders.filter(order => order.id !== orderId));
      alert(`Order #${orderId} canceled successfully.`);
      setSelectedOrder(null);
    } catch (err) {
      alert('Failed to cancel order.');
    }
  };

  const handleSelectOrder = async (orderId) => {
    try {
      const orderDetails = await getOrderById(orderId);
      setSelectedOrder(orderDetails);
    } catch (err) {
      alert('Failed to fetch order details.');
    }
  };



  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="w-full bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-800 flex-grow text-center">
              My Orders
            </h2>
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
        <div className="max-w-6xl mx-auto">
          {/* Orders List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white p-4 border rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => handleSelectOrder(order.id)}
              >
                <h3 className="text-xl font-semibold">Order #{order.id}</h3>
                <p className="text-gray-600">Status: {order.status}</p>
                <p className="text-gray-600">Pickup: {order.pickup_location}</p>
                <p className="text-gray-600">Dropoff: {order.dropoff_location}</p>
              </div>
            ))}
          </div>

          {/* Selected Order Details */}
          {selectedOrder && (
            <div className="mt-8 bg-white p-6 border rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Order Details</h2>
              <p><strong>Order ID:</strong> {selectedOrder.id}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Pickup Location:</strong> {selectedOrder.pickup_location}</p>
              <p><strong>Dropoff Location:</strong> {selectedOrder.dropoff_location}</p>
              <p><strong>Package Details:</strong> {selectedOrder.package_details}</p>
              <p><strong>Total Price:</strong> ${selectedOrder.total_price}</p>
              <p><strong>Courier:</strong>  {courierName}</p>
              <p><strong>Delivery Time:</strong> {new Date(selectedOrder.delivery_time).toLocaleString()}</p>

              {/* Add null check for items array */}
              {selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                <>
                  <h4 className="text-lg font-semibold mt-4">Items:</h4>
                  <ul className="list-disc list-inside">
                    {selectedOrder.order_items.map(item => (
                      <li key={item.id}>
                        {item.name} - Quantity: {item.quantity}, Price: ${item.price}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {selectedOrder.status === 'pending' && (
                <button
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                >
                  Cancel Order
                </button>
              )}
              <button
                className="mt-4 ml-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
