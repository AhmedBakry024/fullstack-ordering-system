import React, { useEffect, useState } from 'react';
import { getAllOrdersByCourierID, updateOrderStatus } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const CourierDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId, logout } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getAllOrdersByCourierID(userId);
                setOrders(data);
            } catch (err) {
                setError('Failed to fetch assigned orders.' + userId);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    const acceptOrder = async (orderId) => {
        try {
            await updateOrderStatus(orderId, 'accepted');
            setOrders(orders.map(order => 
                order.id === orderId ? { ...order, status: 'accepted' } : order
            ));
        } catch (error) {
            alert("Failed to accept the order.");
        }
    };

    const declineOrder = async (orderId) => {
        try {
            await updateOrderStatus(orderId, 'declined');
            setOrders(orders.map(order => 
                order.id === orderId ? { ...order, status: 'declined' } : order
            ));
        } catch (error) {
            alert("Failed to decline the order.");
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId,userId, newStatus);
            setOrders(orders.map(order => 
                order.id === orderId ? { ...order,userId, status: newStatus } : order
            ));
            alert(`Order #${orderId} status updated to ${newStatus}`);
        } catch (error) {
            alert("Failed to update the order status.");
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
                        <p>Order #{order.id} - Status: {order.status}</p>
                        
                        {order.status === 'pending' ? (
                            <div>
                                <button onClick={() => acceptOrder(order.id)}>Accept</button>
                                <button onClick={() => declineOrder(order.id)}>Decline</button>
                            </div>
                        ) : (
                            <select
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                            >
                                <option value="accepted">Accepted</option>
                                <option value="picked up">Picked Up</option>
                                <option value="in transit">In Transit</option>
                                <option value="delivered">Delivered</option>
                                <option value="declined">Declined</option>
                            </select>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CourierDashboard;