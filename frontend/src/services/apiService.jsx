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
// export const deleteOrder = async (orderId) => {
//     try {
//         const response = await axios.get(`/order/delete/${orderId}`);
//         return response.data;
//     } catch (error) {
//         console.error(`Error deleting order #${orderId}:`, error);
//         throw new Error(error.response?.data?.message || "Failed to delete order");
//     }
// };

// Update order status
// export const updateOrderStatus = async (orderId, status) => {
//     try {
//         const response = await axios.put(`/order/update/${orderId}`, { status });
//         return response.data;
//     } catch (error) {
//         console.error(`Error updating status for order #${orderId}:`, error);
//         throw new Error(error.response?.data?.message || "Failed to update order status");
//     }
// };

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
// export const getAllOrders = async () => {
//     try {
//         const response = await axios.get('/order/all');
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching all orders:", error);
//         throw new Error(error.response?.data?.message || "Failed to fetch all orders");
//     }
// };

// export const getUserOrders = async () => {
//     try {
//         const response = await axios.get('/order/customer');
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching user orders:", error);
//         throw new Error(error.response?.data?.message || "Failed to fetch user orders");
//     }
// };

//getAvailableItems
// export const getAvailableItems = async () => {
//     try {
//         const response = await axios.get('/order/available');
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching available items:", error);
//         throw new Error(error.response?.data?.message || "Failed to fetch available items");
//     }
// };

//bookItem
// export const bookItem = async (orderId) => {
//     try {
//         const response = await axios.put(`/order/book/${orderId}`);
//         return response.data;
//     } catch (error) {
//         console.error(`Error booking item #${orderId}:`, error);
//         throw new Error(error.response?.data?.message || "Failed to book item");
//     }
// }


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




  // Mock data
const mockOrders = [
    {
      id: 1,
      courier_id: 1,
      customer_id: 2,
      customer_name: 'John Doe',
      customer_phone: '123-456-7890',
      total_price: 150.75,
      pickup_location: '123 Main St, City A',
      dropoff_location: '456 Elm St, City B',
      package_details: '2 medium boxes, fragile',
      delivery_time: new Date().setDate(new Date().getDate() + 2),
      status: 'pending',
      items: [
        { id: 1, name: 'Box of Glassware', quantity: 2, weight: 5.5, price: 75.0 },
        { id: 2, name: 'Set of Books', quantity: 1, weight: 3.0, price: 75.75 },
      ],
    },
    {
      id: 2,
      courier_id: 3,
      customer_id: 4,
      customer_name: 'Jane Smith',
      customer_phone: '987-654-3210',
      total_price: 200.5,
      pickup_location: '789 Pine St, City C',
      dropoff_location: '101 Maple Ave, City D',
      package_details: '1 large box, contains electronics',
      delivery_time: new Date().setDate(new Date().getDate() + 3),
      status: 'in_transit',
      items: [
        { id: 3, name: 'Electronics Kit', quantity: 1, weight: 7.5, price: 200.5 },
      ],
    },
  ];
  
  // Simulate delay
  const simulateDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
  // Mock API functions
  export const getUserOrders = async () => {
    await simulateDelay(1000); // Simulate network delay
    return mockOrders.filter((order) => order.customer_id === 2); // Assuming user ID 2 is logged in
  };
  
  export const getOrderDetails = async (orderId) => {
    await simulateDelay(500); // Simulate network delay
    const order = mockOrders.find((order) => order.id === orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  };
  
  export const bookItem = async (orderId) => {
    await simulateDelay(500); // Simulate network delay
    const orderIndex = mockOrders.findIndex((order) => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    mockOrders[orderIndex].status = 'booked';
    return mockOrders[orderIndex];
  };

  //getAvailableItems
    export const getAvailableItems = async () => {
        await simulateDelay(500); // Simulate network delay
        return mockOrders;
    };
  
  export const logout = async () => {
    await simulateDelay(500);
    console.log('User logged out');
  };
  

  // reassignOrder
export const reassignOrder = async (orderId, newCourierId) => {
    try {
        await simulateDelay(500); // Simulate network delay
        const orderIndex = mockOrders.findIndex((order) => order.id === orderId);
        if (orderIndex === -1) {
            throw new Error('Order not found');
        }
        mockOrders[orderIndex].courier_id = newCourierId;
        return mockOrders[orderIndex];
    } catch (error) {
        console.error(`Error reassigning order #${orderId}:`, error);
        throw new Error('Failed to reassign order');
    }
}

//getAllOrders
export const getAllOrders = async () => {
    await simulateDelay(500); // Simulate network delay
    return mockOrders;
};

//updateOrderStatus
export const updateOrderStatus = async (orderId, newStatus) => {
    try {
        await simulateDelay(500); // Simulate network delay
        const orderIndex = mockOrders.findIndex((order) => order.id === orderId);
        if (orderIndex === -1) {
            throw new Error('Order not found');
        }
        mockOrders[orderIndex].status = newStatus;
        return mockOrders[orderIndex];
    } catch (error) {
        console.error(`Error updating status for order #${orderId}:`, error);
        throw new Error('Failed to update order status');
    }
}

//deleteOrder
export const deleteOrder = async (orderId) => {
    try {
        await simulateDelay(500); // Simulate network delay
        const orderIndex = mockOrders.findIndex((order) => order.id === orderId);
        if (orderIndex === -1) {
            throw new Error('Order not found');
        }
        mockOrders.splice(orderIndex, 1);
    } catch (error) {
        console.error(`Error deleting order #${orderId}:`, error);
        throw new Error('Failed to delete order');
    }
}