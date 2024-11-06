import React, { useEffect, useState } from 'react';
import OrderList from '../components/OrderList';
import { getAssignedOrders, updateOrderStatus } from '../services/apiService';

const AssignedOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchAssignedOrders = async () => {
            const assignedOrders = await getAssignedOrders();
            setOrders(assignedOrders);
        };
        fetchAssignedOrders();
    }, []);

    const handleStatusUpdate = async (orderId, status) => {
        await updateOrderStatus(orderId, status);
        alert(`Order #${orderId} marked as ${status}`);
    };

    return (
        <div>
            <h2>Assigned Orders</h2>
            <OrderList orders={orders} onSelect={(order) => handleStatusUpdate(order.id, 'accepted')} />
        </div>
    );
};

export default AssignedOrders;
