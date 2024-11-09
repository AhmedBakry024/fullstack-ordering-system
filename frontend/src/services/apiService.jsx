import axios from 'axios';

const API_URL = "http://localhost:8080";

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = false; 

// User-related API functions
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

// Order-related API functions
export const createOrder = async (orderData) => {
    try {
        const response = await axios.post('/order/create', orderData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Create order error:", error.response || error.message);
        throw new Error(error.response?.data?.message || "Failed to create order");
    }
};

export const getOrderById = async (orderId) => {
    try {
        const response = await axios.get('/order', {
            params: { orderID: orderId },
        });
        return response.data;
    } catch (error) {
        console.error("Get order error:", error.response || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch order");
    }
};

export const deleteOrder = async (orderID,userID) => {
    try {
        const response = await axios.delete('/order/delete', {
            params: { 
                orderID: orderID,
                userID: userID,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Delete order error:", error.response || error.message);
        throw new Error(error.response?.data?.message || "Failed to delete order");
    }
};

export const updateOrderStatus = async (orderId, userId, status) => {
    try {
        const response = await axios.put('/order/update', null, {
            params: {
                orderID: orderId,
                userID: userId,
                status: status,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Update order status error:", error.response || error.message);
        throw new Error(error.response?.data?.message || "Failed to update order status");
    }
};

export const getAllOrdersByCustomerID = async (customerId) => {
    try {
        const response = await axios.get('/order/customer', {
            params: { customerID: customerId },
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch orders:", error.response || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch orders");
    }
};

export const getAllOrdersByCourierID = async (courierId) => {
    try {
        const response = await axios.get('/order/courier', {
            params: { courierID: courierId },
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Fetch courier orders error:", error.response || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch courier orders");
    }
};

export const assignOrderToCourier = async (orderId, courierId, userId) => {
    try {
        const response = await axios.put('/order/assign', null, {
            params: {
                orderID: orderId,
                courierID: courierId,
                userID: userId
            },
        });
        return response.data;
    } catch (error) {
        console.error("Assign order error:", error.response || error.message);
        throw new Error(error.response?.data?.message || "Failed to assign order");
    }
};

export const getAllOrders = async () => {
    try {
        const response = await axios.get('/order/all');
        return response.data;
    } catch (error) {
        console.error("Get all orders error:", error.response || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch all orders");
    }
};

// bookItem
export const bookItem = async (itemId, userId) => {
    try {
        const response = await axios.put('/order/book', null, {
            params: {
                itemId,
                userId,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Book item error:", error.response || error.message);
        throw new Error(error.response?.data?.message || "Failed to book item");
    }
};


export const getUserFromId = async (userId) => {
    try {
        if (!userId) {
            throw new Error("User ID is required");
        }
        const response = await axios.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Get user error:", error.response || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch user");
    }
};

///order/decline

export const declineOrder = async (orderId, userId) => {
    try {
        const response = await axios.put('/order/decline', null, {
            params: {
                orderID: orderId,
                userID: userId,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Decline order error:", error.response || error.message);
        throw new Error(error.response?.data?.message || "Failed to decline order");
    }
}