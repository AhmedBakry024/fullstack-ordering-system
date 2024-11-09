import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const Homepage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const { user, userRole, logout } = useContext(AuthContext);

  useEffect(() => {
    if (userRole === "admin") {
      navigate("/admin-dashboard");
    }
    else if (userRole === "courier") {
      navigate("/courier-dashboard");
    }
    else if (userRole === "customer") {
      navigate("/home-page");
    }
  }, [userRole, navigate]);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogout = () => {
    logout();
    setMessage("You have been logged out successfully.");
  };

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen dark:bg-gray-900 text-slate-300 flex flex-col items-center justify-center">
        {user ? (
          <div className="text-center">
            <p className="text-xl font-bold">Name: {user.name}</p>
            <p className="text-xl">Email: {user.email}</p>
            <p className="text-xl">Phone: {user.phone}</p>
            <button
              onClick={handleLogout}
              className="mt-4 px-6 py-2 font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-5xl font-extrabold lg:text-7xl 2xl:text-8xl">
              <span className="text-transparent bg-gradient-to-br bg-clip-text from-teal-500 via-indigo-500 to-sky-500 dark:from-teal-200 dark:via-indigo-300 dark:to-sky-500">
                Shipment
              </span>
              <span className="text-transparent bg-gradient-to-tr bg-clip-text from-blue-500 via-pink-500 to-red-500 dark:from-sky-300 dark:via-pink-300 dark:to-red-500">
                Corporate
              </span>
            </h1>
            <p className="max-w-3xl mx-auto mt-6 text-lg text-gray-700 dark:text-white md:text-xl">
              Welcome to the best shipment service in the world. Login or register to get started.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={handleLogin}
                className="px-6 py-2 font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
              >
                Login
              </button>
              <button
                onClick={handleRegister}
                className="px-6 py-2 font-medium text-white transition-colors duration-300 transform bg-green-600 rounded-lg hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-80"
              >
                Register
              </button>
            </div>
            {message && (
              <p className="mt-4 text-lg text-green-500">{message}</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Homepage;
