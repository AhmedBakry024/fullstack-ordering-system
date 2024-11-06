import React, { useEffect, useState } from 'react';
import OrderDetails from '../components/OrderDetails';
import { getOrderDetails, cancelOrder } from '../services/apiService';
import { useParams } from 'react-router-dom';

const OrderDetailsPage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            const details = await getOrderDetails(orderId);
            setOrder(details);
        };
        fetchOrderDetails();
    }, [orderId]);

    const handleCancel = async () => {
        await cancelOrder(orderId);
        alert("Order canceled");
    };

    return (
        <div>
            {order ? <OrderDetails order={order} onCancel={handleCancel} /> : <p>Loading...</p>}
        </div>
    );
};

export default OrderDetailsPage;
