import React, { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus, deleteOrder } from '../services/apiService';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const fetchedOrders = await getAllOrders();
                setOrders(fetchedOrders);
            } catch (err) {
                setError("Failed to fetch orders. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
        } catch (err) {
            alert("Failed to update order status.");
        }
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            await deleteOrder(orderId);
            setOrders(orders.filter(order => order.id !== orderId));
            alert(`Order ${orderId} deleted successfully.`);
        } catch (err) {
            alert("Failed to delete order.");
        }
    };

    if (loading) return <p>Loading orders...</p>;
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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customerName || "N/A"}</td>
                            <td>{order.status}</td>
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
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageOrders;
