import React from 'react';
import OrderForm from '../components/OrderForm';
import { createOrder } from '../services/apiService';

const CreateOrder = () => {
    const handleOrderSubmit = async (orderData) => {
        try {
            await createOrder(orderData);
            alert("Order created successfully!");
        } catch (error) {
            alert("Error creating order: " + error.message);
        }
    };

    return (
        <div>
            <h2>Create Order</h2>
            <OrderForm onSubmit={handleOrderSubmit} />
        </div>
    );
};

export default CreateOrder;
