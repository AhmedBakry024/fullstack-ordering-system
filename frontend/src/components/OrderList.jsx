import React from 'react';

const OrderList = ({ orders, onSelect }) => (
    <div>
        <h3>Orders</h3>
        <ul>
            {orders.map((order) => (
                <li key={order.id} onClick={() => onSelect(order)}>
                    <p>Order #{order.id}</p>
                    <p>Status: {order.status}</p>
                </li>
            ))}
        </ul>
    </div>
);

export default OrderList;
