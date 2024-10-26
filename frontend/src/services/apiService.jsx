import axios from 'axios';

const API_URL = "http://localhost:8080"; // backend URL

export const registerUser = async (userData) => {
    try {
        const response = await axios.post('http://localhost:8080/users', userData);
        return response.data;
    } catch (error) {
        console.error("Registration error:", error.response || error.message);
        throw new Error(error.response?.data?.message || "Registration failed");
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await axios.get(`${API_URL}/users/login`, { params: credentials });
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response || error.message);
        throw new Error(error.response?.data?.message || "Login failed");
    }
};
