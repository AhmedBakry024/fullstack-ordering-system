import React, { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus, deleteOrder, reassignOrder } from '../services/apiService';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (err) {
        setError('Failed to fetch all orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      alert(`Order #${orderId} updated to ${newStatus}`);
    } catch (err) {
      alert('Failed to update order status.');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      setOrders(orders.filter(order => order.id !== orderId));
      alert(`Order #${orderId} deleted successfully.`);
    } catch (err) {
      alert('Failed to delete order.');
    }
  };

  const handleReassignOrder = async (orderId, newCourierId) => {
    try {
      await reassignOrder(orderId, newCourierId);
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, courierId: newCourierId } : order
      ));
      alert(`Order #${orderId} reassigned to courier #${newCourierId}`);
    } catch (err) {
      alert('Failed to reassign order to a new courier.');
    }
  };

  if (loading) return <p>Loading all orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Manage Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Courier</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customerName || 'N/A'}</td>
              <td>{order.status}</td>
              <td>{order.courierId || 'N/A'}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="canceled">Canceled</option>
                </select>
                <button onClick={() => handleDeleteOrder(order.id)}>Delete</button>
                <select
                  onChange={(e) => handleReassignOrder(order.id, e.target.value)}
                >
                  <option value="">Reassign Courier</option>
                  {[1, 2, 3, 4, 5].map(courierId => (
                    <option key={courierId} value={courierId}>Courier #{courierId}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;