import React, { useEffect, useState } from 'react';
import OrderList from '../components/OrderList';
import { getUserOrders } from '../services/apiService';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const userOrders = await getUserOrders();
            setOrders(userOrders);
        };
        fetchOrders();
    }, []);

    return (
        <div>
            <h2>My Orders</h2>
            <OrderList orders={orders} onSelect={(order) => alert(`Selected order ${order.id}`)} />
        </div>
    );
};

export default MyOrders;
