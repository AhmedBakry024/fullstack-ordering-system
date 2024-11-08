import React, { useEffect, useState } from 'react';
import { getAllOrdersByCustomerID, getAllOrders, createOrder } from '../services/apiService'; 
import { useNavigate } from 'react-router-dom'; 
import { FiLogOut, FiShoppingCart } from 'react-icons/fi'; 
import { useAuth } from '../context/AuthContext';

const CustomerDashboard = () => {
  const [orders, setOrders] = useState([]); // Define orders state
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [packageDetails, setPackageDetails] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { userId, logout } = useAuth();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [ordersData, itemsData] = await Promise.all([getAllOrdersByCustomerID(userId), getAllOrders()]);
        setOrders(ordersData); // Set orders state
        setItems(itemsData);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateOrder = async () => {
    const orderData = {
      customer_id: userId,
      courier_id: 0,
      pickup_location: pickupLocation,
      dropoff_location: dropoffLocation,
      package_details: packageDetails,
      delivery_time: new Date().toISOString(),
      items: [
        {
          id: selectedItem.id,
          name: selectedItem.name,
          quantity: quantity,
          weight: selectedItem.weight,
          price: selectedItem.price,
        },
      ],
    };

    try {
      await createOrder(orderData);
      alert('Order created successfully!');
      setSelectedItem(null); // Close the modal
    } catch (err) {
      alert('Failed to create order. Please try again.');
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
            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-800 flex-grow text-center">
              Available Items
            </h2>
            
            {/* Navigation Buttons */}
            <div className="flex items-center space-x-4">
              <button
                className="text-blue-600 text-2xl hover:text-blue-800 transition-colors"
                onClick={() => navigate('/my-orders')}
                title="Booked Orders"
              >
                <FiShoppingCart />
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
            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {items.map(item => (
                <div
                  key={item.id}
                  className="bg-white p-4 border rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex items-center mb-2">
                    <img 
                      src={`/api/placeholder/80/80`} 
                      alt={item.name} 
                      className="w-12 h-12 mr-4 rounded-md"
                    />
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                  </div>
                  <p className="text-gray-600">{item.package_details}</p>
                  <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full">
                    View Details
                  </button>
                </div>
              ))}
            </div>

            {/* Selected Item Modal */}
            {selectedItem && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-2xl font-bold mb-4">{selectedItem.name}</h3>
                  <p className="text-gray-700 mb-6">{selectedItem.package_details}</p>
                  <div className="mb-4">
                    <label className="block text-gray-700">Quantity</label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Pickup Location</label>
                    <input
                      type="text"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Dropoff Location</label>
                    <input
                      type="text"
                      value={dropoffLocation}
                      onChange={(e) => setDropoffLocation(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Package Details</label>
                    <input
                      type="text"
                      value={packageDetails}
                      onChange={(e) => setPackageDetails(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      onClick={handleCreateOrder}
                    >
                      Create Order
                    </button>
                    <button
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                      onClick={() => setSelectedItem(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Orders List */}
            <div className="mt-12">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">List of Orders</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders && orders.map(order => (
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
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;