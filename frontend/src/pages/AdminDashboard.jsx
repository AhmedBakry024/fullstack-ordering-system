import React, { useEffect, useState, useContext } from 'react';
import { getAllOrders, updateOrderStatus, deleteOrder, assignOrderToCourier } from '../services/apiService';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Home, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      alert(`Order #${orderId} updated to ${newStatus}`);
    } catch (err) {
      alert('Failed to update order status.');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      alert(`Order #${orderId} deleted successfully.`);
    } catch (err) {
      alert('Failed to delete order.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleReassignOrder = async (orderId, newCourierId) => {
    try {
      await assignOrderToCourier(orderId, newCourierId, userId);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, courier_id: newCourierId } : order
        )
      );
      alert(`Order #${orderId} reassigned to courier #${newCourierId}`);
    } catch (err) {
      alert('Failed to reassign order.');
    }
  };

  if (loading) return <p>Loading all orders...</p>;
  if (error) return <p>{error}</p>;

  const assignedOrders = orders.filter((order) => order.courier_id !== 0);
  const unassignedOrders = orders.filter((order) => order.courier_id === 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="w-full bg-white shadow-sm p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button
              className="text-blue-600 hover:text-blue-800"
              onClick={() => alert('Navigate to home')}
              title="Home"
            >
              <Home size={24} />
            </button>
            <button
              className="text-red-600 hover:text-red-800"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Assigned Orders */}
        <Section title="Assigned Orders" orders={assignedOrders}>
          {assignedOrders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              handleStatusUpdate={handleStatusUpdate}
              handleDeleteOrder={handleDeleteOrder}
              handleReassignOrder={handleReassignOrder}
              showCourier
            />
          ))}
        </Section>

        {/* Unassigned Orders */}
        <Section title="Unassigned Orders" orders={unassignedOrders}>
          {unassignedOrders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              handleStatusUpdate={handleStatusUpdate}
              handleDeleteOrder={handleDeleteOrder}
              handleReassignOrder={handleReassignOrder}
            />
          ))}
        </Section>
      </div>
    </div>
  );
};

const Section = ({ title, orders, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">{title} ({orders.length})</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-800">
            <th className="py-2 px-4">Order ID</th>
            <th className="py-2 px-4">Customer</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Courier</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  </div>
);

const OrderRow = ({ order, handleStatusUpdate, handleDeleteOrder, handleReassignOrder, showCourier = false }) => (
  <tr className="border-b hover:bg-gray-50">
    <td className="py-2 px-4">{order.id}</td>
    <td className="py-2 px-4">{order.customer_name || 'N/A'}</td>
    <td className="py-2 px-4">
      <select
        value={order.status}
        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
        className="bg-white border rounded px-2 py-1"
      >
        <option value="pending">Pending</option>
        <option value="in_transit">In Transit</option>
        <option value="delivered">Delivered</option>
        <option value="canceled">Canceled</option>
      </select>
    </td>
    <td className="py-2 px-4">{showCourier ? `Courier #${order.courier_id}` : 'N/A'}</td>
    <td className="py-2 px-4 flex space-x-2">
      <button
        className="text-red-600 hover:text-red-800"
        onClick={() => handleDeleteOrder(order.id)}
        title="Delete"
      >
        <Trash2 size={18} />
      </button>
      <button title="Reassign Courier" className="text-blue-600 hover:text-blue-800">
        <select
          onChange={(e) => handleReassignOrder(order.id, e.target.value)}
          className="border rounded px-2"
        >
          <option value="">Assign</option>
          {[1, 2, 3, 4].map((id) => (
            <option key={id} value={id}>
              Courier #{id}
            </option>
          ))}
        </select>
      </button>
    </td>
  </tr>
);

export default AdminDashboard;
