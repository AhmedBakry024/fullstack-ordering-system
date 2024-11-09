import React, { useEffect, useState } from 'react';
import { createOrder } from '../services/apiService'; 
import { useNavigate } from 'react-router-dom'; 
import { FiLogOut, FiShoppingCart, FiTrash, FiPlus } from 'react-icons/fi'; 
import { useAuth } from '../context/AuthContext';

const CustomerDashboard = () => {
  const { user, userId, logout } = useAuth();
  const userName = user?.name || 'Customer';

  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    packageDetails: ''
  });

  const [items, setItems] = useState([{
    name: '',
    price: '',
    quantity: '1',
    weight: ''
  }]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const displayFirstName = (name) => {
    return name.split(' ')[0];
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, {
      name: '',
      price: '',
      quantity: '1',
      weight: ''
    }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const calculateTotalPrice = () => {
    return items.reduce((total, item) => {
      return total + (parseFloat(item.price || 0) * parseInt(item.quantity || 0));
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      courier_id: 32,
      customer_id: userId,
      customer_name: userName,
      customer_phone: user?.phone || '',
      total_price: calculateTotalPrice(),
      pickup_location: formData.pickupLocation,
      dropoff_location: formData.dropoffLocation,
      package_details: formData.packageDetails,
      order_items: items.map(item => ({
        name: item.name,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity),
        weight: parseFloat(item.weight)
      }))
    };

    try {
      await createOrder(orderData);
      alert('Order created successfully!');
      navigate('/my-orders');
    } catch (err) {
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="w-full bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 flex-grow mr-8">
              Welcome, {displayFirstName(userName)}!
            </h2>
            <div className="flex items-center space-x-6">
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

      {/* Order Form */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Location Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
                <textarea
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Dropoff Location</label>
                <textarea
                  name="dropoffLocation"
                  value={formData.dropoffLocation}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                  required
                />
              </div>
            </div>

            {/* Items Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-700">Items</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <FiPlus /> Add Item
                </button>
              </div>
              
              {items.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Item {index + 1}</h4>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Item Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price per Item ($)</label>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                        className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Quantity</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                      <input
                        type="number"
                        value={item.weight}
                        onChange={(e) => handleItemChange(index, 'weight', e.target.value)}
                        className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Package Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Package Details</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="packageDetails"
                  value={formData.packageDetails}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                  required
                />
              </div>
            </div>

            {/* Total Price Display */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-lg font-semibold text-gray-700">
                Total Price: ${calculateTotalPrice().toFixed(2)}
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
              >
                {loading ? 'Creating Order...' : 'Create Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;