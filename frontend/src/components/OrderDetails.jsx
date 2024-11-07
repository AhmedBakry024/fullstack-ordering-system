import React from 'react';

const OrderDetails = ({ order, onCancel }) => (
    <div>
        <h3>Order #{order.id}</h3>
        <p>Pickup Location: {order.pickupLocation}</p>
        <p>Drop-off Location: {order.dropOffLocation}</p>
        <p>Package Details: {order.packageDetails}</p>
        <p>Status: {order.status}</p>
        {order.status === 'pending' && <button onClick={onCancel}>Cancel Order</button>}
    </div>
);

export default OrderDetails;
