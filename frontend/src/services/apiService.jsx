import axios from 'axios';

const API_URL = "http://localhost:8080";

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = false; // Only set to true if backend actually requires credentials

export const registerUser = async (userData) => {
    try {
        const response = await axios.post('/users', userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Registration error:", error.response || error.message);
        throw new Error(error.response?.data?.message || "Registration failed");
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await axios.get('/users/login', {
            params: credentials,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response || error.message);
        throw new Error(error.response?.data?.message || "Login failed");
    }
};

// Create an order
export const createOrder = async (orderData) => {
    try {
        const response = await axios.post('/order/create', orderData);
        return response.data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw new Error(error.response?.data?.message || "Failed to create order");
    }
};

// Get order by ID
export const getOrderById = async (orderId) => {
    try {
        const response = await axios.get(`/order/${orderId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching order #${orderId}:`, error);
        throw new Error(error.response?.data?.message || "Failed to fetch order details");
    }
};

// Delete order by ID
export const deleteOrder = async (orderId) => {
    try {
        const response = await axios.get(`/order/delete/${orderId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting order #${orderId}:`, error);
        throw new Error(error.response?.data?.message || "Failed to delete order");
    }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await axios.put(`/order/update/${orderId}`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error updating status for order #${orderId}:`, error);
        throw new Error(error.response?.data?.message || "Failed to update order status");
    }
};

// Get all orders by customer ID
export const getOrdersByCustomerId = async (customerId) => {
    try {
        const response = await axios.get(`/order/customer/${customerId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching orders for customer #${customerId}:`, error);
        throw new Error(error.response?.data?.message || "Failed to fetch customer orders");
    }
};

// Get all orders by courier ID
export const getOrdersByCourierId = async (courierId) => {
    try {
        const response = await axios.get(`/order/courier/${courierId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching orders for courier #${courierId}:`, error);
        throw new Error(error.response?.data?.message || "Failed to fetch courier orders");
    }
};

// Get all orders (Admin only)
export const getAllOrders = async () => {
    try {
        const response = await axios.get('/order/all');
        return response.data;
    } catch (error) {
        console.error("Error fetching all orders:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch all orders");
    }
};

export const getUserOrders = async () => {
    try {
        const response = await axios.get('/order/customer');
        return response.data;
    } catch (error) {
        console.error("Error fetching user orders:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch user orders");
    }
};


// getAssignedOrders
export const getAssignedOrders = async () => {
    try {
        const response = await axios.get('/order/courier');
        return response.data;
    } catch (error) {
        console.error("Error fetching assigned orders:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch assigned orders");
    }
};