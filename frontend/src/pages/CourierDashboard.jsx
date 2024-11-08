import React, { useEffect, useState } from 'react';
import { getAllOrdersByCourierID, updateOrderStatus } from '../services/apiService';

const CourierDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getAllOrdersByCourierID();
                setOrders(data);
            } catch (err) {
                setError('Failed to fetch assigned orders.');
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

    if (loading) return <p>Loading assigned orders...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Assigned Orders</h2>
            <ul>
                {orders.map(order => (
                    <li key={order.id}>
                        Order #{order.id} - {order.status}
                        <select 
                            value={order.status} 
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        >
                            <option value="pending">Pending</option>
                            <option value="in transit">In Transit</option>
                            <option value="delivered">Delivered</option>
                            <option value="canceled">Canceled</option>
                        </select>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CourierDashboard;
